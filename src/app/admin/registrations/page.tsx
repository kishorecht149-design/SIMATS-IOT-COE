"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Award,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface RegistrationItem {
  _id: string;
  registrationId: string;
  teamName: string;
  collegeName: string;
  projectTitle: string;
  trackId: string;
  status: string;
  leadMember: {
    name: string;
    email: string;
    phone: string;
  };
  teamMembers: any[];
  checkedIn: boolean;
  createdAt: string;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRegistrations();
  }, [search, statusFilter, trackFilter, page]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        track: trackFilter,
        page: page.toString(),
        limit: "20",
      });

      const res = await fetch(`/api/admin/registrations?${params.toString()}`);
      const data = await res.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch (err) {
      console.error("Failed to load registrations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: "xlsx" | "csv") => {
    const params = new URLSearchParams({
      format,
      status: statusFilter,
      track: trackFilter,
    });
    window.open(`/api/admin/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              EXHIBITION REGISTRY
            </Badge>
            <Badge variant="outline" size="sm">
              {totalCount} TOTAL SUBMISSIONS
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Registrations & Applicant Management</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Filter, search, evaluate project abstracts, update shortlisting status, and export rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("xlsx")}
            className="gap-1.5 font-mono text-xs"
          >
            <Download className="h-3.5 w-3.5 text-emerald-500" />
            <span>Export XLSX</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            className="gap-1.5 font-mono text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded border border-border bg-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, Team, College, Project Title, or Lead Email..."
              className="w-full h-9 pl-9 pr-3 rounded border border-border bg-background text-foreground text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded border border-border bg-background text-foreground text-xs font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted (Queue)</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Waitlisted">Waitlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={trackFilter}
              onChange={(e) => {
                setTrackFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 rounded border border-border bg-background text-foreground text-xs font-mono"
            >
              <option value="all">All Thematic Tracks</option>
              <option value="Smart Healthcare & Telemetry">Track 01: Healthcare</option>
              <option value="Edge AI & Autonomous Systems">Track 02: Edge AI</option>
              <option value="Smart Agriculture & Environment">Track 03: Agriculture</option>
              <option value="Industrial IoT & Smart Infrastructure">Track 04: Industrial IoT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="rounded border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            Loading registrations database...
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground space-y-2">
            <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p>No registration records matched your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[10px] font-mono uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Reg ID</th>
                  <th className="p-3">Team & Institution</th>
                  <th className="p-3">Project Title</th>
                  <th className="p-3">Track</th>
                  <th className="p-3">Team Lead</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-primary whitespace-nowrap">
                      {reg.registrationId}
                    </td>
                    <td className="p-3 max-w-[200px]">
                      <span className="font-bold text-foreground block truncate">
                        {reg.teamName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono truncate block" title={reg.collegeName}>
                        {reg.collegeName}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-foreground max-w-xs truncate" title={reg.projectTitle}>
                      {reg.projectTitle}
                    </td>
                    <td className="p-3 text-muted-foreground text-[11px] truncate max-w-[150px]">
                      {reg.trackId}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">
                      <span className="text-foreground block">{reg.leadMember?.name}</span>
                      <span className="text-[10px]">{reg.leadMember?.email}</span>
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
                    <td className="p-3 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                      {formatDate(reg.createdAt)}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link href={`/admin/registrations/${reg._id}`}>
                        <Button size="sm" variant="outline" className="gap-1 h-7 font-mono text-[11px]">
                          <Eye className="h-3.5 w-3.5" />
                          <span>Review</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              Page {page} of {totalPages} ({totalCount} total entries)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-3 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
