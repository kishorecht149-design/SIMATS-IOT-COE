import React from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CircuitBackground } from "@/components/ui/CircuitBackground";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] relative flex items-center justify-center p-4 bg-background">
      <CircuitBackground />
      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-12 w-12 rounded bg-primary/10 border border-primary/30 items-center justify-center text-primary shadow-sm">
          <Cpu className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <Badge variant="tech" size="sm">
            [ERROR 404: NODE_NOT_FOUND]
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Page Not Located
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            The requested institutional route or document does not exist on this server.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button size="sm" className="gap-2 font-mono text-xs">
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/expothon">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Expothon Guidelines
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
