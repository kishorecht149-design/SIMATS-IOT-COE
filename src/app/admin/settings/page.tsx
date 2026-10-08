"use client";

import React, { useState, useEffect } from "react";
import { Save, RefreshCw, CheckCircle, AlertCircle, Settings as SettingsIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlobalSettingsType, DEFAULT_SETTINGS } from "@/lib/default-settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettingsType>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormConfig = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      registrationFormConfig: {
        allowAbstractUpload: true,
        requireAbstractUpload: true,
        allowPosterUpload: true,
        allowDemoUrl: true,
        requireMentorDetails: false,
        allowHardwareChecklist: true,
        ...(prev.registrationFormConfig || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update settings");
      } else {
        setSettings(data.settings);
        setSuccessMessage("Global settings updated and live cache revalidated successfully.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground font-mono text-xs">
        Loading system configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              SUPER_ADMIN ONLY
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <span>Global Institutional Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Control event metadata, registration limits, venue details, and site banners.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          isLoading={saving}
          className="gap-2 font-semibold font-mono text-xs"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Event & Institution Core */}
        <div className="p-6 rounded border border-border bg-card space-y-4">
          <h2 className="text-sm font-bold tracking-tight text-foreground uppercase font-mono">
            1. Institution & Event Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">INSTITUTION NAME</label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">INSTITUTION SHORT NAME</label>
              <input
                type="text"
                value={settings.institutionShort}
                onChange={(e) => setSettings({ ...settings, institutionShort: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">DEPARTMENT</label>
              <input
                type="text"
                value={settings.department}
                onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">CENTRE OF EXCELLENCE NAME</label>
              <input
                type="text"
                value={settings.centreName}
                onChange={(e) => setSettings({ ...settings, centreName: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">EVENT NAME</label>
              <input
                type="text"
                value={settings.eventName}
                onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">EDITION</label>
              <input
                type="text"
                value={settings.eventEdition}
                onChange={(e) => setSettings({ ...settings, eventEdition: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">EVENT START DATE (EXHIBITION DAY)</label>
              <input
                type="datetime-local"
                value={settings.eventStartDate ? new Date(settings.eventStartDate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setSettings({ ...settings, eventStartDate: new Date(e.target.value).toISOString() })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">EVENT END DATE</label>
              <input
                type="datetime-local"
                value={settings.eventEndDate ? new Date(settings.eventEndDate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setSettings({ ...settings, eventEndDate: new Date(e.target.value).toISOString() })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="font-mono text-muted-foreground">TAGLINE / SUBHEADLINE</label>
              <input
                type="text"
                value={settings.eventTagline}
                onChange={(e) => setSettings({ ...settings, eventTagline: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Registration Limits & Form Field Configuration */}
        <div className="p-6 rounded border border-border bg-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase font-mono">
                2. Registration Limits & Form Field Configuration
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Control submission limits, toggle form sections on/off, customize mandatory fields, and add custom questions.
              </p>
            </div>
            <Badge variant="tech" size="sm">LIVE FORM BUILDER</Badge>
          </div>

          {/* Core Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded border border-border bg-muted/20 space-y-2">
              <label className="font-mono text-muted-foreground block font-semibold">REGISTRATION STATUS</label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="regOpen"
                  checked={settings.registrationOpen}
                  onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })}
                  className="h-4 w-4 rounded text-primary"
                />
                <label htmlFor="regOpen" className="font-bold text-foreground cursor-pointer">
                  {settings.registrationOpen ? "Accepting Submissions (OPEN)" : "Submissions Paused (CLOSED)"}
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground font-semibold">MAXIMUM TEAM CAPACITY</label>
              <input
                type="number"
                value={settings.maxCapacity}
                onChange={(e) => setSettings({ ...settings, maxCapacity: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground font-semibold">REGISTRATION DEADLINE</label>
              <input
                type="datetime-local"
                value={settings.registrationDeadline ? new Date(settings.registrationDeadline).toISOString().slice(0, 16) : ""}
                onChange={(e) => setSettings({ ...settings, registrationDeadline: new Date(e.target.value).toISOString() })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground font-semibold">MIN TEAM MEMBERS</label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.minTeamSize}
                onChange={(e) => setSettings({ ...settings, minTeamSize: parseInt(e.target.value) || 1 })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground font-semibold">MAX TEAM MEMBERS</label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.maxTeamSize}
                onChange={(e) => setSettings({ ...settings, maxTeamSize: parseInt(e.target.value) || 4 })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground font-semibold">REGISTRATION FEE / NOTICE</label>
              <input
                type="text"
                value={settings.registrationFormConfig?.registrationFeeNote || ""}
                onChange={(e) => updateFormConfig("registrationFeeNote", e.target.value)}
                placeholder="e.g. Free registration for all verified student teams"
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>
          </div>

          {/* Form Field Visibility & Validation Toggles */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase text-foreground">
              Form Sections & Uploads Toggles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Abstract PDF Upload</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Show PDF upload step</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.allowAbstractUpload ?? true}
                  onChange={(e) => updateFormConfig("allowAbstractUpload", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>

              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Mandatory Abstract PDF</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Require PDF to submit</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.requireAbstractUpload ?? true}
                  onChange={(e) => updateFormConfig("requireAbstractUpload", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>

              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Poster Upload Field</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Optional poster image</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.allowPosterUpload ?? true}
                  onChange={(e) => updateFormConfig("allowPosterUpload", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>

              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Demo Video / Repo URL</span>
                  <span className="text-[10px] text-muted-foreground font-mono">YouTube / GitHub links</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.allowDemoUrl ?? true}
                  onChange={(e) => updateFormConfig("allowDemoUrl", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>

              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Hardware Components Tagging</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Microcontroller & sensors list</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.allowHardwareChecklist ?? true}
                  onChange={(e) => updateFormConfig("allowHardwareChecklist", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>

              <div className="p-3 rounded border border-border bg-background flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Require Faculty Guide</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Mandatory mentor contact</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationFormConfig?.requireMentorDetails ?? false}
                  onChange={(e) => updateFormConfig("requireMentorDetails", e.target.checked)}
                  className="h-4 w-4 rounded text-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Custom Instructions */}
          <div className="space-y-1.5 text-xs">
            <label className="font-mono text-muted-foreground font-semibold">
              FORM HEADER GUIDELINES / INSTRUCTIONS
            </label>
            <textarea
              rows={2}
              value={settings.registrationFormConfig?.customInstructions || ""}
              onChange={(e) => updateFormConfig("customInstructions", e.target.value)}
              placeholder="Guidelines displayed at the top of the registration form for students..."
              className="w-full p-2.5 rounded border border-border bg-background text-foreground leading-relaxed"
            />
          </div>

          {/* Custom Questions / Fields Builder */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-foreground">
                  Dynamic Extra Custom Fields ({settings.registrationFormConfig?.customFields?.length || 0})
                </h3>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Add additional questions to the registration form (e.g. Dietary preference, GitHub handle, accommodation request)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newField = {
                    id: `cf-${Date.now()}`,
                    label: "New Custom Question",
                    type: "text" as const,
                    required: false,
                    placeholder: "Enter details",
                  };
                  const currentFields = settings.registrationFormConfig?.customFields || [];
                  updateFormConfig("customFields", [...currentFields, newField]);
                }}
                className="px-3 py-1.5 rounded text-xs font-mono border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                + Add Custom Question
              </button>
            </div>

            <div className="space-y-2">
              {(settings.registrationFormConfig?.customFields || []).map((field, idx) => (
                <div
                  key={field.id || idx}
                  className="p-3.5 rounded border border-border bg-background space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary text-[11px]">
                      Field #{idx + 1}: {field.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.registrationFormConfig?.customFields || []).filter(
                          (_, i) => i !== idx
                        );
                        updateFormConfig("customFields", updated);
                      }}
                      className="text-red-500 hover:text-red-400 font-mono text-[11px]"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-mono text-muted-foreground text-[10px]">QUESTION / FIELD LABEL</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...(settings.registrationFormConfig?.customFields || [])];
                          updated[idx].label = e.target.value;
                          updateFormConfig("customFields", updated);
                        }}
                        className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground text-[10px]">INPUT TYPE</label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...(settings.registrationFormConfig?.customFields || [])];
                          updated[idx].type = e.target.value as any;
                          updateFormConfig("customFields", updated);
                        }}
                        className="w-full h-8 px-2 rounded border border-border bg-card text-foreground font-mono"
                      >
                        <option value="text">Single Line Text</option>
                        <option value="select">Dropdown Select</option>
                        <option value="textarea">Long Textarea</option>
                        <option value="checkbox">Yes/No Checkbox</option>
                      </select>
                    </div>

                    <div className="space-y-1 flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-foreground">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const updated = [...(settings.registrationFormConfig?.customFields || [])];
                            updated[idx].required = e.target.checked;
                            updateFormConfig("customFields", updated);
                          }}
                          className="h-3.5 w-3.5 rounded text-primary"
                        />
                        <span>Mandatory</span>
                      </label>
                    </div>

                    {field.type === "select" && (
                      <div className="sm:col-span-4 space-y-1">
                        <label className="font-mono text-muted-foreground text-[10px]">
                          DROPDOWN CHOICES (COMMA SEPARATED)
                        </label>
                        <input
                          type="text"
                          value={field.options || ""}
                          onChange={(e) => {
                            const updated = [...(settings.registrationFormConfig?.customFields || [])];
                            updated[idx].options = e.target.value;
                            updateFormConfig("customFields", updated);
                          }}
                          placeholder="Option 1, Option 2, Option 3"
                          className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Venue & Contact */}
        <div className="p-6 rounded border border-border bg-card space-y-4">
          <h2 className="text-sm font-bold tracking-tight text-foreground uppercase font-mono">
            3. Venue & Contact Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">VENUE LAB / HALL</label>
              <input
                type="text"
                value={settings.venueName}
                onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">OFFICIAL CONTACT EMAIL</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">OFFICIAL CONTACT PHONE</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-muted-foreground">FULL POSTAL ADDRESS</label>
              <input
                type="text"
                value={settings.venueAddress}
                onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Announcement Bar */}
        <div className="p-6 rounded border border-border bg-card space-y-4">
          <h2 className="text-sm font-bold tracking-tight text-foreground uppercase font-mono flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span>4. Header Announcement Bar</span>
          </h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="annEnabled"
                checked={settings.announcement.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, enabled: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded text-primary"
              />
              <label htmlFor="annEnabled" className="font-medium text-foreground cursor-pointer">
                Display Announcement Strip at top of all pages
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-mono text-muted-foreground">ANNOUNCEMENT MESSAGE</label>
                <input
                  type="text"
                  value={settings.announcement.text}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcement: { ...settings.announcement, text: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">CTA BUTTON TEXT</label>
                <input
                  type="text"
                  value={settings.announcement.linkText || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcement: { ...settings.announcement, linkText: e.target.value },
                    })
                  }
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <Button type="submit" isLoading={saving} size="lg" className="gap-2 font-mono text-xs">
            <Save className="h-4 w-4" />
            <span>Apply Global Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
