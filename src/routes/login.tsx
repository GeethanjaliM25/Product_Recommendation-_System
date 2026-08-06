import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | AI Product Recommendation System" },
      {
        name: "description",
        content: "Sign in to generate neural product recommendations from customer purchase history.",
      },
      { property: "og:title", content: "Login | AI Product Recommendation System" },
      { property: "og:description", content: "Sign in to your AI recommendation workspace." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setGoogleLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  async function handleForgotPassword() {
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Enter your email address first, then click Forgot password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset link sent. Check your inbox.");
  }

  return (
    <div className="aurora relative flex min-h-screen items-center justify-center px-4 py-14">
      <div className="grid-lines absolute inset-0 -z-10 opacity-50" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md rounded-3xl p-8"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-sm font-semibold">AI Product Recommender</span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to run recommendations and view analytics.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={remember}
                onCheckedChange={(value) => setRemember(Boolean(value))}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="gradient-brand w-full border-0 text-primary-foreground"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Login
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 size-4" />
          )}
          Continue with Google
        </Button>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.6-.2-2.3H12v4.5h6.5c-.1 1-.8 2.6-2.3 3.6l3.5 2.7c2.1-1.9 3.3-4.8 3.3-8.5z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.5-2.7c-1 .7-2.3 1.1-4.1 1.1-3.1 0-5.8-2.1-6.7-5L1.7 17.3C3.6 21.2 7.5 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.3 14.6c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2L1.7 7.5A11.9 11.9 0 0 0 .4 12.4c0 1.9.5 3.7 1.3 5.2l3.6-3z" />
      <path
        fill="#EA4335"
        d="M12 4.7c2.2 0 3.7.9 4.5 1.7l3.1-3C17.7 1.6 15.1.4 12 .4 7.5.4 3.6 3.2 1.7 7.1l3.6 2.8c.9-2.9 3.6-5.2 6.7-5.2z"
      />
    </svg>
  );
}
