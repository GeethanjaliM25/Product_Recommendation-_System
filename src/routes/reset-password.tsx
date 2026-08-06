import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password | AI Product Recommendation System" },
      {
        name: "description",
        content: "Choose a new password for your AI Product Recommendation System account.",
      },
      { property: "og:title", content: "Reset password" },
      { property: "og:description", content: "Set a new password for your recommendation workspace." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="aurora relative flex min-h-screen items-center justify-center px-4 py-14">
      <div className="grid-lines absolute inset-0 -z-10 opacity-50" />
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-sm font-semibold">AI Product Recommender</span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold">Set a new password</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter a new password for your account below.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                maxLength={128}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-9"
                maxLength={128}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="gradient-brand w-full border-0 text-primary-foreground"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
