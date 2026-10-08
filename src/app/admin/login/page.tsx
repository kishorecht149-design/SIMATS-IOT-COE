"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CircuitBackground } from "@/components/ui/CircuitBackground";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (urlError) {
      setErrorMessage(urlError);
    }
  }, [urlError]);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, honeypot }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Login failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded border border-border bg-card shadow-sm space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google One-Click Authentication Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-11 px-4 rounded border border-border hover:border-foreground/30 bg-background hover:bg-muted/40 text-foreground text-xs font-semibold font-mono flex items-center justify-center gap-3 transition-colors shadow-sm disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Connecting to Google...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2.5">
              <GoogleIcon className="h-4 w-4" />
              <span>Sign in with Google</span>
            </span>
          )}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-muted-foreground uppercase">
            Or sign in with email
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_hp">Leave blank</label>
          <input
            id="website_hp"
            type="text"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-foreground flex items-center justify-between">
            <span>ADMIN EMAIL</span>
            <span className="text-[10px] text-muted-foreground">Institutional</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saveetha.simats.edu"
              className="w-full h-10 pl-9 pr-3 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-medium text-foreground flex items-center justify-between">
            <span>PASSWORD</span>
            <span className="text-[10px] text-muted-foreground">Encrypted</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-10 pl-9 pr-3 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isGoogleLoading}
            className="w-full h-10 font-semibold gap-2 font-mono text-xs"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-border/80 text-[11px] text-muted-foreground font-mono space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
          <span>Institutional SSO & Role-Based Access</span>
        </div>
        <p className="text-[10px] leading-tight text-muted-foreground/70">
          Super Admin Credentials:<br />
          <code>admin@saveetha.simats.edu</code> / <code>SaveethaIoTCoE2026!</code>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-background">
      <CircuitBackground />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="relative h-16 w-16 mx-auto rounded-xl bg-white/95 dark:bg-card p-1.5 border border-border/80 flex items-center justify-center shadow-md overflow-hidden">
            <Image
              src="/logo.png"
              alt="SIMATS IoT"
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge variant="tech" size="sm">
              SYSTEM AUTH
            </Badge>
            <Badge variant="outline" size="sm">
              SIMATS ECE COE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Administrative Access
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            IoT Lab Centre of Excellence & Expothon Portal
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center font-mono text-xs">Loading login module...</div>}>
          <AdminLoginForm />
        </Suspense>

        <div className="text-center">
          <a
            href="/"
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            ← Back to Public Portal
          </a>
        </div>
      </div>
    </div>
  );
}
