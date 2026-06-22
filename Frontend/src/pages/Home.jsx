import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ClipboardCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Hand3D from "@/components/Hand3D";

const stats = [
  { value: "12,611", label: "RSNA Training Images" },
  { value: "EfficientNet-B3", label: "BoneAgeNet Backbone" },
  { value: "8.01 mo", label: "Validation MAE (TTA)" },
  { value: "11.56M", label: "Trainable Parameters" },
];

const workflow = [
  { icon: Upload, label: "Upload X-ray" },
  { icon: UserRound, label: "Select Gender" },
  { icon: BrainCircuit, label: "ML Inference" },
  { icon: ClipboardCheck, label: "Bone Age Result" },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <section className="grid items-center gap-12 border-b border-borderSoft pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-xl"
          >
            <Hand3D />
          </motion.div>
          <p className="mt-4 text-center font-mono text-xs font-semibold text-textMuted">
            EfficientNet-B3 · Gender Fusion · Epiphyseal ROI Scan
          </p>
        </div>

        <div className="max-w-xl">
          <p className="font-serif text-6xl leading-none text-primary md:text-[56px]">Epiphyse</p>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-primary md:text-5xl">
            Model Predict Age
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-textMuted">
            Deep learning bone age estimation from left-hand X-rays using the RSNA Pediatric Bone
            Age Dataset. BoneAgeNet combines an EfficientNet-B3 backbone with gender feature
            fusion and two-stage transfer learning — achieving 8.01 months validation MAE with
            test-time augmentation. Built to assist pediatric radiologists, endocrinologists, and
            researchers in detecting growth disorders and reducing manual Greulich-Pyle assessment
            time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/predict">
                Predict Bone Age
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl">
              <Link to="/workflow">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-12 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative h-full overflow-hidden border-t-4 border-t-accent p-6">
              {!prefersReducedMotion && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: index * 0.4 }}
                />
              )}
              <p className="font-mono text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-textMuted">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">Quick workflow</p>
          <h2 className="mt-2 font-serif text-4xl text-primary">From Image To Estimate</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="contents"
              >
                <Card className="flex min-h-28 items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-primary">{step.label}</span>
                </Card>
                {index < workflow.length - 1 && (
                  <div className="hidden items-center justify-center text-textMuted lg:flex">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
