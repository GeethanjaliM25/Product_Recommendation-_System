import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="font-display font-semibold">AI Product Recommendation System</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Neural collaborative filtering that turns purchase history into personalised product
            recommendations.
          </p>
        </div>

        <div className="md:text-center">
          <p className="font-display text-sm font-semibold">Developed by Geethanjali</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Artificial Intelligence &amp; Machine Learning
          </p>
        </div>

        <div className="md:text-right">
          <p className="font-display text-sm font-semibold">Connect</p>
          <div className="mt-3 flex gap-2 md:justify-end">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="glass glass-hover flex size-10 items-center justify-center rounded-xl"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="glass glass-hover flex size-10 items-center justify-center rounded-xl"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="mailto:hello@example.com"
              aria-label="Contact"
              className="glass glass-hover flex size-10 items-center justify-center rounded-xl"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 px-6 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Product Recommendation System. All rights reserved.
      </div>
    </footer>
  );
}
