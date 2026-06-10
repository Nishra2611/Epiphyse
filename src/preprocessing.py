"""
Bone Age Estimation — Preprocessing Pipeline (v2)
===================================================
Senior ML Engineer rewrite. Fixes:
  ✓ 512×512 resolution (not 224 — too small for growth plates)
  ✓ Robust ROI crop using shape constraints (not just largest contour)
  ✓ No horizontal flip (anatomically unsafe for hand X-rays)
  ✓ No ColorJitter (meaningless on grayscale stacked as RGB)
  ✓ Proper CLAHE tuning with fallback
  ✓ RandomAffine instead of RandomResizedCrop (no finger removal)
  ✓ Stratified train/val split on age bins (not iloc)
  ✓ Random seeds everywhere
  ✓ Offline preprocessing actually used by Dataset
  ✓ Separate train / val / test splits
  ✓ Bone age label normalisation (critical for regression stability)
  ✓ Clean logging with per-stage timing
"""
from dotenv import load_dotenv
load_dotenv()

class CFG:
    CSV_PATH      = os.getenv("CSV_PATH",      "/kaggle/input/rsna-bone-age/boneage-training-dataset.csv")
    IMAGE_DIR     = os.getenv("IMAGE_DIR",      "/kaggle/input/rsna-bone-age/boneage-training-dataset/")
    PROCESSED_DIR = os.getenv("PROCESSED_DIR",  "/kaggle/working/processed_512")
    # ... rest unchanged

import os
import random
import time
import logging
import warnings

import cv2
import numpy as np
import pandas as pd
from PIL import Image

import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from sklearn.model_selection import train_test_split

warnings.filterwarnings("ignore", category=UserWarning)

# =============================================================================
# 0. GLOBAL SEEDS — set once, call before anything else
# =============================================================================

def set_seeds(seed: int = 42):
    """
    Fix all random sources so every run is reproducible.
    Call this as the very first line of any training script.
    """
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    # Makes CUDA ops deterministic (slight speed cost, worth it for research)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
    os.environ["PYTHONHASHSEED"] = str(seed)


# =============================================================================
# 1. LOGGER
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("bone_age")


# =============================================================================
# 2. CONSTANTS
# =============================================================================

# 512×512 — minimum viable resolution for growth plate detail
# Top RSNA solutions use 512–768. Start at 512; upgrade if GPU allows.
IMAGE_SIZE = 512

# ImageNet mean/std — required because we stack grayscale→RGB for
# pretrained ResNet/EfficientNet/ConvNeXt weights
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# Label normalisation: bone age in months ranges ~1–228 in RSNA.
# Normalising to ~[0, 1] stabilises regression gradients significantly.
# MAE reported in months = model output × LABEL_STD + LABEL_MEAN
# These are approximate RSNA dataset statistics; recompute from your split.
LABEL_MEAN = 127.3   # months (approx mean of RSNA training set)
LABEL_STD  = 41.2    # months (approx std  of RSNA training set)


def normalise_label(age_months: float) -> float:
    return (age_months - LABEL_MEAN) / LABEL_STD

def denormalise_label(normalised: float) -> float:
    return normalised * LABEL_STD + LABEL_MEAN


# =============================================================================
# 3. STAGE 1 — Load & Verify Dataset
# =============================================================================

def verify_dataset(csv_path: str, image_dir: str) -> pd.DataFrame:
    """
    Load CSV, validate every image, return a clean DataFrame.
    Logs a summary of missing/corrupt files.
    """
    t0 = time.time()
    log.info("Stage 1 — Loading and verifying dataset")

    df = pd.read_csv(csv_path)
    df.columns = [c.strip().lower() for c in df.columns]

    # Validate required columns
    required = {"id", "boneage", "male"}
    missing_cols = required - set(df.columns)
    if missing_cols:
        raise ValueError(f"CSV missing columns: {missing_cols}")

    # Fix gender encoding — RSNA CSV stores True/False as strings sometimes
    df["male"] = df["male"].map(
        {True: 1, False: 0, "True": 1, "False": 0, 1: 1, 0: 0}
    ).astype(int)

    df["boneage"] = df["boneage"].astype(float)

    # Validate each file
    valid, n_missing, n_corrupt = [], 0, 0
    for _, row in df.iterrows():
        path = os.path.join(image_dir, f"{int(row['id'])}.png")
        if not os.path.exists(path):
            n_missing += 1
            continue
        try:
            with Image.open(path) as im:
                im.verify()
            valid.append(row)
        except Exception:
            n_corrupt += 1

    clean = pd.DataFrame(valid).reset_index(drop=True)

    log.info(f"  CSV rows       : {len(df)}")
    log.info(f"  Missing files  : {n_missing}")
    log.info(f"  Corrupt files  : {n_corrupt}")
    log.info(f"  Valid samples  : {len(clean)}")
    log.info(f"  Age range      : {clean['boneage'].min():.0f}–"
             f"{clean['boneage'].max():.0f} months")
    log.info(f"  Done in {time.time()-t0:.1f}s\n")
    return clean


