import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Layers, Gauge, Settings2 } from "lucide-react";

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
import { MODEL_INFO } from "@/lib/sample-data";

export const Route = createFileRoute("/_authenticated/model")({
  head: () => ({
    meta: [
      { title: "Model Information | AI Product Recommendation System" },
      {
        name: "description",
        content:
          "Architecture, hyperparameters and layer breakdown of the trained recommendation ANN.",
      },
      { property: "og:title", content: "Model Information" },
      { property: "og:description", content: "Inside the neural collaborative filtering model." },
    ],
  }),
  component: ModelPage,
});

function ModelPage() {
  const details: Array<[string, string]> = [
    ["Model file", MODEL_INFO.name],
    ["Model type", MODEL_INFO.type],
    ["Problem type", MODEL_INFO.problem],
    ["Architecture", MODEL_INFO.architecture],
    ["Optimizer", MODEL_INFO.optimizer],
    ["Loss function", MODEL_INFO.loss],
    ["Hidden activation", MODEL_INFO.activation],
    ["Output activation", MODEL_INFO.outputActivation],
    ["Tuning strategy", MODEL_INFO.tuning],
    ["Epochs", String(MODEL_INFO.epochs)],
    ["Batch size", String(MODEL_INFO.batchSize)],
    ["Trainable parameters", MODEL_INFO.parameters],
  ];

  return (
    <div>
      <PageHeader
        title="Model Information"
        description="Everything about the trained network powering the recommendations."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Gauge}
          label="Training accuracy"
          value={`${(MODEL_INFO.trainingAccuracy * 100).toFixed(2)}%`}
        />
        <StatCard
          icon={Gauge}
          label="Validation accuracy"
          value={`${(MODEL_INFO.validationAccuracy * 100).toFixed(2)}%`}
          delay={0.05}
        />
        <StatCard icon={Cpu} label="ROC AUC" value={MODEL_INFO.auc.toFixed(3)} delay={0.1} />
        <StatCard icon={Layers} label="Layers" value={String(MODEL_INFO.layers.length)} delay={0.15} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Settings2 className="size-4" /> Configuration
          </h2>
          <dl className="mt-5 divide-y divide-border/60">
            {details.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 py-2.5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="max-w-[60%] text-right text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-border/60 p-5">
            <h2 className="font-display text-base font-semibold">Layer summary</h2>
            <Badge variant="secondary">{MODEL_INFO.parameters} params</Badge>
          </div>
          <div className="max-h-[430px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Layer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Output shape</TableHead>
                  <TableHead className="text-right">Params</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODEL_INFO.layers.map((layer) => (
                  <TableRow key={layer.name}>
                    <TableCell className="font-mono text-xs">{layer.name}</TableCell>
                    <TableCell className="text-xs">{layer.type}</TableCell>
                    <TableCell className="font-mono text-xs">{layer.shape}</TableCell>
                    <TableCell className="text-right text-xs">
                      {layer.params.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
