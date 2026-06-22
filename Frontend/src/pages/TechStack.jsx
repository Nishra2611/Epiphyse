import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Workflow as WorkflowIcon, X, BarChart3, Database } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/ui/card";

const techCards = [
  { logo: <svg viewBox="0 0 64 64" className="h-10 w-10" role="img" aria-label="React logo"><circle cx="32" cy="32" r="4" fill="#0D9488" /><ellipse cx="32" cy="32" rx="25" ry="9" fill="none" stroke="#0D9488" strokeWidth="3" /><ellipse cx="32" cy="32" rx="25" ry="9" fill="none" stroke="#0D9488" strokeWidth="3" transform="rotate(60 32 32)" /><ellipse cx="32" cy="32" rx="25" ry="9" fill="none" stroke="#0D9488" strokeWidth="3" transform="rotate(120 32 32)" /></svg>, name: "React + Vite", role: "Frontend UI" },
  { logo: <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-bold border-teal-100 bg-teal-50 text-accent">FA</span>, name: "FastAPI", role: "REST API server" },
  { logo: <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-bold border-blue-100 bg-blue-50 text-primary">PT</span>, name: "PyTorch", role: "BoneAgeNet training & TTA inference" },
  { logo: <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-bold border-teal-100 bg-teal-50 text-accent">CV</span>, name: "OpenCV", role: "Image preprocessing" },
  { logo: <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-bold border-blue-100 bg-blue-50 text-primary">RS</span>, name: "RSNA Dataset", role: "Training data" },
  { logo: <span className="flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-sm font-bold border-teal-100 bg-teal-50 text-accent">PY</span>, name: "Python 3.10", role: "Core language" },
];

const architecture = [
  "Input: 380 × 380 × 3 channels (inference)",
  "EfficientNet-B3 Backbone (ImageNet pretrained)",
  "1536-D Image Feature Vector",
  "32-D Gender Embedding (MLP + SiLU)",
  "1568-D Fused Feature Vector (concatenation)",
  "Regression Head: Linear(512) → Linear(128) → Linear(1)",
  "Output: Predicted Bone Age in months (Huber Loss)",
];

const datasetStats = [
  { label: "Total Images", value: "12,611", desc: "Complete cohort" },
  { label: "Male Images", value: "6,833", desc: "54.2% of dataset" },
  { label: "Female Images", value: "5,778", desc: "45.8% of dataset" },
  { label: "Min Bone Age", value: "1 month", desc: "Lower bound" },
  { label: "Max Bone Age", value: "228 months", desc: "19.0 years upper bound" },
  { label: "Mean Bone Age", value: "127.32 months", desc: "Skeletal maturity average" },
  { label: "Median Bone Age", value: "132.00 months", desc: "Skeletal maturity median" },
  { label: "Std Deviation", value: "41.18 months", desc: "Cohort variation" },
];

const datasetGraphs = [
  {
    src: "/assets/bone_age_dist_by_gender.png",
    title: "Bone Age Distribution by Gender",
    description: "Detailed histogram of skeletal bone ages separated by biological sex. Overlaid Kernel Density Estimation (KDE) lines highlight that male subjects peak slightly later in maturity distribution compared to female subjects."
  },
  {
    src: "/assets/age_group_distribution.png",
    title: "Age Group Distribution",
    description: "Skeletal maturation cohort sizes across standard pediatric development groups: Infants (0-2 years, 168 images), Early Childhood (3-5 years, 911 images), Middle Childhood (6-10 years, 4201 images), Early Adolescence (11-15 years, 6650 images), and Late Adolescence (16-19 years, 681 images)."
  },
  {
    src: "/assets/distribution_of_bone_age.png",
    title: "Distribution of Bone Age",
    description: "Overall skeletal age frequency distribution of the training cohort, indicating a bell-curve trend peaking in adolescence, reflecting standard clinic referral distributions."
  },
  {
    src: "/assets/gender_pie_chart.png",
    title: "Gender Cohort Balance",
    description: "Pie chart demonstrating the balanced representation of biological sex in the RSNA dataset, containing 54.2% male and 45.8% female subjects, preventing gender bias in predicted outcomes."
  }
];

export default function TechStack() {
  const prefersReducedMotion = useReducedMotion();
  const [activeGraph, setActiveGraph] = useState(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveGraph(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <PageTransition>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Model Architecture - Left Side */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-accent">
                  <WorkflowIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-normal text-accent">Model Architecture</p>
                  <h2 className="font-serif text-3xl text-primary">EfficientNet-B3 + Gender Fusion</h2>
                  <p className="mt-2 text-sm leading-6 text-textMuted">
                    BoneAgeNet — 11.57M parameters · two-stage fine-tuning · AMP · TTA MAE 8.01 months
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {architecture.map((item, index) => (
                  <div key={item} className="relative flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex-1 rounded-lg border border-borderSoft bg-background px-4 py-3 text-sm font-semibold text-primary">
                      {item}
                    </div>
                    {index < architecture.length - 1 && (
                      <span className="absolute left-[17px] top-9 h-4 w-px bg-borderSoft" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Tech Stack Cards - Right Side */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-6">
            <h3 className="font-serif text-xl text-primary mb-2">Core Tech Stack</h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Designed using standard ML interfaces, ensuring rapid pre-processing, gender vector integration, and real-time GPU-accelerated inference.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 flex-1">
            {techCards.map((card) => (
              <motion.div
                key={card.name}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border border-gray-100 p-4 hover:border-accent flex items-center gap-3">
                  {card.logo}
                  <div>
                    <h4 className="text-sm font-semibold text-primary">{card.name}</h4>
                    <p className="text-xs text-textMuted">{card.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Dataset & Statistics Section */}
      <section className="mt-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-borderSoft pb-4 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-accent">
            <Database className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-primary">Kaggle Training Dataset Metrics</h2>
            <p className="text-xs text-textMuted">RSNA Pediatric Bone Age Challenge Cohort Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {datasetStats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-background p-4 border border-borderSoft/60">
              <p className="text-xs font-semibold text-textMuted uppercase tracking-wider">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-[10px] text-accent font-medium">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Graphs Section */}
      <section className="mt-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-accent">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-primary">Visual Exploratory Data Analysis</h2>
            <p className="text-xs text-textMuted">Click on any chart to expand and inspect cohort distribution details</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {datasetGraphs.map((graph, index) => (
            <motion.div
              key={index}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              onClick={() => setActiveGraph(graph)}
              className="cursor-pointer group relative overflow-hidden rounded-xl border border-borderSoft bg-white shadow-sm transition-all hover:border-accent hover:shadow-md"
            >
              <div className="aspect-[16/9] overflow-hidden bg-background relative flex items-center justify-center p-2">
                <img
                  src={graph.src}
                  alt={graph.title}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-clinical">
                    Click to Inspect
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-borderSoft bg-white">
                <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
                  {graph.title}
                </h3>
                <p className="mt-1 text-xs text-textMuted line-clamp-2 leading-relaxed">
                  {graph.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Zoom Modal popup */}
      <AnimatePresence>
        {activeGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGraph(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
            >
              <button
                onClick={() => setActiveGraph(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-2 text-textMuted hover:bg-slate-200 hover:text-primary transition-colors dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 sm:p-8">
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-50 rounded-xl p-4 flex items-center justify-center dark:bg-slate-950">
                  <img
                    src={activeGraph.src}
                    alt={activeGraph.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="mt-6">
                  <span className="inline-block rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wide mb-2">
                    Kaggle Dataset Analysis
                  </span>
                  <h3 className="text-xl font-bold text-primary dark:text-white">
                    {activeGraph.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-textMuted dark:text-slate-400">
                    {activeGraph.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

