import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { modelMetrics } from "@/lib/mockData";

const tooltipStyle = {
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  boxShadow: "0 1px 2px rgba(17, 24, 39, 0.05)",
};

export function DatasetOverviewChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={modelMetrics} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "#F0FDFA" }}
            contentStyle={tooltipStyle}
            formatter={(value, name, props) => [value, props.payload.label]}
          />
          <Bar dataKey="value" fill="#0D9488" radius={[8, 8, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
