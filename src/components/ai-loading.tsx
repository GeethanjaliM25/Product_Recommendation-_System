import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

const STAGES = [
  "Loading customer profile...",
  "Analyzing purchase history...",
  "Running deep learning model...",
  "Finding similar products...",
  "Generating recommendations...",
];

export function AiLoading({ label = "Generating recommendations" }: { label?: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass flex flex-col items-center gap-6 rounded-3xl px-8 py-14 text-center">
      <div className="relative">
        <motion.span
          className="gradient-brand absolute inset-0 rounded-2xl blur-xl"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="gradient-brand relative flex size-16 items-center justify-center rounded-2xl text-primary-foreground"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="size-8" />
        </motion.span>
      </div>

      <div className="space-y-2">
        <p className="font-display text-lg font-semibold">{label}</p>
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
        >
          {STAGES[stage]}
        </motion.p>
      </div>

      <div className="w-full max-w-xs">
        <Progress value={((stage + 1) / STAGES.length) * 100} className="h-1.5" />
      </div>

      <div className="flex gap-1.5">
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`size-1.5 rounded-full transition-colors ${
              i <= stage ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
