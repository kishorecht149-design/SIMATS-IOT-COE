"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Clock, RefreshCw, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

interface ContactMsg {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ContactMsg | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load contact messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      setMessages(
        messages.map((m) => (m._id === id ? { ...m, status: status as any } : m))
      );
      if (selectedMsg?._id === id) {
        setSelectedMsg({ ...selectedMsg, status: status as any });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              DESK INBOX
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Contact Inquiries Inbox</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Messages and inquiries submitted by external and internal participants.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          className="gap-2 font-mono text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (5 Cols) */}
        <div className="lg:col-span-5 rounded border border-border bg-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-muted-foreground">
              Loading inquiries...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-muted-foreground">
              No inquiries in inbox.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((msg) => {
                const isSelected = selectedMsg?._id === msg._id;
                return (
                  <div
                    key={msg._id}
                    onClick={() => {
                      setSelectedMsg(msg);
                      if (msg.status === "unread") {
                        handleUpdateStatus(msg._id, "read");
                      }
                    }}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected
                        ? "bg-primary/10"
                        : msg.status === "unread"
                        ? "bg-muted/40 font-semibold"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground truncate">
                        {msg.name}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-foreground truncate">
                      {msg.subject}
                    </div>

                    <div className="text-[11px] text-muted-foreground truncate line-clamp-1">
                      {msg.message}
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <Badge
                        variant={
                          msg.status === "unread"
                            ? "warning"
                            : msg.status === "replied"
                            ? "success"
                            : "outline"
                        }
                        size="sm"
                        className="text-[9px]"
                      >
                        {msg.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Detail View (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedMsg ? (
            <div className="p-6 rounded border border-border bg-card shadow-sm space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {selectedMsg.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-muted-foreground">
                    <span>From: <strong>{selectedMsg.name}</strong></span>
                    <span>&lt;{selectedMsg.email}&gt;</span>
                    {selectedMsg.phone && <span>Tel: {selectedMsg.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMsg.status}
                    onChange={(e) => handleUpdateStatus(selectedMsg._id, e.target.value)}
                    className="h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs font-mono"
                  >
                    <option value="unread">Mark as Unread</option>
                    <option value="read">Mark as Read</option>
                    <option value="replied">Mark as Replied</option>
                    <option value="archived">Archive</option>
                  </select>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded border border-border/80 bg-background/50 text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </div>

              {/* Quick Reply Button */}
              <div className="pt-2 flex justify-end">
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                    selectedMsg.subject
                  )}`}
                  className="inline-flex"
                >
                  <Button size="sm" className="gap-2 font-mono text-xs">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Reply via Email Client</span>
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded border border-border bg-card text-center text-xs font-mono text-muted-foreground">
              Select an inquiry message from the list to view full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
