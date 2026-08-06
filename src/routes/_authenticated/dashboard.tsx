import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Sparkles, Users, Package, Percent, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartCard, PageHeader, StatCard } from "@/components/page-shell";
import {
  CUSTOMERS,
  CUSTOMER_SEGMENTS,
  MONTHLY_RECOMMENDATIONS,
  PRODUCTS,
  PURCHASE_FREQUENCY,
  RECENT_ACTIVITY,
} from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Product Recommendation System" },
      {
        name: "description",
        content: "Overview of recommendation volume, customer segments and model activity.",
      },
      { property: "og:title", content: "Dashboard | AI Product Recommendation System" },
      { property: "og:description", content: "Live recommendation metrics and model activity." },
    ],
  }),
  component: DashboardPage,
});

const PIE_COLORS = [
  "oklch(0.58 0.24 292)",
  "oklch(0.62 0.2 258)",
  "oklch(0.7 0.16 200)",
  "oklch(0.78 0.16 80)",
  "oklch(0.68 0.2 20)",
];

function DashboardPage() {
  const totalRecommendations = MONTHLY_RECOMMENDATIONS.reduce((a, m) => a + m.recommendations, 0);
  const accepted = MONTHLY_RECOMMENDATIONS.reduce((a, m) => a + m.accepted, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live view of how the neural recommender is performing across your customer base."
        actions={
          <Button asChild className="gradient-brand border-0 text-primary-foreground">
            <Link to="/recommend">
              New recommendation <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total customers" value={String(CUSTOMERS.length * 92)} hint="Encoded in customer_encoder.pkl" />
        <StatCard icon={Package} label="Total products" value={String(PRODUCTS.length * 71)} hint="Encoded in product_encoder.pkl" delay={0.05} />
        <StatCard
          icon={Sparkles}
          label="Recommendations"
          value={totalRecommendations.toLocaleString()}
          hint="Generated in the last 12 months"
          delay={0.1}
        />
        <StatCard
          icon={Percent}
          label="Acceptance rate"
          value={`${((accepted / totalRecommendations) * 100).toFixed(1)}%`}
          hint="Suggested products added to basket"
          delay={0.15}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Recommendations over time" subtitle="Monthly volume vs accepted suggestions">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_RECOMMENDATIONS}>
              <defs>
                <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.58 0.24 292)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="oklch(0.58 0.24 292)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.2 258)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="oklch(0.62 0.2 258)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="recommendations"
                stroke="oklch(0.58 0.24 292)"
                fill="url(#gradRec)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="accepted"
                stroke="oklch(0.62 0.2 258)"
                fill="url(#gradAcc)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer segments" subtitle="RFM-style distribution of the customer base">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CUSTOMER_SEGMENTS}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={100}
                paddingAngle={3}
              >
                {CUSTOMER_SEGMENTS.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Purchase frequency" subtitle="Customers grouped by number of orders">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PURCHASE_FREQUENCY}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="bucket" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Bar dataKey="customers" radius={[8, 8, 0, 0]} fill="oklch(0.58 0.24 292)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Recent activity</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest recommendation events</p>
          <ul className="mt-5 space-y-3">
            {RECENT_ACTIVITY.map((item) => (
              <li
                key={`${item.customer}-${item.time}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">Customer {item.customer}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {item.time}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
