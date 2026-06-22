import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Linkedin, Github, Mail } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Card } from "@/components/ui/card";
import Naishaimp from "./profile/Naisha.jpeg";
import mokshitaimp from "./profile/Naisha.jpeg";
const members = [
  {
    name: "Naisha Gajkandh",
    role: "ML Engineer",
    detail: [
      "Implemented and trained ResNet50 and EfficientNet-B3 models in Kaggle.",
      "Developed training, evaluation, and inference pipelines.",
      "Integrated the model with backend API and worked on performance improvements."
    ],
    initials: "NG",
    image: Naishaimp, // Add photo path here (e.g. "/assets/team/naisha.jpg")
    linkedin: "https://www.linkedin.com/in/naisha-gajkandh-28b44a312/",
    github: "https://github.com/Naisha-Gajkandh",
    email: "mailto:naishagajkandh@gmail.com",
  },
  {
    name: "Nishra Gajkandh",
    role: "Preprocessing & Pipeline Architecture",
    detail: [
      "Researched deep learning architectures and proposed transition to EfficientNet-B3.",
      "Designed the preprocessing workflow and overall pipeline architecture.",
      "Managed dataset verification, cleaning, and preprocessing optimization."
    ],
    initials: "NG",
    image: "", // Add photo path here (e.g. "/assets/team/nishra.jpg")
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "mailto:nishra@example.com",
  },
  {
    name: "Nistha Patel",
    role: "Tester & Frontend Developer",
    detail: [
      "Developed the frontend UI/UX for the web application.",
      "Tested prediction workflows using sample X-ray images.",
      "Conducted functional testing and validated user workflows."
    ],
    initials: "NP",
    image: "", // Add photo path here (e.g. "/assets/team/nistha.jpg")
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "mailto:nistha@example.com",
  },
  {
    name: "Mokshita Pandit",
    role: "Tester & UI Designer",
    detail: [
      "Designed frontend development and UI refinement.",
      "Supported frontend-backend integration.",
      "Implemented image upload to test and prediction result interfaces."

    ],
    initials: "MP",
    image: mokshitaimp, // Add photo path here (e.g. "/assets/team/mokshita.jpg")
    linkedin: "https://www.linkedin.com/in/mokshita-pandit-4aaa0b317?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/Mokshita4207",
    email: "Mokshita4207@gmail.com",
  },
];

const acknowledgements = [
  ["Dataset", "RSNA Pediatric Bone Age Challenge — 12,611 images (1–228 months)"],
  ["Backbone", "EfficientNet-B3 + Gender Fusion (BoneAgeNet, 11.57M params)"],
  ["Performance", "Validation MAE 8.01 months (TTA) · RMSE 10.77 months"],
];

export default function AboutTeam() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <section className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
        <p className="mx-auto max-w-4xl font-serif text-4xl leading-tight text-primary md:text-5xl">
          Epiphyse was built to make pediatric bone age estimation accessible, explainable, and fast
          — using EfficientNet-B3 with gender fusion to achieve 8.01 months validation MAE on the RSNA
          dataset, without requiring a specialist at every step.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <motion.div
            key={`${member.name}-${member.role}`}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex aspect-[4/3] items-center justify-center bg-background overflow-hidden relative">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 font-mono text-2xl font-bold text-accent">
                      {member.initials}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold text-primary">{member.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-accent uppercase tracking-wider">{member.role}</p>
                  <ul className="mt-3 text-left list-disc pl-4 space-y-1 text-xs leading-relaxed text-textMuted flex-grow">
                    {member.detail.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="flex items-center gap-3 border-t border-borderSoft pt-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-textMuted hover:text-accent transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-textMuted hover:text-accent transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={member.email}
                      className="text-textMuted hover:text-accent transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  <div className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-primary">
                    <GraduationCap className="h-3.5 w-3.5 text-accent" />
                    CHARUSAT
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">Acknowledgements</p>
        <div className="mt-6 grid gap-4">
          {acknowledgements.map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 border-b border-borderSoft pb-4 last:border-b-0 last:pb-0 md:grid-cols-[160px_1fr]"
            >
              <p className="font-mono text-sm font-bold text-primary">{label}</p>
              <p className="text-sm leading-7 text-textMuted">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
