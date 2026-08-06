import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  Users,
  BrainCircuit,
  Activity,
  LayoutDashboard,
  Wand2,
  ArrowRight,
  Database,
  Cpu,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Product Recommendation System | Neural Recommendations" },
      {
        name: "description",
        content:
          "Recommend products intelligently using customer purchase history and Artificial Neural Networks. Real-time analytics, deep learning predictions and an interactive dashboard.",
      },
      { property: "og:title", content: "AI Product Recommendation System" },
      {
        property: "og:description",
        content:
          "Neural collaborative filtering that turns customer purchase history into personalised product recommendations.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Sparkles,
    title: "AI Product Recommendation",
    body: "Rank the next-best products for any customer with a trained neural collaborative filtering model.",
  },
  {
    icon: Users,
    title: "Customer Purchase Analysis",
    body: "Explore invoices, baskets and buying frequency for every customer in the catalogue.",
  },
  {
    icon: BrainCircuit,
    title: "Deep Learning Prediction",
    body: "Embeddings for customers and products feed a dense ReLU stack with a sigmoid affinity head.",
  },
  {
    icon: Activity,
    title: "Real-Time Analytics",
    body: "Live recommendation volume, acceptance rate and score distribution as predictions run.",
  },
  {
    icon: LayoutDashboard,
    title: "Interactive Dashboard",
    body: "Summary cards, timelines and six chart families built for fast decision making.",
  },
  {
    icon: Wand2,
    title: "Smart Recommendation Engine",
    body: "Confidence scoring plus human-readable reasons for every product suggested.",
  },
];

const workflow = [
  { icon: Database, title: "Ingest history", body: "Invoices, products and customers are encoded with the saved label encoders." },
  { icon: Cpu, title: "Predict affinity", body: "The ANN scores every unseen product for the encoded customer." },
  { icon: BarChart3, title: "Rank & explain", body: "Top-K products are decoded, scored and paired with a reason." },
  { icon: ShieldCheck, title: "Save & report", body: "Recommendations are stored per account and exported as PDF or CSV." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="font-display text-sm font-semibold sm:text-base">
              AI Product <span className="gradient-text">Recommender</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="gradient-brand border-0 text-primary-foreground">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-success" />
              Neural Collaborative Filtering · Keras ANN
            </span>
            <h1 className="mt-7 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              AI Product <span className="gradient-text">Recommendation System</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Recommend products intelligently using customer purchase history and Artificial Neural
              Networks.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gradient-brand border-0 text-primary-foreground">
                <Link to="/register">
                  Get Started <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass mx-auto mt-16 grid max-w-3xl gap-6 rounded-3xl px-8 py-8 sm:grid-cols-3"
          >
            {[
              { label: "Model accuracy", value: "94.1%" },
              { label: "Products ranked", value: "1,915" },
              { label: "Avg. prediction time", value: "38 ms" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="gradient-text font-display text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold">Everything the model needs, in one place</h2>
          <p className="mt-3 text-muted-foreground">
            A production-ready workspace around your trained ANN — from encoded inputs to explainable
            product cards.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="glass glass-hover rounded-2xl p-6"
            >
              <span className="gradient-brand flex size-11 items-center justify-center rounded-xl text-primary-foreground">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-bold">About the project</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            The system learns latent representations of customers and products from historical
            transactions. Each customer ID is encoded with <code>customer_encoder.pkl</code>, paired
            against every candidate product encoded with <code>product_encoder.pkl</code>, and scored
            by <code>recommendation_ann.keras</code>. The sigmoid output becomes an affinity score,
            the top-K products are decoded back to readable names, and the frontend renders them with
            confidence percentages and reasons.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, i) => (
              <div key={step.title} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <step.icon className="size-4" />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
