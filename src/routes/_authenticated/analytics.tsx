import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Legend,
} from "recharts";

import { ChartCard, PageHeader } from "@/components/page-shell";
import {
  ACTIVITY_HEATMAP,
  CUSTOMER_SCATTER,
  PRODUCT_PERFORMANCE,
  PURCHASE_BEHAVIOUR,
  SCORE_DISTRIBUTION,
} from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | AI Product Recommendation System" },
      {
        name: "description",
        content:
          "Deep analytics on recommendation scores, purchase behaviour, product performance and customer activity.",
      },
      { property: "og:title", content: "Analytics" },
      { property: "og:description", content: "Score distributions, behaviour trends and activity heatmaps." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
};

function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="How the model scores products, how customers behave, and when your store is busiest."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Recommendation score distribution" subtitle="Sigmoid output banded across predictions">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCORE_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="band" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="oklch(0.62 0.2 258)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Purchase behaviour" subtitle="Average basket size vs repeat purchases">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PURCHASE_BEHAVIOUR}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="basket" stroke="oklch(0.58 0.24 292)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="repeat" stroke="oklch(0.7 0.16 200)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product performance" subtitle="Model quality across recommendation metrics">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={PRODUCT_PERFORMANCE}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" stroke="var(--muted-foreground)" fontSize={12} />
              <PolarRadiusAxis stroke="var(--border)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Radar
                dataKey="value"
                stroke="oklch(0.58 0.24 292)"
                fill="oklch(0.58 0.24 292)"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders vs lifetime spend" subtitle="Each point is a customer in the dataset">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="orders" name="Orders" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis dataKey="spend" name="Spend" stroke="var(--muted-foreground)" fontSize={12} />
              <ZAxis range={[70, 70]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter data={CUSTOMER_SCATTER} fill="oklch(0.62 0.2 258)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="glass mt-5 rounded-2xl p-5">
        <h2 className="font-display text-base font-semibold">Customer activity heatmap</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Recommendation requests by day of week and two-hour window
        </p>
        <div className="mt-5 space-y-1.5 overflow-x-auto">
          {ACTIVITY_HEATMAP.map((row) => (
            <div key={row.day} className="flex items-center gap-2">
              <span className="w-10 shrink-0 text-xs text-muted-foreground">{row.day}</span>
              <div className="flex gap-1.5">
                {row.hours.map((cell) => (
                  <div
                    key={cell.hour}
                    title={`${row.day} ${cell.hour} · ${cell.value}`}
                    className="size-7 shrink-0 rounded-md"
                    style={{
                      background: `color-mix(in oklab, oklch(0.58 0.24 292) ${Math.max(8, cell.value)}%, transparent)`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <span className="w-10 shrink-0" />
            <div className="flex gap-1.5">
              {ACTIVITY_HEATMAP[0]!.hours.map((cell) => (
                <span key={cell.hour} className="w-7 shrink-0 text-center text-[9px] text-muted-foreground">
                  {cell.hour.slice(0, 2)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
