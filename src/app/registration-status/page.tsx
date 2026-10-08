"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface StatusData {
  registrationId: string;
  teamName: string;
  collegeName: string;
  projectTitle: string;
  trackId: string;
  projectStage: string;
  status: "Submitted" | "Under Review" | "Shortlisted" | "Confirmed" | "Waitlisted" | "Rejected";
  adminRemarks: string;
  submittedAt: string;
  memberCount: number;
  checkedIn?: boolean;
}

function StatusContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const initialEmail = searchParams.get("email") || "";

  const [registrationId, setRegistrationId] = useState(initialId);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialId && initialEmail) {
      lookupStatus(initialId, initialEmail);
    }
  }, [initialId, initialEmail]);

  const lookupStatus = async (idToSearch: string, emailToSearch: string) => {
    if (!idToSearch || !emailToSearch) {
      setErrorMessage("Please provide both Registration ID and Team Lead Email.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const res = await fetch("/api/registration/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: idToSearch, email: emailToSearch }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "No matching registration record found.");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupStatus(registrationId, email);
  };

  return (
    <div className="space-y-8">
      {/* Search Card */}
      <div className="p-6 sm:p-8 rounded-lg border border-border bg-card shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-mono text-muted-foreground">
              REGISTRATION ID
            </label>
            <input
              type="text"
              required
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value.toUpperCase())}
              placeholder="e.g. EXP-2026-4819"
              className="w-full h-10 px-3 rounded border border-border bg-background text-foreground text-sm font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-mono text-muted-foreground">
              TEAM LEAD EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="lead@college.edu"
              className="w-full h-10 px-3 rounded border border-border bg-background text-foreground text-sm font-mono"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <Button
              type="submit"
              isLoading={loading}
              className="w-full h-10 font-semibold font-mono text-xs gap-1.5"
            >
              <Search className="h-4 w-4" />
              <span>Verify</span>
            </Button>
          </div>
        </form>

        {errorMessage && (
          <div className="p-3.5 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="p-6 sm:p-8 rounded-lg border border-border bg-card shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Verified Registration Record
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-primary">
                {result.registrationId}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  result.status === "Confirmed"
                    ? "success"
                    : result.status === "Shortlisted"
                    ? "default"
                    : result.status === "Rejected"
                    ? "destructive"
                    : "warning"
                }
                size="md"
                className="font-bold text-xs"
              >
                ● {result.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Official Remarks */}
          <div className="p-4 rounded border border-border/80 bg-muted/20 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Official Jury & Committee Message
            </span>
            <p className="text-xs sm:text-sm text-foreground font-mono leading-relaxed">
              {result.adminRemarks}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase">Team Name</span>
              <p className="font-bold text-foreground text-sm">{result.teamName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase">Institution</span>
              <p className="font-semibold text-foreground">{result.collegeName}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-muted-foreground text-[10px] uppercase">Project Title</span>
              <p className="font-bold text-foreground text-sm">{result.projectTitle}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase">Thematic Track</span>
              <p className="text-primary font-semibold">{result.trackId}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase">Submission Date</span>
              <p className="text-foreground">{formatDate(result.submittedAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegistrationStatusPage() {
  return (
    <div className="py-16 md:py-24 border-b border-border bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <Badge variant="tech" size="sm">
              [STATUS VERIFICATION]
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Check Registration Status
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            Track reviewer assessment, shortlisting status, and bench allocations.
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center font-mono text-xs">Loading status portal...</div>}>
          <StatusContent />
        </Suspense>
      </div>
    </div>
  );
}
