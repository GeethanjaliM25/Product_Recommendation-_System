import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Loader2, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account | AI Product Recommendation System" },
      {
        name: "description",
        content:
          "Create your account to generate deep-learning product recommendations and export reports.",
      },
      { property: "og:title", content: "Create account | AI Product Recommendation System" },
      { property: "og:description", content: "Join the AI recommendation workspace in seconds." },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, { message: "Enter your full name" }).max(80),
    email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-() ]{7,20}$/, { message: "Enter a valid phone number" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function strengthOf(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const STRENGTH_LABEL = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const strength = useMemo(() => strengthOf(form.password), [form.password]);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setSent(true);
      toast.success("Account created. Check your email to confirm it.");
      return;
    }
    toast.success("Account created");
    navigate({ to: "/dashboard" });
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

        {sent ? (
          <div className="mt-10 text-center">
            <h1 className="font-display text-2xl font-bold">Confirm your email</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your
              account, then sign in.
            </p>
            <Button asChild className="gradient-brand mt-7 w-full border-0 text-primary-foreground">
              <Link to="/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="mt-8 font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start generating neural recommendations in minutes.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <Field
                id="fullName"
                label="Full name"
                icon={User}
                value={form.fullName}
                onChange={(v) => update("fullName", v)}
                placeholder="Geethanjali"
                maxLength={80}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                icon={Mail}
                value={form.email}
                onChange={(v) => update("email", v)}
                placeholder="you@company.com"
                maxLength={255}
              />
              <Field
                id="phone"
                label="Phone number"
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+91 98765 43210"
                maxLength={20}
              />
              <Field
                id="password"
                label="Password"
                type="password"
                icon={Lock}
                value={form.password}
                onChange={(v) => update("password", v)}
                placeholder="At least 8 characters"
                maxLength={128}
              />

              {form.password.length > 0 && (
                <div className="space-y-1.5">
                  <Progress value={(strength / 5) * 100} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Password strength: <strong>{STRENGTH_LABEL[strength]}</strong>
                  </p>
                </div>
              )}

              <Field
                id="confirm"
                label="Confirm password"
                type="password"
                icon={Lock}
                value={form.confirm}
                onChange={(v) => update("confirm", v)}
                placeholder="Repeat your password"
                maxLength={128}
              />

              <Button
                type="submit"
                disabled={loading}
                className="gradient-brand w-full border-0 text-primary-foreground"
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Register
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
          required
        />
      </div>
    </div>
  );
}
