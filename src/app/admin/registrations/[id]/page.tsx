"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Users,
  Building,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Submitted");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  const fetchRegistration = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/registrations/${id}`);
      const data = await res.json();
      if (data.registration) {
        setRegistration(data.registration);
        setStatus(data.registration.status);
        setAdminRemarks(data.registration.adminRemarks || "");
        setCheckedIn(data.registration.checkedIn || false);
      }
    } catch (err) {
      console.error("Failed to load registration details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminRemarks,
          checkedIn,
          newInternalNote: newNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update registration");
      } else {
        setSuccessMessage("Registration updated and jury status remarks logged.");
        setNewNote("");
        fetchRegistration();
      }
    } catch (err) {
      setErrorMessage("Network error occurred during update.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this registration record?")) return;

    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/registrations");
      } else {
        alert("Failed to delete registration. Super Admin permission required.");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-muted-foreground">
        Loading applicant portfolio...
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="p-12 text-center text-xs font-mono text-muted-foreground">
        Registration record not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/registrations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="tech" size="sm">
                REG ID: {registration.registrationId}
              </Badge>
              <Badge
                variant={
                  status === "Confirmed"
                    ? "success"
                    : status === "Shortlisted"
                    ? "default"
                    : status === "Rejected"
                    ? "destructive"
                    : "warning"
                }
                size="sm"
              >
                {status}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {registration.teamName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="text-red-500 hover:bg-red-500/10 font-mono text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>

          <Button
            onClick={handleUpdate}
            isLoading={saving}
            size="sm"
            className="gap-1.5 font-semibold font-mono text-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Evaluation</span>
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Details + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project & Applicant Dossier (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Project Abstract Card */}
          <div className="p-6 rounded border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Project Abstract & Technical Specifications
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-muted-foreground text-[10px] uppercase block">
                  Project Title
                </span>
                <h3 className="text-base font-bold text-foreground mt-0.5">
                  {registration.projectTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded bg-muted/30 border border-border">
                  <span className="text-muted-foreground text-[10px] uppercase block">Track</span>
                  <span className="font-semibold text-primary">{registration.trackId}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/30 border border-border">
                  <span className="text-muted-foreground text-[10px] uppercase">Stage</span>
                  <span className="font-semibold text-foreground">{registration.projectStage}</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-muted-foreground text-[10px] uppercase block mb-1">
                  Abstract Content
                </span>
                <div className="p-4 rounded border border-border/80 bg-background/50 text-foreground leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {registration.abstractText}
                </div>
              </div>

              <div>
                <span className="font-mono text-muted-foreground text-[10px] uppercase block mb-1.5">
                  Hardware Components / Sensors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(registration.hardwareComponents || []).map((comp: string) => (
                    <Badge key={comp} variant="tech" size="sm">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>

              {registration.abstractFileUrl && (
                <div className="pt-2">
                  <span className="font-mono text-muted-foreground text-[10px] uppercase block mb-1">
                    Uploaded Project Abstract PDF
                  </span>
                  <a
                    href={registration.abstractFileUrl}
                    download={`${registration.registrationId}_abstract.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-mono transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Download / View Abstract PDF</span>
                    <Download className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Team Members Roster */}
          <div className="p-6 rounded border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Team Roster ({1 + (registration.teamMembers?.length || 0)} Total Members)
            </h2>

            <div className="space-y-3 text-xs">
              {/* Lead Member */}
              <div className="p-4 rounded border border-primary/30 bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary font-mono flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>TEAM LEAD</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Roll: {registration.leadMember?.rollNo || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Name</span>
                    <span className="font-bold text-foreground">{registration.leadMember?.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Email</span>
                    <a href={`mailto:${registration.leadMember?.email}`} className="text-primary hover:underline">
                      {registration.leadMember?.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Phone</span>
                    <a href={`tel:${registration.leadMember?.phone}`} className="text-foreground">
                      {registration.leadMember?.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Other Members */}
              {(registration.teamMembers || []).map((m: any, idx: number) => (
                <div key={idx} className="p-3 rounded border border-border bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-muted-foreground text-[11px]">
                    <span>MEMBER #{idx + 2}</span>
                    <span>Roll: {m.rollNo || "—"}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                    <div>
                      <span className="font-semibold text-foreground">{m.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{m.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{m.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Controls & Internal Notes (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Review Controls */}
          <div className="p-6 rounded border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Evaluation & Status Workflow
            </h2>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">APPLICATION STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono font-bold"
                >
                  <option value="Submitted">Submitted (Queued)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted (Demo Approved)</option>
                  <option value="Confirmed">Confirmed (Bench Allocated)</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">
                  PUBLIC JURY REMARKS TO TEAM
                </label>
                <textarea
                  rows={4}
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="Official status message visible to the student team in their status lookup portal..."
                  className="w-full p-3 rounded border border-border bg-background text-foreground font-mono text-xs"
                />
              </div>

              {/* Event Day Check-In Toggle */}
              <div className="p-3 rounded border border-border bg-muted/20 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedIn}
                    onChange={(e) => setCheckedIn(e.target.checked)}
                    className="h-4 w-4 rounded text-primary"
                  />
                  <div>
                    <span className="font-bold text-foreground block">
                      Event Day Physical Check-in
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {registration.checkedInAt
                        ? `Checked in at ${formatDateTime(registration.checkedInAt)}`
                        : "Team has not checked in at the registration desk."}
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleUpdate}
                  isLoading={saving}
                  className="w-full h-9 font-mono text-xs"
                >
                  Save Evaluation Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="p-6 rounded border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Internal Jury / Staff Notes
            </h2>

            <div className="space-y-3 text-xs">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(registration.internalNotes || []).length === 0 ? (
                  <p className="text-[11px] font-mono text-muted-foreground">
                    No internal reviewer notes added yet.
                  </p>
                ) : (
                  (registration.internalNotes || []).map((n: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-muted/30 border border-border text-[11px] font-mono space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                        <span>{n.addedBy}</span>
                        <span>{formatDateTime(n.addedAt)}</span>
                      </div>
                      <p className="text-foreground">{n.note}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add private evaluation note..."
                  className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUpdate}
                  disabled={!newNote.trim()}
                  className="w-full h-7 text-[11px] font-mono"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
