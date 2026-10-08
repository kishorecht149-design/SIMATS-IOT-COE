"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, UserPlus, Users, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR" | "REGISTRATION_MANAGER";
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"SUPER_ADMIN" | "EDITOR" | "REGISTRATION_MANAGER">("EDITOR");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create user");
      } else {
        setSuccessMessage(`User ${formName} added with role ${formRole}`);
        setShowAddModal(false);
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        fetchUsers();
      }
    } catch (err) {
      setErrorMessage("Network error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              RBAC DIRECTORY
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Administrator & Role Management</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Manage authorized staff accounts with Super Admin, Editor, and Registration Manager roles.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 font-semibold font-mono text-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Account</span>
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            Loading authorized accounts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[10px] font-mono uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Last Login</th>
                  <th className="p-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30">
                    <td className="p-3 font-semibold text-foreground">
                      {u.name}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          u.role === "SUPER_ADMIN"
                            ? "default"
                            : u.role === "REGISTRATION_MANAGER"
                            ? "warning"
                            : "secondary"
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            u.isActive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {u.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">
                      {u.lastLoginAt ? formatDate(u.lastLoginAt) : "Never"}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground font-mono">
                Create Staff Account
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">NAME</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. K. Ramesh"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="coordinator@saveetha.simats.edu"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">TEMPORARY PASSWORD</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-muted-foreground">ROLE PERMISSION</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                >
                  <option value="EDITOR">EDITOR (Content pages, sections, news)</option>
                  <option value="REGISTRATION_MANAGER">REGISTRATION_MANAGER (Submissions, exports, status)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full system access & settings)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={submitting}>
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
