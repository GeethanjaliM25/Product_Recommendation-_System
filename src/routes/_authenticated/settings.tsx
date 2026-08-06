import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Server, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-shell";
import { useTheme } from "@/components/theme-provider";
import { DEFAULT_API_URL, checkModelService, getApiUrl, setApiUrl } from "@/lib/recommend-api";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Product Recommendation System" },
      {
        name: "description",
        content: "Connect your local model service, switch theme and tune recommendation defaults.",
      },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Configure the model endpoint and appearance." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [url, setUrl] = useState(DEFAULT_API_URL);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"unknown" | "online" | "offline">("unknown");

  useEffect(() => {
    setUrl(getApiUrl());
  }, []);

  async function testConnection() {
    setChecking(true);
    setApiUrl(url.trim());
    const result = await checkModelService();
    setChecking(false);
    setStatus(result.online ? "online" : "offline");
    if (result.online) toast.success("Model service reachable.");
    else toast.info("Model service offline — the built-in engine will be used.");
  }

  return (
    <div>
      <PageHeader title="Settings" description="Model endpoint, appearance and workspace defaults." />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Server className="size-4" /> Local model service
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Run the Flask service in <code>backend/</code> to score with your real{" "}
            <code>recommendation_ann.keras</code> model. When it is offline the app falls back to the
            built-in scoring engine so nothing breaks.
          </p>

          <div className="mt-5 space-y-2">
            <Label htmlFor="apiUrl">Service URL</Label>
            <Input
              id="apiUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={DEFAULT_API_URL}
              maxLength={200}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button onClick={testConnection} disabled={checking} variant="outline">
              {checking && <Loader2 className="mr-2 size-4 animate-spin" />}
              Test connection
            </Button>
            {status === "online" && (
              <Badge className="bg-success text-primary-foreground">
                <CheckCircle2 className="mr-1 size-3" /> Online
              </Badge>
            )}
            {status === "offline" && (
              <Badge variant="secondary">
                <XCircle className="mr-1 size-3" /> Offline
              </Badge>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-base font-semibold">Appearance</h2>
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Currently using the {theme} theme.
              </p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
        </div>
      </div>
    </div>
  );
}
