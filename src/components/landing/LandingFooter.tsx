// components/landing/LandingFooter.tsx
import { Shield } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display text-foreground">
              Insure<span className="gradient-text">Buddy</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Making insurance accessible, understandable, and affordable for every Nigerian.
          </p>

          <p className="text-sm text-muted-foreground">
            Built for Nigerians 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}