# =============================================================================
# 4. STAGE 2 — Load Image as Grayscale Float [0, 1]
# =============================================================================

def load_as_float(path: str) -> np.ndarray:
    """
    Load PNG as single-channel float32 in [0, 1].
    Handles both 8-bit and 16-bit X-rays correctly.
    """
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise IOError(f"Cannot read image: {path}")

    # Convert to single channel if it was saved as RGB-grayscale
    if img.ndim == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Normalise based on actual bit depth
    if img.dtype == np.uint16:
        img = img.astype(np.float32) / 65535.0
    else:
        img = img.astype(np.float32) / 255.0

    return img   # shape: (H, W), dtype: float32, range: [0.0, 1.0]


# =============================================================================
# 5. STAGE 3 — CLAHE Contrast Enhancement
# =============================================================================

def apply_clahe(img: np.ndarray, clip_limit: float = 1.5) -> np.ndarray:
    """
    CLAHE (Contrast Limited Adaptive Histogram Equalisation).

    Why clip_limit=1.5 instead of 2.0:
      Higher values amplify noise in already-bright regions of X-rays.
      1.5 gives better growth-plate contrast without over-sharpening.
      Tune this: try 1.0, 1.5, 2.0 and compare validation MAE.

    Falls back gracefully if CLAHE somehow fails.
    """
    try:
        img_u8 = (img * 255).astype(np.uint8)
        clahe  = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
        result = clahe.apply(img_u8)
        return result.astype(np.float32) / 255.0
    except Exception as e:
        log.warning(f"CLAHE failed ({e}), using raw image")
        return img


# =============================================================================
# 6. STAGE 4 — Background Removal & ROI Crop
# =============================================================================

def crop_hand_roi(img: np.ndarray, margin: float = 0.04) -> np.ndarray:
    """
    Isolate the hand and crop to its bounding box.

    Improvement over simple 'largest contour':
      Uses connected components + shape constraints to reject artifacts.
      The hand region must be:
        • at least 15% of image area  (rejects small labels/markers)
        • aspect ratio between 0.3–2.5 (rejects thin horizontal lines)
        • not touching all 4 image borders (rejects background frames)

    Falls back to the full image if no valid region is found.
    """
    h, w = img.shape

    img_u8 = (img * 255).astype(np.uint8)

    # Otsu threshold — finds optimal foreground/background split
    _, binary = cv2.threshold(
        img_u8, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    # Close small holes so the hand is one solid region
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN,  kernel)

    # Label connected components
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
        binary, connectivity=8
    )

    best_region = None
    best_area   = 0
    min_area    = 0.15 * h * w    # hand must be at least 15% of image

    for label_id in range(1, n_labels):   # skip background (label 0)
        x  = stats[label_id, cv2.CC_STAT_LEFT]
        y  = stats[label_id, cv2.CC_STAT_TOP]
        rw = stats[label_id, cv2.CC_STAT_WIDTH]
        rh = stats[label_id, cv2.CC_STAT_HEIGHT]
        area = stats[label_id, cv2.CC_STAT_AREA]

        if area < min_area:
            continue

        # Reject thin horizontal/vertical artifacts (rulers, labels)
        aspect_ratio = rw / rh if rh > 0 else 0
        if not (0.3 <= aspect_ratio <= 2.5):
            continue

        # Reject regions that fill the entire image (background noise)
        border_touch = (x <= 2 and x + rw >= w - 2 and
                        y <= 2 and y + rh >= h - 2)
        if border_touch:
            continue

        if area > best_area:
            best_area   = area
            best_region = (x, y, rw, rh)

    if best_region is None:
        log.debug("ROI crop: no valid hand region found, using full image")
        return img

    x, y, rw, rh = best_region

    # Add margin so we don't cut fingertips
    pad_x = int(margin * rw)
    pad_y = int(margin * rh)
    x1 = max(0,     x  - pad_x)
    y1 = max(0,     y  - pad_y)
    x2 = min(w - 1, x  + rw + pad_x)
    y2 = min(h - 1, y  + rh + pad_y)

    return img[y1:y2, x1:x2]


