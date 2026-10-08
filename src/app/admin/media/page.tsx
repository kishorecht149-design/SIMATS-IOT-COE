"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, Image as ImageIcon, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface MediaItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string;
  category: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (err) {
      console.error("Failed to load media assets", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", file.type === "application/pdf" ? "document" : "gallery");
      formData.append("altText", file.name);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Upload failed");
      } else {
        fetchMedia();
      }
    } catch (err) {
      setErrorMessage("Network error during file upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media asset permanently?")) return;

    try {
      await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      setMediaList(mediaList.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete media", err);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered =
    filterCategory === "all"
      ? mediaList
      : mediaList.filter((m) => m.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              ASSET STORAGE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span>Media & Document Library</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Upload institutional photographs, lab equipment schematics, and official brochures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              isLoading={uploading}
              className="gap-2 font-mono text-xs pointer-events-none"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
            </Button>
          </label>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Asset Grid */}
      <div className="rounded border border-border bg-card p-6 space-y-6">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            Loading media assets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground space-y-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p>No media assets uploaded yet.</p>
            <p className="text-[11px] text-muted-foreground/70">
              Upload photos or PDFs to use across CMS section blocks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="rounded border border-border bg-background overflow-hidden flex flex-col justify-between group shadow-sm"
              >
                <div className="aspect-[4/3] relative bg-muted/20 flex items-center justify-center overflow-hidden">
                  {item.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.fileUrl}
                      alt={item.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <FileText className="h-8 w-8 text-primary" />
                      <span className="text-[10px] font-mono">PDF DOCUMENT</span>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2 text-xs">
                  <div className="truncate font-semibold text-foreground font-mono text-[11px]" title={item.fileName}>
                    {item.fileName}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.fileUrl, item._id)}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-primary hover:underline"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
