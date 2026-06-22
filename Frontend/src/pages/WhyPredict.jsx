import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ArrowRight, HeartPulse, Utensils } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const concerns = [
  {
    icon: Activity,
    title: "Early Growth Disorders",
    body:
      "Many children show mismatches between chronological and biological age that, when caught early, can be managed effectively. A scan can help families decide when to seek specialist guidance.",
  },
  {
    icon: Utensils,
    title: "Nutritional Impact",
    body:
      "Poor diet and micronutrient deficiencies can delay skeletal maturation. A bone age scan tells you what height-weight charts cannot.",
  },
  {
    icon: HeartPulse,
    title: "Hormonal Conditions",
    body:
      "Conditions like growth hormone deficiency or precocious puberty are directly visible in bone age patterns. That information can support timely clinical decisions.",
  },
];

const comparisonRows = [
  ["Based on birthday", "Based on skeletal X-ray"],
  ["The same for every child", "Unique to each child's growth"],
  ["Cannot detect disorders", "Can reveal delays or advancement"],
  ["Tells you nothing about growth plate status", "Directly reflects growth plate maturation"],
];

const regionData = [
  { region: "Sub-Saharan Africa", children: 62.0, color: "#0D9488" }, // Teal
  { region: "South Asia", children: 56.0, color: "#0F766E" }, // Medium Teal
  { region: "East Asia & Pacific", children: 21.1, color: "#115E59" }, // Darker Teal
  { region: "Latin America & Caribbean", children: 4.8, color: "#14b8a6" }, // Light Teal
  { region: "Middle East & North Africa", children: 4.5, color: "#1A3557" }, // Primary Blue
  { region: "Rest of the World", children: 1.8, color: "#2563EB" }, // Blue
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-borderSoft bg-white p-3 shadow-clinical">
        <p className="text-xs font-semibold text-primary">{payload[0].payload.region}</p>
        <p className="mt-1 text-sm font-bold text-accent">
          {payload[0].value} Million <span className="text-xs font-normal text-textMuted">children affected</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function WhyPredict() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <section className="rounded-xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm md:px-12">
        <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-primary md:text-5xl">
          Is Your Child Growing as They Should?
        </h2>
        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-textMuted">
          Children today face nutritional gaps, hormonal shifts, and lifestyle pressures that can
          silently affect skeletal development, often years before symptoms appear. Traditional
          Greulich-Pyle atlas and Tanner-Whitehouse methods are time-consuming and observer-dependent.
          A left-hand bone age X-ray — analyzed by deep learning in seconds — gives clinicians a
          biological growth window independent of calendar age.
        </p>
      </section>

      {/* Concerns Section */}
      <section className="grid gap-5 py-12 lg:grid-cols-3">
        {concerns.map((concern) => {
          const Icon = concern.icon;

          return (
            <motion.div
              key={concern.title}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-primary">{concern.title}</h3>
                <p className="mt-3 leading-7 text-textMuted">{concern.body}</p>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* Global Impact Section */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8 mb-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">Global Scale</p>
            <h3 className="mt-1 text-2xl font-bold text-primary">Children Affected by Growth Disorders & Delays</h3>
            <p className="mt-3 text-sm leading-relaxed text-textMuted">
              Growth stunting and skeletal development delays affect over <strong className="text-primary">150 million children</strong> worldwide, largely driven by nutritional deficits, endocrinological conditions, and health disparities. Assessing biological bone age is vital for initiating timely therapies and monitoring developmental progress.
            </p>
            
            <div className="mt-6 h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="M"
                  />
                  <YAxis
                    dataKey="region"
                    type="category"
                    tick={{ fill: "#111827", fontSize: 11, fontWeight: 500 }}
                    width={150}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
                  <Bar dataKey="children" radius={[0, 4, 4, 0]} barSize={16}>
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-slate-50 border border-borderSoft/60 p-6">
            <div>
              <span className="inline-block rounded bg-primary text-[10px] font-bold text-white px-2 py-0.5 uppercase tracking-wide">
                Key Insights
              </span>
              <h4 className="mt-4 text-base font-bold text-primary">Skeletal Maturation Deficits</h4>
              <div className="mt-6 space-y-4">
                <div className="border-b border-borderSoft pb-4">
                  <p className="text-2xl font-extrabold text-accent">150.2M</p>
                  <p className="text-xs text-textMuted mt-0.5">Total Affected Children Globally</p>
                </div>
                <div className="border-b border-borderSoft pb-4">
                  <p className="text-lg font-bold text-primary">Sub-Saharan Africa</p>
                  <p className="text-xs text-textMuted mt-0.5">Highest regional burden (62.0 million)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">South Asia</p>
                  <p className="text-xs text-textMuted mt-0.5">Second highest burden (56.0 million)</p>
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-[11px] text-textMuted leading-relaxed border-t border-borderSoft pt-4">
              * Data sourced from regional pediatric stunting and growth delay reports, highlighting the critical need for automated skeletal maturation assessment tools in clinical workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="grid gap-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">Chronological Age</p>
          <div className="mt-5 space-y-4">
            {comparisonRows.map((row) => (
              <p key={row[0]} className="rounded-lg bg-background px-4 py-3 text-sm font-medium text-textMuted">
                {row[0]}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">
            Biological (Bone) Age
          </p>
          <div className="mt-5 space-y-4">
            {comparisonRows.map((row) => (
              <p key={row[1]} className="rounded-lg bg-teal-50 px-4 py-3 text-sm font-semibold text-primary">
                {row[1]}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-12 rounded-xl border border-teal-100 bg-teal-50 px-6 py-10 text-center">
        <p className="mx-auto max-w-2xl text-lg font-semibold leading-8 text-primary">
          Upload a left-hand X-ray and get a bone age estimate in seconds.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/predict">
            Try the Predictor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </PageTransition>
  );
}