# =============================================================================
# 7. STAGE 5 — Letterbox Resize to 512×512
# =============================================================================

def letterbox_resize(img: np.ndarray, size: int = IMAGE_SIZE) -> np.ndarray:
    """
    Resize to size×size while preserving aspect ratio.
    Pads with black (0.0) — does NOT stretch or squash the hand.

    Why letterbox and not direct resize:
      A hand X-ray is portrait (taller than wide). Direct resize to a square
      compresses bone widths, distorting the proportions the model learns from.
    """
    h, w = img.shape[:2]
    scale = size / max(h, w)
    new_h = int(round(h * scale))
    new_w = int(round(w * scale))

    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    canvas   = np.zeros((size, size), dtype=np.float32)
    top  = (size - new_h) // 2
    left = (size - new_w) // 2
    canvas[top:top + new_h, left:left + new_w] = resized

    return canvas


# =============================================================================
# 8. STAGE 6 — Grayscale → 3-Channel
# =============================================================================

def to_3channel(img: np.ndarray) -> np.ndarray:
    """
    Stack grayscale image into 3 identical channels.
    Required because pretrained ResNet/EfficientNet/ConvNeXt expects
    3-channel input — their first conv layer has shape [64, 3, 7, 7].

    Result shape: (512, 512, 3), dtype float32, range [0, 1]
    """
    return np.stack([img, img, img], axis=-1)


# =============================================================================
# 9. FULL PIPELINE — Stages 2–6 chained
# =============================================================================

def preprocess_image(path: str) -> np.ndarray:
    """
    Run the full offline preprocessing chain on one image.

    Returns:
        np.ndarray shape (512, 512, 3), float32, range [0, 1]
    """
    img = load_as_float(path)         # Stage 2: load + normalise
    img = apply_clahe(img)            # Stage 3: contrast enhancement
    img = crop_hand_roi(img)          # Stage 4: background removal + ROI crop
    img = letterbox_resize(img)       # Stage 5: 512×512 letterbox
    img = to_3channel(img)            # Stage 6: grayscale → RGB
    return img


# =============================================================================
# 10. OFFLINE PREPROCESSING — Run once, save to disk
# =============================================================================

def preprocess_and_save(
    df: pd.DataFrame,
    image_dir: str,
    output_dir: str,
) -> None:
    """
    Preprocess every image (Stages 2–6) and save as .npy.
    Skip images already processed (safe to re-run).

    Call this ONCE before training. BoneAgeDataset reads from output_dir,
    so training epochs never redo the expensive CPU work.
    """
    os.makedirs(output_dir, exist_ok=True)
    errors = 0
    skipped = 0

    log.info(f"Offline preprocessing → {output_dir}")
    t0 = time.time()

    for i, row in df.iterrows():
        img_id   = int(row["id"])
        src      = os.path.join(image_dir,  f"{img_id}.png")
        dst      = os.path.join(output_dir, f"{img_id}.npy")

        if os.path.exists(dst):
            skipped += 1
            continue

        try:
            arr = preprocess_image(src)    # (512, 512, 3) float32
            np.save(dst, arr)
        except Exception as e:
            log.error(f"  Failed [{img_id}]: {e}")
            errors += 1

        if (i + 1) % 500 == 0:
            elapsed = time.time() - t0
            log.info(f"  {i+1}/{len(df)} images  ({elapsed:.0f}s elapsed)")

    log.info(f"  Done. Skipped={skipped}  Errors={errors}  "
             f"Total time={time.time()-t0:.1f}s\n")


# =============================================================================
# 11. STAGE 7 & 8 — PyTorch Transforms (norm + augmentation)
# =============================================================================

