import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Flame, Search, Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-shell";
import { PRODUCTS } from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/popular-products")({
  head: () => ({
    meta: [
      { title: "Popular Products | AI Product Recommendation System" },
      {
        name: "description",
        content: "The most recommended and highest performing products across the catalogue.",
      },
      { property: "og:title", content: "Popular Products" },
      { property: "og:description", content: "Trending products ranked by recommendation volume." },
    ],
  }),
  component: PopularProductsPage,
});

const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

function PopularProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)),
    ).sort((a, b) => b.recommendationCount - a.recommendationCount);
  }, [query, category]);

  return (
    <div>
      <PageHeader
        title="Popular Products"
        description="Trending items ranked by how often the model recommends them."
      />

      <div className="glass flex flex-wrap items-end gap-4 rounded-2xl p-5">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            maxLength={80}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <motion.article
            key={product.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
            className="glass glass-hover rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.isNew ? (
                <Badge className="gradient-brand border-0 text-xs text-primary-foreground">New</Badge>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-current text-warning" /> {product.rating.toFixed(1)}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-base leading-snug font-semibold">{product.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Code {product.code} · ₹{product.unitPrice.toFixed(2)}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="size-3.5" /> Popularity
                </span>
                <span>{product.popularity}%</span>
              </div>
              <Progress value={product.popularity} className="mt-2 h-1.5" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Recommended {product.recommendationCount.toLocaleString()} times
            </p>
          </motion.article>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground">No products match those filters.</p>
        )}
      </div>
    </div>
  );
}
