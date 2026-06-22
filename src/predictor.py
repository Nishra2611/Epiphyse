import os
import torch
import numpy as np

from model import BoneAgeNet
from preprocessing import preprocess_image

import torchvision.transforms as transforms

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "model",
    "phase2_best_FINAL.pt"
)

# -------------------------
# Load checkpoint
# -------------------------

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

model = BoneAgeNet()

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model.to(DEVICE)
model.eval()

# -------------------------
# Metadata from checkpoint
# -------------------------

LABEL_MEAN = checkpoint["label_mean"]
LABEL_STD = checkpoint["label_std"]
IMAGE_SIZE = checkpoint["image_size"]

# -------------------------
# Inference transforms
# -------------------------

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# -------------------------
# Denormalize prediction
# -------------------------

def denormalize(pred):
    return pred * LABEL_STD + LABEL_MEAN

# -------------------------
# Prediction function
# -------------------------

def predict_bone_age(
    image_path,
    gender
):
    img = preprocess_image(image_path)

    img = (img * 255).astype(np.uint8)

    image = transform(img)

    image = image.unsqueeze(0)

    image = image.to(DEVICE)

    gender_tensor = torch.tensor(
        [[float(gender)]],
        dtype=torch.float32
    ).to(DEVICE)

    with torch.no_grad():
        pred = model(
            image,
            gender_tensor
        )

    age = denormalize(pred.item())

    return round(age, 1)