def get_transforms(mode: str = "train") -> transforms.Compose:
    """
    Returns appropriate torchvision transforms.

    train: augmentation  + ImageNet normalisation
    val  : only ImageNet normalisation  (no augmentation — ever)
    test : only ImageNet normalisation  (no augmentation — ever)

    Augmentation choices — why each was selected:
      RandomRotation(10)       — X-rays sometimes captured slightly tilted
      RandomAffine(translate)  — small position variation across scanner beds
      RandomAffine(scale)      — simulate varying zoom/distance to detector
      RandomAdjustSharpness    — mimics varying X-ray sharpness settings
      NO horizontal flip       — all RSNA images are left hands; flip creates
                                 anatomically wrong right-hand data
      NO ColorJitter           — image is grayscale stacked ×3; ColorJitter
                                 was designed for natural RGB and creates
                                 unrealistic channel imbalances
      NO RandomResizedCrop     — randomly cuts fingers/thumb, which are
                                 primary bone age indicators
    """
    if mode == "train":
        return transforms.Compose([
            transforms.ToPILImage(),

            # Rotation: hand positioning varies ±10° on the X-ray plate
            transforms.RandomRotation(degrees=10),

            # Affine: small translation + scale, zero shear
            # translate=0.03 → max 3% shift (~15px at 512)
            # scale=(0.95, 1.05) → ±5% zoom — keeps all fingers in frame
            transforms.RandomAffine(
                degrees=0,
                translate=(0.03, 0.03),
                scale=(0.95, 1.05),
            ),

            # Sharpness: simulates different X-ray detector sharpness settings
            # Does not change intensity distribution (unlike ColorJitter)
            transforms.RandomAdjustSharpness(sharpness_factor=1.5, p=0.3),

            # Convert to tensor and normalise with ImageNet stats
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])

    else:  # val or test — absolutely no randomness
        return transforms.Compose([
            transforms.ToPILImage(),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])


# =============================================================================
# 12. STRATIFIED TRAIN / VAL / TEST SPLIT
# =============================================================================

