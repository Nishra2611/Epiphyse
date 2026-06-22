import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Combine,
  ImageUp,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: ImageUp,
    title: "Upload X-ray",
    subtitle: "Step 1",
    body: "The patient uploads a left-hand X-ray image in a standard medical or image format.",
  },
  {
    icon: SlidersHorizontal,
    title: "Preprocess Image",
    subtitle: "Step 2",
    body: "CLAHE contrast enhancement (clip 1.5, tile 8×8), Otsu hand ROI extraction, background removal, letterbox resize to 512×512, and ImageNet normalization highlight growth plates, phalanges, carpals, and metacarpals.",
  },
  {
    icon: ScanSearch,
    title: "EfficientNet-B3 Feature Extraction",
    subtitle: "Step 3",
    body: "A pretrained EfficientNet-B3 backbone extracts a 1536-dimensional feature vector from the 380×380 inference input, capturing epiphyseal and bone maturity patterns across the hand.",
  },
  {
    icon: Combine,
    title: "Gender Feature Fusion",
    subtitle: "Step 4",
    body: "Male/Female passes through a 32-D embedding MLP (Linear + SiLU) and concatenates with image features into a 1568-D vector, enabling sex-specific skeletal maturation learning.",
  },
  {
    icon: BrainCircuit,
    title: "Predict Bone Age",
    subtitle: "Step 5",
    body: "The regression head outputs bone age in months. Optional test-time augmentation averages 5 augmented predictions for a more stable final estimate (validation MAE 8.01 months).",
  },
];

export default function Workflow() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">Clinical pipeline</p>
        <h2 className="mt-2 font-serif text-4xl leading-tight text-primary md:text-5xl">
          How Epiphyse Turns A Hand X-ray Into A Bone Age Estimate
        </h2>
      </section>

      <section className="mt-10 grid gap-4 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              className="contents"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-normal text-textMuted">
                    {step.subtitle}
                  </span>
                </div>
                <span className="mt-6 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-textMuted">{step.body}</p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden items-center justify-center text-textMuted xl:flex">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </section>

      <section className="mt-12 rounded-xl border border-gray-100 bg-white px-6 shadow-sm">
        <Accordion type="single" collapsible>
          <AccordionItem value="resolution">
            <AccordionTrigger>Why CLAHE and 512×512 preprocessing?</AccordionTrigger>
            <AccordionContent>
              Contrast Limited Adaptive Histogram Equalization (clip limit 1.5, tile 8×8) improves
              local contrast and highlights growth plate boundaries. Hand ROI detection via Otsu
              thresholding removes background noise. Images are letterbox-resized to 512×512, then
              fed to the model at 380×380 — preserving phalange and epiphyseal detail that standard
              224×224 ImageNet inputs would lose.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="gender">
            <AccordionTrigger>Why gender matters</AccordionTrigger>
            <AccordionContent>
              Skeletal maturation rates differ significantly between males (54.2%) and females
              (45.8%) in the RSNA dataset. Gender is encoded as a 32-dimensional embedding and
              fused with image features so BoneAgeNet learns distinct maturation patterns per sex.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="model">
            <AccordionTrigger>What the model learned</AccordionTrigger>
            <AccordionContent>
              EfficientNet-B3 was pretrained on ImageNet, then fine-tuned in two phases on 12,611
              labeled pediatric X-rays (11,349 train / 1,262 validation, stratified by age bins).
              Phase 1 trains the regression head only (8 epochs, MAE 13.52 mo); Phase 2 unfreezes the
              backbone with differential learning rates (MAE 8.20 mo). The final layer regresses a
              single continuous value — bone age in months.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tta">
            <AccordionTrigger>Test-Time Augmentation (TTA)</AccordionTrigger>
            <AccordionContent>
              At inference, 5 augmented versions of the input are predicted and averaged. This
              reduces prediction variance and improves validation MAE from 8.16 to 8.01 months
              (RMSE 10.77, bias −2.08 months).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="training">
            <AccordionTrigger>Training and optimization</AccordionTrigger>
            <AccordionContent>
              Optimized with AdamW (weight decay 1e-4) and Huber Loss. Gradient accumulation (×2)
              yields an effective batch size of 32. Mixed precision (AMP), gradient clipping (1.0),
              dropout (0.35 / 0.25), data augmentation, and early stopping reduce overfitting.
              Learning rate scheduling uses ReduceLROnPlateau in phase 1 and CosineAnnealingWarmRestarts
              in phase 2.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </PageTransition>
  );
}
