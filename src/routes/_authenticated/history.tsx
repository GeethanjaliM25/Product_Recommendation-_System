import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Search, ShoppingBag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, StatCard } from "@/components/page-shell";
import { CUSTOMERS } from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Customer History | AI Product Recommendation System" },
      {
        name: "description",
        content: "Search customers and review their full invoice and purchase history timeline.",
      },
      { property: "og:title", content: "Customer History" },
      { property: "og:description", content: "Invoices, baskets and buying frequency per customer." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0]!.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CUSTOMERS;
    return CUSTOMERS.filter(
      (c) => c.id.includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0]!;

  return (
    <div>
      <PageHeader
        title="Customer History"
        description="Search a customer and inspect every invoice the model learned from."
      />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="glass rounded-2xl p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, name or country"
              maxLength={60}
              className="pl-9"
            />
          </div>
          <ul className="mt-4 max-h-[520px] space-y-1.5 overflow-y-auto pr-1">
            {filtered.map((customer) => (
              <li key={customer.id}>
                <button
                  onClick={() => setSelectedId(customer.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                    customer.id === selected.id ? "bg-accent" : "hover:bg-accent/60"
                  }`}
                >
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.id} · {customer.country}
                  </p>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No customers match that search.
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <StatCard icon={ShoppingBag} label="Total orders" value={String(selected.totalOrders)} />
            <StatCard
              icon={CalendarDays}
              label="Customer since"
              value={selected.firstPurchase}
              hint={`Last order ${selected.lastPurchase}`}
              delay={0.05}
            />
            <StatCard
              icon={ShoppingBag}
              label="Lifetime value"
              value={`₹${selected.totalSpend.toLocaleString()}`}
              hint={`Segment: ${selected.segment}`}
              delay={0.1}
            />
          </div>

          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-5">
              <div>
                <h2 className="font-display text-base font-semibold">Purchase timeline</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selected.purchases.length} line items across {selected.totalOrders} invoices
                </p>
              </div>
              <Badge variant="secondary">{selected.segment}</Badge>
            </div>
            <div className="max-h-[420px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.purchases.map((purchase) => (
                    <TableRow key={`${purchase.invoice}-${purchase.productCode}`}>
                      <TableCell className="font-mono text-xs">{purchase.invoice}</TableCell>
                      <TableCell className="text-xs">{purchase.date}</TableCell>
                      <TableCell className="max-w-[260px] truncate text-sm">
                        {purchase.productName}
                      </TableCell>
                      <TableCell className="text-right text-sm">{purchase.quantity}</TableCell>
                      <TableCell className="text-right text-sm">
                        ₹{purchase.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
