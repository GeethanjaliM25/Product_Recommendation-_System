import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports | AI Product Recommendation System" },
      {
        name: "description",
        content: "Saved recommendations with CSV and PDF export for sharing with your team.",
      },
      { property: "og:title", content: "Reports" },
      { property: "og:description", content: "Export saved neural recommendations as PDF or CSV." },
    ],
  }),
  component: ReportsPage,
});

type SavedRow = {
  id: string;
  customer_id: string;
  product_code: string;
  product_name: string;
  score: number;
  confidence: number;
  reason: string | null;
  created_at: string;
};

function ReportsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["saved-recommendations"],
    queryFn: async (): Promise<SavedRow[]> => {
      const { data: rows, error } = await supabase
        .from("saved_recommendations")
        .select("id, customer_id, product_code, product_name, score, confidence, reason, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return rows ?? [];
    },
  });

  const rows = data ?? [];

  async function remove(id: string) {
    const { error } = await supabase.from("saved_recommendations").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete that row.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["saved-recommendations"] });
    toast.success("Removed from reports");
  }

  function exportCsv() {
    if (rows.length === 0) {
      toast.error("Nothing to export yet.");
      return;
    }
    const header = ["Customer", "Product code", "Product", "Score", "Confidence", "Saved at"];
    const body = rows.map((r) => [
      r.customer_id,
      r.product_code,
      `"${r.product_name.replace(/"/g, '""')}"`,
      r.score,
      r.confidence,
      new Date(r.created_at).toISOString(),
    ]);
    const csv = [header.join(","), ...body.map((line) => line.join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "recommendation-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    if (rows.length === 0) {
      toast.error("Nothing to export yet.");
      return;
    }
    const { default: JsPDF } = await import("jspdf");
    const doc = new JsPDF();
    doc.setFontSize(16);
    doc.text("AI Product Recommendation Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 25);
    let y = 36;
    rows.slice(0, 32).forEach((row, i) => {
      doc.text(
        `${i + 1}. Customer ${row.customer_id} — ${row.product_name} (${row.confidence.toFixed(1)}%)`,
        14,
        y,
      );
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("recommendation-report.pdf");
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Every recommendation you saved, ready to export and share."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download className="mr-1.5 size-4" /> CSV
            </Button>
            <Button onClick={exportPdf} className="gradient-brand border-0 text-primary-foreground">
              <FileText className="mr-1.5 size-4" /> PDF
            </Button>
          </div>
        }
      />

      <div className="glass overflow-hidden rounded-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading saved recommendations…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-base font-semibold">No saved recommendations yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate recommendations and choose “Save all” to build a report.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead>Saved</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.customer_id}</TableCell>
                  <TableCell className="max-w-[280px]">
                    <p className="truncate text-sm">{row.product_name}</p>
                    <p className="text-xs text-muted-foreground">{row.product_code}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{row.confidence.toFixed(1)}%</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => remove(row.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
