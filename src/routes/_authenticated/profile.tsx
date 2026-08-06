import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile | AI Product Recommendation System" },
      { name: "description", content: "Manage your account name, phone number and email." },
      { property: "og:title", content: "Profile" },
      { property: "og:description", content: "Manage your recommendation workspace account." },
    ],
  }),
  component: ProfilePage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, { message: "Enter your full name" }).max(80),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^$|^[0-9+\-() ]{7,20}$/, { message: "Enter a valid phone number" }),
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      return {
        email: user.email ?? "",
        id: user.id,
        full_name: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
      };
    },
  });

  useEffect(() => {
    if (!data) return;
    setFullName(data.full_name ?? "");
    setPhone(data.phone ?? "");
  }, [data]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!data) return;
    const parsed = schema.safeParse({ full_name: fullName, phone });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: parsed.data.full_name, phone: parsed.data.phone })
      .eq("id", data.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save your profile.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile updated");
  }

  const initials = (fullName || data?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div>
      <PageHeader title="Profile" description="Your account details for this workspace." />

      <div className="glass max-w-xl rounded-2xl p-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading profile…
          </div>
        ) : (
          <form onSubmit={save} className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="gradient-brand font-display text-lg text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-display text-base font-semibold">{fullName || "Your account"}</p>
                <p className="truncate text-sm text-muted-foreground">{data?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={80}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={data?.email ?? ""} readOnly disabled />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="gradient-brand border-0 text-primary-foreground"
            >
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
              Save changes
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
