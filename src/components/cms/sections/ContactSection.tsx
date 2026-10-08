"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ContactSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    email?: string;
    phone?: string;
    address?: string;
    showMapEmbed?: boolean;
  };
}

export function ContactSection({ data }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setError(resData.error || "Failed to submit message");
      } else {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Official Communication
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            {data.title || "Contact & Location"}
          </h2>
          {data.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded border border-border bg-card space-y-4">
              <h3 className="font-bold text-base text-foreground font-mono">
                Department Information
              </h3>

              <div className="space-y-3 text-xs sm:text-sm font-mono text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>{data.address || "Saveetha School of Engineering, SIMATS, Chennai - 602105"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`mailto:${data.email}`} className="hover:text-primary transition-colors">
                    {data.email || "iotcoe.ece@saveetha.com"}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`tel:${data.phone}`} className="hover:text-primary transition-colors">
                    {data.phone || "+91 44 2680 1999"}
                  </a>
                </div>
              </div>
            </div>

            {/* Map Embed Frame */}
            {data.showMapEmbed !== false && (
              <div className="rounded border border-border overflow-hidden h-64 relative bg-muted/30">
                <iframe
                  title="Saveetha School of Engineering Location"
                  src="https://maps.google.com/maps?q=Saveetha%20School%20of%20Engineering,%20Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Contact Query Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded border border-border bg-card shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Messages are routed directly to the IoT CoE administrative desk.
                </p>
              </div>

              {success && (
                <div className="p-4 rounded border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Your message has been delivered to the CoE coordinators. We will respond via email.</span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-muted-foreground">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-muted-foreground">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@college.edu"
                      className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-muted-foreground">CONTACT PHONE</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-muted-foreground">SUBJECT *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Expothon Registration Query"
                      className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-muted-foreground">MESSAGE *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your query..."
                    className="w-full p-3 rounded border border-border bg-background text-foreground resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" isLoading={submitting} className="gap-2 font-mono text-xs">
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
