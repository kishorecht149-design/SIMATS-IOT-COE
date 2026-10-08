"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  ArrowRight,
  Download,
  FileSpreadsheet,
  Search,
  Sliders,
  Bell,
  Cpu,
  Zap,
  Globe,
  Shield,
  Layers,
  MapPin,
  ExternalLink,
  Check,
  Power,
  Wifi,
  Sparkles,
  Database,
  Mail,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { GlobalSettingsType } from "@/lib/default-settings";

interface DashboardClientProps {
  settings: GlobalSettingsType;
  totalRegistrations: number;
  statusCounts: Record<string, number>;
  trackCounts: Record<string, number>;
  stateCounts: Record<string, number>;
  recentRegistrations: any[];
  recentAudits: any[];
  hardwareStats: {
    powerNeeded: number;
    wifiNeeded: number;
    pcbCount: number;
    breadboardCount: number;
    prototypeCount: number;
  };
  institutionStats: {
    internalCount: number;
    externalCount: number;
  };
}

export function DashboardClient({
  settings,
  totalRegistrations,
  statusCounts,
  trackCounts,
  stateCounts,
  recentRegistrations,
  recentAudits,
  hardwareStats,
  institutionStats,
}: DashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRegOpen, setIsRegOpen] = useState(settings.registrationOpen);
  const [isTogglingReg, setIsTogglingReg] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState(settings.announcement?.text || "");
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcement?.enabled ?? true);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  // Filter recent registrations
  const filteredRegistrations = recentRegistrations.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.registrationId?.toLowerCase().includes(term) ||
      r.teamName?.toLowerCase().includes(term) ||
      r.projectTitle?.toLowerCase().includes(term) ||
      r.collegeName?.toLowerCase().includes(term) ||
      r.leadMember?.name?.toLowerCase().includes(term) ||
      r.leadMember?.email?.toLowerCase().includes(term)
    );
  });

  const capacityPercent = settings.maxCapacity
    ? Math.min(100, Math.round((totalRegistrations / settings.maxCapacity) * 100))
    : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleToggleRegistration = async () => {
    setIsTogglingReg(true);
    const nextState = !isRegOpen;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationOpen: nextState }),
      });
      if (res.ok) {
        setIsRegOpen(nextState);
        showToast(
          nextState
            ? "Expothon registrations are now OPEN live sitewide."
            : "Expothon registrations are now PAUSED sitewide."
        );
      }
    } catch (e) {
      showToast("Failed to update registration status.");
    } finally {
      setIsTogglingReg(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    setSavingAnnouncement(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement: {
            enabled: announcementEnabled,
            text: announcementText,
            linkUrl: "/register",
            linkText: "Register Team",
          },
        }),
      });
      if (res.ok) {
        showToast("Header announcement banner updated live.");
        setAnnouncementModalOpen(false);
      }
    } catch (e) {
      showToast("Failed to save announcement banner.");
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const tracks = [
    { id: "track-1", code: "TRACK-01", name: "Smart Healthcare", count: trackCounts["track-1"] || 0, color: "bg-blue-500" },
    { id: "track-2", code: "TRACK-02", name: "Edge AI & Robotics", count: trackCounts["track-2"] || 0, color: "bg-purple-500" },
    { id: "track-3", code: "TRACK-03", name: "Smart Agri-Tech", count: trackCounts["track-3"] || 0, color: "bg-emerald-500" },
    { id: "track-4", code: "TRACK-04", name: "Industrial IoT", count: trackCounts["track-4"] || 0, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded border border-primary/40 bg-primary/10 text-foreground text-xs flex items-center justify-between font-mono animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header & Fast Action Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              SYSTEM CONSOLE
            </Badge>
            <Badge variant={isRegOpen ? "success" : "warning"} size="sm">
              ● {isRegOpen ? "REGISTRATION ACTIVE" : "REGISTRATION PAUSED"}
            </Badge>
            <span className="text-[11px] font-mono text-muted-foreground">
              Exhibition: November 04, 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Administrative Dashboard
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {settings.centreName} • {settings.department}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Excel */}
          <a href="/api/admin/export?format=xlsx" download>
            <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs h-9">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </Button>
          </a>

          {/* Export CSV */}
          <a href="/api/admin/export?format=csv" download>
            <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs h-9">
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </Button>
          </a>

          {/* Announcement Modal Trigger */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAnnouncementModalOpen(true)}
            className="gap-1.5 font-mono text-xs h-9"
          >
            <Bell className="h-3.5 w-3.5 text-primary" />
            <span>Broadcast</span>
          </Button>

          {/* Quick Toggle Registration */}
          <Button
            size="sm"
            onClick={handleToggleRegistration}
            isLoading={isTogglingReg}
            variant={isRegOpen ? "secondary" : "primary"}
            className="gap-1.5 font-mono text-xs h-9"
          >
            <Power className="h-3.5 w-3.5" />
            <span>{isRegOpen ? "Pause Registration" : "Open Registration"}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row (4 Core Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="p-5 rounded border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Teams
            </span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground font-mono">
              {totalRegistrations}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              / {settings.maxCapacity} capacity
            </span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              {capacityPercent}% filled
            </span>
          </div>
        </div>

        {/* Shortlisted / Confirmed */}
        <div className="p-5 rounded border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Shortlisted / Confirmed
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-500 font-mono">
              {(statusCounts["Shortlisted"] || 0) + (statusCounts["Confirmed"] || 0)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              ({statusCounts["Confirmed"] || 0} Confirmed)
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Teams approved for physical exhibition stalls
          </p>
        </div>

        {/* Pending Technical Review */}
        <div className="p-5 rounded border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Review Queue
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-500 font-mono">
              {(statusCounts["Submitted"] || 0) + (statusCounts["Under Review"] || 0)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              awaiting jury
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Abstracts in evaluation pipeline
          </p>
        </div>

        {/* Hardware Prototype Readiness */}
        <div className="p-5 rounded border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Power & Lab Benches
            </span>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-base font-bold text-foreground font-mono block">
              {hardwareStats.powerNeeded} Stalls with 230V AC
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {hardwareStats.wifiNeeded} teams requesting Wi-Fi
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Workstation logistical requirements
          </p>
        </div>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Distribution (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Thematic Track Distribution</span>
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              {totalRegistrations} total submissions
            </span>
          </div>

          <div className="space-y-3.5">
            {tracks.map((t) => {
              const pct = totalRegistrations > 0 ? Math.round((t.count / totalRegistrations) * 100) : 0;
              return (
                <div key={t.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-foreground">
                      {t.code} • {t.name}
                    </span>
                    <span className="text-muted-foreground">
                      {t.count} teams ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${t.color} transition-all`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institution & Diversity Breakdown (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Institutional & Prototype Diversity</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 rounded border border-border bg-background space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Internal SSE Teams
              </span>
              <span className="text-2xl font-bold font-mono text-foreground">
                {institutionStats.internalCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">
                Saveetha School of Eng.
              </span>
            </div>

            <div className="p-3.5 rounded border border-border bg-background space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                External College Teams
              </span>
              <span className="text-2xl font-bold font-mono text-primary">
                {institutionStats.externalCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">
                All-India Universities
              </span>
            </div>

            <div className="p-3.5 rounded border border-border bg-background space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Hardware Tested / PCB
              </span>
              <span className="text-xl font-bold font-mono text-emerald-500">
                {hardwareStats.pcbCount + hardwareStats.prototypeCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">
                Ready for live demonstration
              </span>
            </div>

            <div className="p-3.5 rounded border border-border bg-background space-y-1">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Breadboard / Prototype
              </span>
              <span className="text-xl font-bold font-mono text-foreground">
                {hardwareStats.breadboardCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">
                Functional circuit stage
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Searchable Submissions Table + System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Searchable Submissions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">
                Recent Submissions Queue
              </h2>
            </div>

            {/* Quick Live Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ID, team, or college..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded border border-border bg-background text-foreground placeholder:text-muted-foreground/60 font-mono"
              />
            </div>
          </div>

          <div className="rounded border border-border bg-card overflow-hidden shadow-sm">
            {filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-xs font-mono text-muted-foreground">
                  {searchTerm ? "No matching submissions found." : "No registrations received yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-[10px] font-mono uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3">ID / Team</th>
                      <th className="p-3">Project Title</th>
                      <th className="p-3">College</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg._id?.toString() || reg.registrationId} className="hover:bg-muted/30">
                        <td className="p-3">
                          <Link
                            href={`/admin/registrations/${reg._id || reg.registrationId}`}
                            className="font-mono font-bold text-primary hover:underline block"
                          >
                            {reg.registrationId}
                          </Link>
                          <span className="text-muted-foreground text-[11px] block truncate max-w-[140px]">
                            {reg.teamName}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-foreground max-w-xs truncate">
                          <span title={reg.projectTitle}>{reg.projectTitle}</span>
                          <span className="text-[10px] font-mono text-muted-foreground block">
                            Track: {reg.trackId}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground truncate max-w-[160px]" title={reg.collegeName}>
                          {reg.collegeName}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={
                              reg.status === "Confirmed"
                                ? "success"
                                : reg.status === "Shortlisted"
                                ? "default"
                                : reg.status === "Rejected"
                                ? "destructive"
                                : "warning"
                            }
                            size="sm"
                          >
                            {reg.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Link href={`/admin/registrations/${reg._id || reg.registrationId}`}>
                            <Button size="sm" variant="ghost" className="h-7 px-2 font-mono text-[11px] gap-1">
                              <span>Review</span>
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: System Diagnostics & Audit Trail */}
        <div className="lg:col-span-4 space-y-6">
          {/* System Infrastructure Diagnostics */}
          <div className="p-5 rounded border border-border bg-card space-y-3 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary" />
              <span>System Infrastructure</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Database Engine</span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MongoDB Atlas</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Email Dispatch</span>
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <Mail className="h-3 w-3" />
                  <span>Nodemailer Auto-Send</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Google Auth</span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <Key className="h-3 w-3" />
                  <span>OAuth 2.0 Active</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                <span className="text-muted-foreground">Security Auditing</span>
                <span className="text-foreground">Strict Mode ON</span>
              </div>
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="p-5 rounded border border-border bg-card space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>Recent Audit Trail</span>
              </h3>
              <Link href="/admin/audit" className="text-[10px] font-mono text-primary hover:underline">
                View All →
              </Link>
            </div>

            {recentAudits.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground">No recent audit logs.</p>
            ) : (
              <div className="space-y-2.5">
                {recentAudits.map((log) => (
                  <div
                    key={log._id?.toString() || Math.random().toString()}
                    className="text-[11px] font-mono border-b border-border/50 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between text-foreground">
                      <span className="font-semibold text-primary">{log.action}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <span className="text-muted-foreground truncate block">
                      {log.userEmail || "System"} • {log.targetEntity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-lg border border-border bg-card shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span>Broadcast Sitewide Announcement</span>
              </h3>
              <button
                type="button"
                onClick={() => setAnnouncementModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modalAnnEnabled"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
                <label htmlFor="modalAnnEnabled" className="font-mono text-foreground cursor-pointer">
                  Display notification bar at the top of all pages
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">ANNOUNCEMENT TEXT</label>
                <textarea
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Registrations for Expothon 2026 are closing on October 28."
                  className="w-full p-3 rounded border border-border bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnnouncementModalOpen(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAnnouncement}
                isLoading={savingAnnouncement}
                className="font-mono text-xs"
              >
                Publish Broadcast
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
