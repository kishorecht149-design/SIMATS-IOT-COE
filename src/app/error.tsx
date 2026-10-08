"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border border-border bg-card shadow-sm">
        <div className="h-12 w-12 rounded-full bg-red-950/30 border border-red-800/50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <Badge variant="destructive" size="sm">
            [SYSTEM FAULT: 500]
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Execution Interrupted
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            An unexpected error occurred during page rendering.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()} size="sm" className="gap-2 font-mono text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Operation</span>
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
              <Home className="h-3.5 w-3.5" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