def split_dataset(
    df: pd.DataFrame,
    val_size:  float = 0.10,
    test_size: float = 0.10,
    seed: int = 42,
    n_bins: int = 10,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Stratified split into train / val / test.

    Why stratify:
      RSNA has unequal age group sizes (more teenagers, fewer infants).
      A random iloc split could put all infants in train and none in val.
      Stratification ensures every age group is proportionally represented
      in all three splits — otherwise val MAE is misleading.

    Process:
      1. Bin bone ages into n_bins equal-width buckets
      2. Use bin labels as the stratification key
      3. Split train → (val + test), then split (val + test) → val / test
    """
    df = df.copy()

    # Create age bins for stratification
    df["_age_bin"] = pd.cut(
        df["boneage"],
        bins=n_bins,
        labels=False,
        include_lowest=True,
    )

    # First split: extract val+test from full dataset
    train_df, valtest_df = train_test_split(
        df,
        test_size=val_size + test_size,
        stratify=df["_age_bin"],
        random_state=seed,
        shuffle=True,
    )

    # Second split: divide valtest evenly into val and test
    relative_test = test_size / (val_size + test_size)
    val_df, test_df = train_test_split(
        valtest_df,
        test_size=relative_test,
        stratify=valtest_df["_age_bin"],
        random_state=seed,
        shuffle=True,
    )

    # Drop the temporary bin column
    for split in (train_df, val_df, test_df):
        split.drop(columns=["_age_bin"], inplace=True)

    log.info("Stratified split complete:")
    log.info(f"  Train : {len(train_df):>5}  "
             f"age {train_df['boneage'].mean():.1f} ± {train_df['boneage'].std():.1f} months")
    log.info(f"  Val   : {len(val_df):>5}  "
             f"age {val_df['boneage'].mean():.1f} ± {val_df['boneage'].std():.1f} months")
    log.info(f"  Test  : {len(test_df):>5}  "
             f"age {test_df['boneage'].mean():.1f} ± {test_df['boneage'].std():.1f} months")
    log.info("  (Check: train/val/test age means should be very similar)\n")

    return (
        train_df.reset_index(drop=True),
        val_df.reset_index(drop=True),
        test_df.reset_index(drop=True),
    )


# =============================================================================
# 13. PYTORCH DATASET
# =============================================================================

class BoneAgeDataset(Dataset):
    """
    Loads preprocessed .npy images from disk (not raw PNGs).
    Applies transforms (augmentation + normalisation) on-the-fly.

    Each __getitem__ returns:
        image  : Tensor (3, 512, 512) — normalised
        gender : Tensor scalar        — 0.0 (female) or 1.0 (male)
        label  : Tensor scalar        — bone age in months, NORMALISED
                                        use denormalise_label() to recover months
    """

    def __init__(
        self,
        df: pd.DataFrame,
        processed_dir: str,
        mode: str = "train",
    ):
        self.df            = df.reset_index(drop=True)
        self.processed_dir = processed_dir
        self.transform     = get_transforms(mode)

    def __len__(self) -> int:
        return len(self.df)

    def __getitem__(self, idx: int):
        row    = self.df.iloc[idx]
        img_id = int(row["id"])

        # Load offline-preprocessed image (fast — no CLAHE/crop at runtime)
        npy_path = os.path.join(self.processed_dir, f"{img_id}.npy")
        img_arr  = np.load(npy_path)                  # (512, 512, 3) float32

        # Convert to uint8 for PIL-based transforms
        img_u8 = (img_arr * 255).clip(0, 255).astype(np.uint8)

        # Stage 7 + 8: augmentation + ImageNet normalisation
        image  = self.transform(img_u8)               # (3, 512, 512) float32 tensor

        # Stage 9: gender scalar
        gender = torch.tensor(float(row["male"]), dtype=torch.float32)

        # Normalised label (stabilises regression training)
        label  = torch.tensor(
            normalise_label(float(row["boneage"])),
            dtype=torch.float32,
        )

        return image, gender, label


# =============================================================================
# 14. DATALOADER FACTORY
# =============================================================================

def build_dataloaders(
    train_df:      pd.DataFrame,
    val_df:        pd.DataFrame,
    test_df:       pd.DataFrame,
    processed_dir: str,
    batch_size:    int = 16,
    num_workers:   int = 4,
) -> tuple[DataLoader, DataLoader, DataLoader]:
    """
    Build all three DataLoaders.

    batch_size=16 is conservative for 512×512.
    For 224×224 you can use 32–64. Adjust based on your GPU VRAM.
    Rule of thumb: double the resolution → quarter the batch size.
    """
    train_ds = BoneAgeDataset(train_df, processed_dir, mode="train")
    val_ds   = BoneAgeDataset(val_df,   processed_dir, mode="val")
    test_ds  = BoneAgeDataset(test_df,  processed_dir, mode="test")

    train_loader = DataLoader(
        train_ds,
        batch_size=batch_size,
        shuffle=True,             # shuffle training data every epoch
        num_workers=num_workers,
        pin_memory=True,          # faster GPU transfer
        drop_last=True,           # avoid incomplete final batch with batch norm
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=batch_size,
        shuffle=False,            # never shuffle val/test
        num_workers=num_workers,
        pin_memory=True,
    )
    test_loader = DataLoader(
        test_ds,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True,
    )

    log.info(f"DataLoaders ready  "
             f"train={len(train_ds)}  val={len(val_ds)}  test={len(test_ds)}")

    return train_loader, val_loader, test_loader


# =============================================================================
# 15. PIPELINE RUNNER — call this from train.py
# =============================================================================

def run_preprocessing_pipeline(
    csv_path:      str,
    image_dir:     str,
    processed_dir: str,
    val_size:      float = 0.10,
    test_size:     float = 0.10,
    batch_size:    int   = 16,
    num_workers:   int   = 4,
    seed:          int   = 42,
) -> tuple[DataLoader, DataLoader, DataLoader]:
    """
    Full pipeline entry point. Call once from train.py:

        train_loader, val_loader, test_loader = run_preprocessing_pipeline(
            csv_path      = "data/train.csv",
            image_dir     = "data/train",
            processed_dir = "data/processed_512",
        )

    Returns three DataLoaders ready for training.
    """
    # 0. Seeds first — before any randomness happens
    set_seeds(seed)

    # 1. Verify
    df = verify_dataset(csv_path, image_dir)

    # 2-6. Offline preprocessing (skips already-done images)
    preprocess_and_save(df, image_dir, processed_dir)

    # Stratified split
    train_df, val_df, test_df = split_dataset(
        df, val_size=val_size, test_size=test_size, seed=seed
    )

    # 7-9. DataLoaders (transforms + gender fusion)
    return build_dataloaders(
        train_df, val_df, test_df,
        processed_dir=processed_dir,
        batch_size=batch_size,
        num_workers=num_workers,
    )
