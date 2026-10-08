"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle2,
  AlertCircle,
  Layers,
  Code2,
  Sliders,
  ExternalLink,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SECTION_REGISTRY, SectionType } from "@/lib/cms/registry";

interface SectionItem {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data: Record<string, any>;
}

export default function PageBlockEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"form" | "json">("form");
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPageData();
  }, [slug]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/cms/${slug}`);
      const data = await res.json();
      if (data.page) {
        setTitle(data.page.title);
        setMetaDescription(data.page.metaDescription || "");
        setSections(data.page.sections || []);
        if (data.page.sections?.length > 0) {
          const firstId = data.page.sections[0].id;
          setSelectedSectionId(firstId);
          setJsonText(JSON.stringify(data.page.sections[0].data, null, 2));
        }
      }
    } catch (err) {
      console.error("Failed to fetch page data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSection = (sec: SectionItem) => {
    setSelectedSectionId(sec.id);
    setJsonText(JSON.stringify(sec.data, null, 2));
    setJsonError("");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => {
      s.order = idx;
    });

    setSections(newSections);
  };

  const handleToggleEnable = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this section block?")) return;
    const filtered = sections.filter((s) => s.id !== id);
    setSections(filtered);
    if (selectedSectionId === id) {
      const next = filtered[0]?.id || null;
      setSelectedSectionId(next);
      if (next) {
        const nextSec = filtered[0];
        setJsonText(JSON.stringify(nextSec.data, null, 2));
      }
    }
  };

  const handleAddSection = (type: SectionType) => {
    const def = SECTION_REGISTRY[type];
    const newSection: SectionItem = {
      id: `sec-${slug}-${type}-${Date.now()}`,
      type,
      enabled: true,
      order: sections.length,
      data: JSON.parse(JSON.stringify(def.defaultData)),
    };
    const updated = [...sections, newSection];
    setSections(updated);
    setSelectedSectionId(newSection.id);
    setJsonText(JSON.stringify(newSection.data, null, 2));
  };

  const handleUpdateSectionData = (key: string, value: any) => {
    if (!selectedSectionId) return;
    setSections((prev) => {
      const updated = prev.map((s) => {
        if (s.id === selectedSectionId) {
          const nextData = { ...s.data, [key]: value };
          setJsonText(JSON.stringify(nextData, null, 2));
          return { ...s, data: nextData };
        }
        return s;
      });
      return updated;
    });
  };

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setJsonError("");
      setSections((prev) =>
        prev.map((s) =>
          s.id === selectedSectionId ? { ...s, data: parsed } : s
        )
      );
    } catch (e: any) {
      setJsonError("Invalid JSON syntax: " + e.message);
    }
  };

  const handleSave = async (status: "draft" | "published" = "published") => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/cms/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          metaDescription,
          sections,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to save page");
      } else {
        setSuccessMessage(`Page changes published and updated live!`);
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      setErrorMessage("Network error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-muted-foreground">
        Loading visual block editor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="tech" size="sm">
                PAGE: /{slug === "home" ? "" : slug}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Editing &quot;{title}&quot;
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/${slug === "home" ? "" : slug}`}
            target="_blank"
            className="hidden sm:inline-flex"
          >
            <Button variant="outline" size="sm" className="gap-1.5 font-mono text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Live</span>
            </Button>
          </Link>

          <Button
            onClick={() => handleSave("published")}
            isLoading={saving}
            size="sm"
            className="gap-1.5 font-semibold font-mono text-xs"
          >
            <Save className="h-4 w-4" />
            <span>Publish Changes</span>
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
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

      {/* Page Title & Meta Controls */}
      <div className="p-4 sm:p-5 rounded border border-border bg-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-mono text-muted-foreground font-semibold">PAGE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-muted-foreground font-semibold">SEO META DESCRIPTION</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Block Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections Outline & Reordering (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Page Sections ({sections.length})</span>
              </h2>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => {
                const isSelected = sec.id === selectedSectionId;
                const def = SECTION_REGISTRY[sec.type] || { label: sec.type };

                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSelectSection(sec)}
                    className={`p-3 rounded border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                        : "border-border bg-background hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-muted-foreground text-[10px]">
                        #{idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-foreground block truncate">
                          {def.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate block">
                          {sec.data.title || sec.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleEnable(sec.id)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                          sec.enabled
                            ? "bg-emerald-500/10 text-emerald-500 font-bold"
                            : "bg-zinc-500/10 text-zinc-400"
                        }`}
                        title="Toggle visibility"
                      >
                        {sec.enabled ? "ON" : "OFF"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sec.id)}
                        className="p-1 rounded hover:bg-red-500/10 text-red-500"
                        title="Delete section"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Section Block Dropdown */}
            <div className="pt-3 border-t border-border space-y-1.5">
              <label className="text-[10px] font-mono text-muted-foreground block uppercase font-semibold">
                + Insert New Section Block
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddSection(e.target.value as SectionType);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
                className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs font-mono"
              >
                <option value="" disabled>
                  Select block type...
                </option>
                {Object.values(SECTION_REGISTRY).map((def) => (
                  <option key={def.type} value={def.type}>
                    {def.label} ({def.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Block Form Editor (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedSection ? (
            <div className="p-6 rounded border border-border bg-card shadow-sm space-y-6">
              {/* Header with Mode Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="tech" size="sm">
                      {selectedSection.type.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      ID: {selectedSection.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mt-1">
                    {SECTION_REGISTRY[selectedSection.type]?.label || selectedSection.type}
                  </h3>
                </div>

                {/* Form vs JSON Toggle */}
                <div className="flex items-center gap-1 p-1 bg-background border border-border rounded">
                  <button
                    type="button"
                    onClick={() => setEditMode("form")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      editMode === "form"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sliders className="h-3 w-3" />
                    <span>Visual Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode("json")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      editMode === "json"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code2 className="h-3 w-3" />
                    <span>Raw JSON</span>
                  </button>
                </div>
              </div>

              {/* JSON RAW MODE */}
              {editMode === "json" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Direct Block JSON Configuration</span>
                    <span>Validates syntax automatically</span>
                  </div>
                  <textarea
                    rows={18}
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className="w-full p-4 font-mono text-xs rounded border border-border bg-background text-foreground leading-relaxed focus:ring-1 focus:ring-primary"
                  />
                  {jsonError && (
                    <p className="text-xs font-mono text-red-500">{jsonError}</p>
                  )}
                </div>
              ) : (
                /* FORM VISUAL MODE */
                <div className="space-y-6">
                  {/* Common Header Fields: Title, Subtitle, Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {"title" in selectedSection.data && (
                      <div className="md:col-span-2 space-y-1">
                        <label className="font-mono text-muted-foreground font-semibold">
                          SECTION MAIN HEADING
                        </label>
                        <input
                          type="text"
                          value={selectedSection.data.title || ""}
                          onChange={(e) => handleUpdateSectionData("title", e.target.value)}
                          className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-bold text-sm"
                        />
                      </div>
                    )}

                    {"subtitle" in selectedSection.data && (
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground font-semibold">
                          SUBHEADING
                        </label>
                        <input
                          type="text"
                          value={selectedSection.data.subtitle || ""}
                          onChange={(e) => handleUpdateSectionData("subtitle", e.target.value)}
                          className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                        />
                      </div>
                    )}

                    {"badge" in selectedSection.data && (
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground font-semibold">
                          MICRO-BADGE LABEL
                        </label>
                        <input
                          type="text"
                          value={selectedSection.data.badge || ""}
                          onChange={(e) => handleUpdateSectionData("badge", e.target.value)}
                          placeholder="e.g. [EXPOTHON 2026]"
                          className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Hero Specific Fields */}
                  {selectedSection.type === "hero" && (
                    <div className="space-y-4 pt-3 border-t border-border text-xs">
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground font-semibold">
                          HERO DESCRIPTION / PARAGRAPH
                        </label>
                        <textarea
                          rows={3}
                          value={selectedSection.data.description || ""}
                          onChange={(e) => handleUpdateSectionData("description", e.target.value)}
                          className="w-full p-3 rounded border border-border bg-background text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            PRIMARY BUTTON TEXT
                          </label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaLabel || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaLabel", e.target.value)}
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            PRIMARY BUTTON URL
                          </label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaHref || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaHref", e.target.value)}
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            SECONDARY BUTTON TEXT
                          </label>
                          <input
                            type="text"
                            value={selectedSection.data.secondaryCtaLabel || ""}
                            onChange={(e) => handleUpdateSectionData("secondaryCtaLabel", e.target.value)}
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            SECONDARY BUTTON URL
                          </label>
                          <input
                            type="text"
                            value={selectedSection.data.secondaryCtaHref || ""}
                            onChange={(e) => handleUpdateSectionData("secondaryCtaHref", e.target.value)}
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracks Grid Block Editor */}
                  {selectedSection.type === "tracks_grid" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Exhibition Tracks ({selectedSection.data.tracks?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newTrack = {
                              id: `track-${Date.now()}`,
                              code: `TRACK-0${(selectedSection.data.tracks?.length || 0) + 1}`,
                              title: "New Innovation Track",
                              description: "Detailed track focus and project scope.",
                              topics: "Topic 1, Topic 2, Topic 3",
                            };
                            handleUpdateSectionData("tracks", [
                              ...(selectedSection.data.tracks || []),
                              newTrack,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Track</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.tracks || []).map((t: any, idx: number) => (
                          <div
                            key={t.id || idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {t.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.tracks.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("tracks", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete track"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TRACK CODE</label>
                                <input
                                  type="text"
                                  value={t.code || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.tracks];
                                    updated[idx].code = e.target.value;
                                    handleUpdateSectionData("tracks", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TRACK TITLE</label>
                                <input
                                  type="text"
                                  value={t.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.tracks];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("tracks", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <textarea
                                  rows={2}
                                  value={t.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.tracks];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("tracks", updated);
                                  }}
                                  className="w-full p-2 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">KEY TOPICS & TECHNOLOGIES</label>
                                <input
                                  type="text"
                                  value={t.topics || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.tracks];
                                    updated[idx].topics = e.target.value;
                                    handleUpdateSectionData("tracks", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline / Key Dates Block Editor */}
                  {selectedSection.type === "timeline" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Timeline Milestones ({selectedSection.data.events?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newEvent = {
                              phase: `0${(selectedSection.data.events?.length || 0) + 1}`,
                              title: "New Milestone",
                              date: "November 04, 2026",
                              status: "upcoming",
                              description: "Details for this event phase.",
                            };
                            handleUpdateSectionData("events", [
                              ...(selectedSection.data.events || []),
                              newEvent,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Milestone</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.events || []).map((ev: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                Phase {ev.phase}: {ev.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.events.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("events", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete event"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">PHASE #</label>
                                <input
                                  type="text"
                                  value={ev.phase || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.events];
                                    updated[idx].phase = e.target.value;
                                    handleUpdateSectionData("events", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">EVENT TITLE</label>
                                <input
                                  type="text"
                                  value={ev.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.events];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("events", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DATE STRING</label>
                                <input
                                  type="text"
                                  value={ev.date || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.events];
                                    updated[idx].date = e.target.value;
                                    handleUpdateSectionData("events", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">STATUS</label>
                                <select
                                  value={ev.status || "upcoming"}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.events];
                                    updated[idx].status = e.target.value;
                                    handleUpdateSectionData("events", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                                >
                                  <option value="completed">Completed</option>
                                  <option value="active">Active Now</option>
                                  <option value="upcoming">Upcoming</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={ev.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.events];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("events", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Grid Block Editor (Rules / Facilities) */}
                  {selectedSection.type === "card_grid" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Grid Cards ({selectedSection.data.cards?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newCard = {
                              badge: `ITEM-0${(selectedSection.data.cards?.length || 0) + 1}`,
                              title: "New Rule or Facility",
                              description: "Description of parameter or specification.",
                            };
                            handleUpdateSectionData("cards", [
                              ...(selectedSection.data.cards || []),
                              newCard,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Card</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.cards || []).map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                Card #{idx + 1} ({c.badge || "NO BADGE"})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.cards.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("cards", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete card"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">BADGE / CODE</label>
                                <input
                                  type="text"
                                  value={c.badge || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.cards];
                                    updated[idx].badge = e.target.value;
                                    handleUpdateSectionData("cards", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">CARD TITLE</label>
                                <input
                                  type="text"
                                  value={c.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.cards];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("cards", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <textarea
                                  rows={2}
                                  value={c.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.cards];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("cards", updated);
                                  }}
                                  className="w-full p-2 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ Accordion Block Editor */}
                  {selectedSection.type === "faq_accordion" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          FAQ Items ({selectedSection.data.items?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newItem = {
                              question: "New FAQ Question?",
                              answer: "Detailed answer explaining guidelines.",
                              category: "General",
                            };
                            handleUpdateSectionData("items", [
                              ...(selectedSection.data.items || []),
                              newItem,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Question</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.items || []).map((faq: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                FAQ #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.items.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("items", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete FAQ"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">QUESTION</label>
                                <input
                                  type="text"
                                  value={faq.question || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].question = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">ANSWER</label>
                                <textarea
                                  rows={3}
                                  value={faq.answer || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].answer = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full p-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Awards & Prizes Block Editor */}
                  {selectedSection.type === "awards_prizes" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Prize Categories ({selectedSection.data.prizes?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newPrize = {
                              rank: "Award",
                              title: "Best Innovation Award",
                              reward: "₹10,000 + Trophy",
                              description: "Conferred to outstanding hardware demonstration.",
                              badge: "MERIT",
                            };
                            handleUpdateSectionData("prizes", [
                              ...(selectedSection.data.prizes || []),
                              newPrize,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Prize Tier</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.prizes || []).map((pz: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                {pz.rank}: {pz.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.prizes.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("prizes", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete prize"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">RANK / TIER</label>
                                <input
                                  type="text"
                                  value={pz.rank || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.prizes];
                                    updated[idx].rank = e.target.value;
                                    handleUpdateSectionData("prizes", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">PRIZE TITLE</label>
                                <input
                                  type="text"
                                  value={pz.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.prizes];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("prizes", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">REWARD / AMOUNT</label>
                                <input
                                  type="text"
                                  value={pz.reward || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.prizes];
                                    updated[idx].reward = e.target.value;
                                    handleUpdateSectionData("prizes", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-emerald-500 font-bold"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={pz.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.prizes];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("prizes", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team Grid Block Editor */}
                  {selectedSection.type === "team_grid" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Committee Members ({selectedSection.data.members?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newMember = {
                              name: "Dr. Faculty Lead",
                              role: "Faculty Coordinator",
                              department: "Department of ECE, SSE",
                              email: "faculty@saveetha.com",
                            };
                            handleUpdateSectionData("members", [
                              ...(selectedSection.data.members || []),
                              newMember,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Member</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.members || []).map((m: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                {m.name} ({m.role})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.members.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("members", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete member"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">FULL NAME</label>
                                <input
                                  type="text"
                                  value={m.name || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.members];
                                    updated[idx].name = e.target.value;
                                    handleUpdateSectionData("members", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">ROLE / DESIGNATION</label>
                                <input
                                  type="text"
                                  value={m.role || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.members];
                                    updated[idx].role = e.target.value;
                                    handleUpdateSectionData("members", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DEPARTMENT / AFFILIATION</label>
                                <input
                                  type="text"
                                  value={m.department || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.members];
                                    updated[idx].department = e.target.value;
                                    handleUpdateSectionData("members", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">EMAIL CONTACT</label>
                                <input
                                  type="email"
                                  value={m.email || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.members];
                                    updated[idx].email = e.target.value;
                                    handleUpdateSectionData("members", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Downloads Block Editor */}
                  {selectedSection.type === "downloads" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Downloadable Documents ({selectedSection.data.files?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newFile = {
                              id: `file-${Date.now()}`,
                              title: "Expothon Official Document",
                              description: "PDF document or presentation template.",
                              fileSize: "1.2 MB",
                              fileFormat: "PDF",
                              downloadUrl: "#",
                            };
                            handleUpdateSectionData("files", [
                              ...(selectedSection.data.files || []),
                              newFile,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add File</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.files || []).map((f: any, idx: number) => (
                          <div
                            key={f.id || idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                {f.title} ({f.fileFormat || "PDF"})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.files.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("files", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete file"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DOCUMENT TITLE</label>
                                <input
                                  type="text"
                                  value={f.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.files];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("files", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">FORMAT (PDF/PPT/DOC)</label>
                                <input
                                  type="text"
                                  value={f.fileFormat || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.files];
                                    updated[idx].fileFormat = e.target.value;
                                    handleUpdateSectionData("files", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={f.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.files];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("files", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DOWNLOAD URL</label>
                                <input
                                  type="text"
                                  value={f.downloadUrl || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.files];
                                    updated[idx].downloadUrl = e.target.value;
                                    handleUpdateSectionData("files", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text & Image Block Editor */}
                  {selectedSection.type === "text_image" && (
                    <div className="space-y-4 pt-3 border-t border-border text-xs">
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground font-semibold">
                          BODY CONTENT (HTML SUPPORTED)
                        </label>
                        <textarea
                          rows={6}
                          value={selectedSection.data.body || ""}
                          onChange={(e) => handleUpdateSectionData("body", e.target.value)}
                          className="w-full p-3 rounded border border-border bg-background text-foreground font-mono text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            IMAGE URL (OR LEAVE EMPTY FOR SCHEMATIC)
                          </label>
                          <input
                            type="text"
                            value={selectedSection.data.imageSlot || ""}
                            onChange={(e) => handleUpdateSectionData("imageSlot", e.target.value)}
                            placeholder="/logo.png or https://..."
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground font-semibold">
                            IMAGE POSITION
                          </label>
                          <select
                            value={selectedSection.data.imagePosition || "right"}
                            onChange={(e) => handleUpdateSectionData("imagePosition", e.target.value)}
                            className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                          >
                            <option value="right">Right Side</option>
                            <option value="left">Left Side</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Schedule Agenda Block Editor */}
                  {selectedSection.type === "schedule_agenda" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Hourly Agenda Items ({selectedSection.data.items?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newItem = {
                              time: "10:00 AM - 11:00 AM",
                              title: "New Session / Activity",
                              location: "IoT Lab CoE",
                              speaker: "Session Lead",
                              badge: "SESSION",
                              description: "Detailed description of the schedule item.",
                            };
                            handleUpdateSectionData("items", [
                              ...(selectedSection.data.items || []),
                              newItem,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Agenda Item</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.items || []).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {item.time} — {item.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.items.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("items", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TIME SLOT</label>
                                <input
                                  type="text"
                                  value={item.time || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].time = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">SESSION TITLE</label>
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">LOCATION / VENUE</label>
                                <input
                                  type="text"
                                  value={item.location || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].location = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">SPEAKER / EVALUATOR</label>
                                <input
                                  type="text"
                                  value={item.speaker || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].speaker = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TAG / BADGE</label>
                                <input
                                  type="text"
                                  value={item.badge || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].badge = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={item.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.items];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("items", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Speakers & Jury Block Editor */}
                  {selectedSection.type === "speakers_grid" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Speakers & Evaluators ({selectedSection.data.speakers?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newSpeaker = {
                              name: "Dr. Guest Evaluator",
                              designation: "Senior Embedded Engineer",
                              organization: "Industrial IoT Labs",
                              topic: "Advanced Edge Computing",
                              bio: "Brief bio of evaluator or speaker.",
                              linkedin: "https://linkedin.com",
                              badge: "GUEST JURY",
                            };
                            handleUpdateSectionData("speakers", [
                              ...(selectedSection.data.speakers || []),
                              newSpeaker,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Speaker/Jury</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.speakers || []).map((spk: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {spk.name} ({spk.designation})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.speakers.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("speakers", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete speaker"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">NAME</label>
                                <input
                                  type="text"
                                  value={spk.name || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].name = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESIGNATION</label>
                                <input
                                  type="text"
                                  value={spk.designation || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].designation = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">ORGANIZATION / COMPANY</label>
                                <input
                                  type="text"
                                  value={spk.organization || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].organization = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">KEYNOTE TOPIC</label>
                                <input
                                  type="text"
                                  value={spk.topic || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].topic = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">BADGE / ROLE</label>
                                <input
                                  type="text"
                                  value={spk.badge || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].badge = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">BIO / SUMMARY</label>
                                <input
                                  type="text"
                                  value={spk.bio || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].bio = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">LINKEDIN URL</label>
                                <input
                                  type="text"
                                  value={spk.linkedin || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.speakers];
                                    updated[idx].linkedin = e.target.value;
                                    handleUpdateSectionData("speakers", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sponsors & Partners Block Editor */}
                  {selectedSection.type === "sponsors_grid" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Sponsors & Partners ({selectedSection.data.sponsors?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newSponsor = {
                              name: "Partner Organization",
                              tier: "Technical Partner",
                              description: "Sponsor description.",
                              websiteUrl: "#",
                            };
                            handleUpdateSectionData("sponsors", [
                              ...(selectedSection.data.sponsors || []),
                              newSponsor,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Sponsor</span>
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground text-[11px]">PARTNER NOTE / DISCLAIMER</label>
                        <input
                          type="text"
                          value={selectedSection.data.partnerNote || ""}
                          onChange={(e) => handleUpdateSectionData("partnerNote", e.target.value)}
                          className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.sponsors || []).map((sp: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {sp.name} ({sp.tier})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.sponsors.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("sponsors", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete sponsor"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">SPONSOR NAME</label>
                                <input
                                  type="text"
                                  value={sp.name || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.sponsors];
                                    updated[idx].name = e.target.value;
                                    handleUpdateSectionData("sponsors", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TIER</label>
                                <select
                                  value={sp.tier || "Technical Partner"}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.sponsors];
                                    updated[idx].tier = e.target.value;
                                    handleUpdateSectionData("sponsors", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                >
                                  <option value="Title Sponsor">Title Sponsor</option>
                                  <option value="Co-Sponsor">Co-Sponsor</option>
                                  <option value="Technical Partner">Technical Partner</option>
                                  <option value="Hardware Partner">Hardware Partner</option>
                                  <option value="Academic Partner">Academic Partner</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">WEBSITE URL</label>
                                <input
                                  type="text"
                                  value={sp.websiteUrl || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.sponsors];
                                    updated[idx].websiteUrl = e.target.value;
                                    handleUpdateSectionData("sponsors", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={sp.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.sponsors];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("sponsors", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Venue & Floorplan Block Editor */}
                  {selectedSection.type === "venue_floorplan" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">VENUE NAME</label>
                          <input
                            type="text"
                            value={selectedSection.data.venueName || ""}
                            onChange={(e) => handleUpdateSectionData("venueName", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">VENUE ADDRESS</label>
                          <input
                            type="text"
                            value={selectedSection.data.venueAddress || ""}
                            onChange={(e) => handleUpdateSectionData("venueAddress", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Exhibition Zones ({selectedSection.data.zones?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newZone = {
                              zoneCode: `ZONE-${String.fromCharCode(65 + (selectedSection.data.zones?.length || 0))}`,
                              name: "Specialized IoT Zone",
                              description: "Zone technical scope and equipment focus.",
                              facilities: ["AC Sockets", "Oscilloscopes"],
                            };
                            handleUpdateSectionData("zones", [
                              ...(selectedSection.data.zones || []),
                              newZone,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Zone</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.zones || []).map((zone: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {zone.zoneCode} — {zone.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.zones.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("zones", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete zone"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">ZONE CODE</label>
                                <input
                                  type="text"
                                  value={zone.zoneCode || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.zones];
                                    updated[idx].zoneCode = e.target.value;
                                    handleUpdateSectionData("zones", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">ZONE NAME</label>
                                <input
                                  type="text"
                                  value={zone.name || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.zones];
                                    updated[idx].name = e.target.value;
                                    handleUpdateSectionData("zones", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={zone.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.zones];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("zones", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Stages Pipeline Editor */}
                  {selectedSection.type === "registration_stages" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Registration Stages ({selectedSection.data.stages?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newStage = {
                              stageNumber: `0${(selectedSection.data.stages?.length || 0) + 1}`,
                              title: "New Stage Title",
                              dateRange: "Date Range",
                              status: "upcoming",
                              description: "Instructions for this stage.",
                            };
                            handleUpdateSectionData("stages", [
                              ...(selectedSection.data.stages || []),
                              newStage,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Stage</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PRIMARY CTA TEXT</label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaLabel || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaLabel", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PRIMARY CTA LINK</label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaHref || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaHref", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PIPELINE FOOTNOTE</label>
                          <input
                            type="text"
                            value={selectedSection.data.note || ""}
                            onChange={(e) => handleUpdateSectionData("note", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.stages || []).map((stg: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                Stage {stg.stageNumber}: {stg.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.stages.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("stages", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete stage"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">STAGE NUMBER</label>
                                <input
                                  type="text"
                                  value={stg.stageNumber || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.stages];
                                    updated[idx].stageNumber = e.target.value;
                                    handleUpdateSectionData("stages", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">STAGE STATUS</label>
                                <select
                                  value={stg.status || "upcoming"}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.stages];
                                    updated[idx].status = e.target.value;
                                    handleUpdateSectionData("stages", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                >
                                  <option value="completed">Completed</option>
                                  <option value="active">Active (Current)</option>
                                  <option value="upcoming">Upcoming</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DATE RANGE</label>
                                <input
                                  type="text"
                                  value={stg.dateRange || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.stages];
                                    updated[idx].dateRange = e.target.value;
                                    handleUpdateSectionData("stages", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">STAGE TITLE</label>
                                <input
                                  type="text"
                                  value={stg.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.stages];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("stages", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <input
                                  type="text"
                                  value={stg.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.stages];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("stages", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Workshops List Block Editor */}
                  {selectedSection.type === "workshops_list" && (
                    <div className="space-y-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase font-bold text-foreground">
                          Technical Workshops ({selectedSection.data.workshops?.length || 0})
                        </h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="gap-1 font-mono text-[11px]"
                          onClick={() => {
                            const newWorkshop = {
                              title: "New Technical Workshop",
                              track: "Track 01 & 02",
                              instructor: "Faculty Coordinator",
                              instructorDesignation: "Department of ECE, SSE SIMATS",
                              date: "November 03, 2026",
                              time: "10:00 AM - 1:00 PM",
                              location: "IoT Systems Lab",
                              seats: "40 Seats",
                              description: "Hands-on firmware session description.",
                              prerequisites: "Basic C programming",
                              badge: "HANDS-ON LAB",
                            };
                            handleUpdateSectionData("workshops", [
                              ...(selectedSection.data.workshops || []),
                              newWorkshop,
                            ]);
                          }}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Workshop</span>
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(selectedSection.data.workshops || []).map((ws: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded border border-border bg-background space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono font-bold text-xs text-primary">
                                #{idx + 1} {ws.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedSection.data.workshops.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleUpdateSectionData("workshops", updated);
                                }}
                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                title="Delete workshop"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                              <div className="sm:col-span-2 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">WORKSHOP TITLE</label>
                                <input
                                  type="text"
                                  value={ws.title || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].title = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">BADGE / LEVEL</label>
                                <input
                                  type="text"
                                  value={ws.badge || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].badge = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">INSTRUCTOR NAME</label>
                                <input
                                  type="text"
                                  value={ws.instructor || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].instructor = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DATE</label>
                                <input
                                  type="text"
                                  value={ws.date || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].date = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">TIME</label>
                                <input
                                  type="text"
                                  value={ws.time || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].time = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">LOCATION</label>
                                <input
                                  type="text"
                                  value={ws.location || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].location = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">AVAILABLE SEATS</label>
                                <input
                                  type="text"
                                  value={ws.seats || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].seats = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">PREREQUISITES</label>
                                <input
                                  type="text"
                                  value={ws.prerequisites || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].prerequisites = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full h-8 px-2.5 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                <label className="font-mono text-muted-foreground text-[11px]">DESCRIPTION</label>
                                <textarea
                                  rows={2}
                                  value={ws.description || ""}
                                  onChange={(e) => {
                                    const updated = [...selectedSection.data.workshops];
                                    updated[idx].description = e.target.value;
                                    handleUpdateSectionData("workshops", updated);
                                  }}
                                  className="w-full p-2 rounded border border-border bg-card text-foreground text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Announcement Block Editor */}
                  {selectedSection.type === "event_announcement" && (
                    <div className="space-y-4 pt-3 border-t border-border text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">EVENT BADGE</label>
                          <input
                            type="text"
                            value={selectedSection.data.badge || ""}
                            onChange={(e) => handleUpdateSectionData("badge", e.target.value)}
                            placeholder="e.g. NEW EVENT ANNOUNCED"
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PRIZE POOL / REWARD</label>
                          <input
                            type="text"
                            value={selectedSection.data.prizePool || ""}
                            onChange={(e) => handleUpdateSectionData("prizePool", e.target.value)}
                            placeholder="e.g. ₹1,00,000 Cash Pool + Certificates"
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">EVENT HEADLINE / TITLE</label>
                          <input
                            type="text"
                            value={selectedSection.data.title || ""}
                            onChange={(e) => handleUpdateSectionData("title", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">SUBTITLE / TAGLINE</label>
                          <input
                            type="text"
                            value={selectedSection.data.subtitle || ""}
                            onChange={(e) => handleUpdateSectionData("subtitle", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">DETAILED DESCRIPTION</label>
                          <textarea
                            rows={3}
                            value={selectedSection.data.description || ""}
                            onChange={(e) => handleUpdateSectionData("description", e.target.value)}
                            className="w-full p-2.5 rounded border border-border bg-background text-foreground leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">DATE & TIMELINE</label>
                          <input
                            type="text"
                            value={selectedSection.data.eventDate || ""}
                            onChange={(e) => handleUpdateSectionData("eventDate", e.target.value)}
                            placeholder="e.g. December 12 - 13, 2026"
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">VENUE / PLATFORM</label>
                          <input
                            type="text"
                            value={selectedSection.data.venue || ""}
                            onChange={(e) => handleUpdateSectionData("venue", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">ELIGIBILITY</label>
                          <input
                            type="text"
                            value={selectedSection.data.eligibility || ""}
                            onChange={(e) => handleUpdateSectionData("eligibility", e.target.value)}
                            placeholder="e.g. All Engineering Students (Teams of 2-4)"
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PRIMARY BUTTON TEXT</label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaLabel || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaLabel", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">PRIMARY BUTTON URL</label>
                          <input
                            type="text"
                            value={selectedSection.data.primaryCtaHref || ""}
                            onChange={(e) => handleUpdateSectionData("primaryCtaHref", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">SECONDARY BUTTON TEXT</label>
                          <input
                            type="text"
                            value={selectedSection.data.secondaryCtaLabel || ""}
                            onChange={(e) => handleUpdateSectionData("secondaryCtaLabel", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">SECONDARY BUTTON URL</label>
                          <input
                            type="text"
                            value={selectedSection.data.secondaryCtaHref || ""}
                            onChange={(e) => handleUpdateSectionData("secondaryCtaHref", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">FLASH ALERT BANNER (TOP)</label>
                          <input
                            type="text"
                            value={selectedSection.data.urgentBannerText || ""}
                            onChange={(e) => handleUpdateSectionData("urgentBannerText", e.target.value)}
                            placeholder="e.g. FLASH: Early Bird Registrations Open!"
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground text-xs"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-mono text-muted-foreground text-[11px]">COORDINATOR CONTACT FOOTNOTE</label>
                          <input
                            type="text"
                            value={selectedSection.data.coordinatorInfo || ""}
                            onChange={(e) => handleUpdateSectionData("coordinatorInfo", e.target.value)}
                            className="w-full h-8 px-2.5 rounded border border-border bg-background text-foreground font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded border border-border bg-card text-center text-xs font-mono text-muted-foreground">
              Select a section block on the left to edit its properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
