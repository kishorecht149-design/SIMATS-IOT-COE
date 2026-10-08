"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Edit, ExternalLink, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface PageListItem {
  slug: string;
  title: string;
  metaDescription: string;
  status: string;
  sectionCount: number;
  updatedAt: string;
}

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms/pages");
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error("Failed to load CMS pages", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              BLOCK CMS ENGINE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Content Pages & Section Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Edit sections, reorder blocks, update copy, and publish revisions across all public pages.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchPages}
          className="gap-2 font-mono text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="rounded border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            Loading CMS page hierarchy...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[10px] font-mono uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Page Route</th>
                  <th className="p-3">Page Title</th>
                  <th className="p-3">Active Blocks</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Modified</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pages.map((p) => (
                  <tr key={p.slug} className="hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-primary">
                      /{p.slug === "home" ? "" : p.slug}
                    </td>
                    <td className="p-3 font-semibold text-foreground">
                      {p.title}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{p.sectionCount} blocks</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={p.status === "published" ? "success" : "warning"}
                        size="sm"
                      >
                        {p.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href={`/admin/pages/${p.slug}`}>
                          <Button size="sm" variant="outline" className="gap-1.5 h-8 font-mono text-[11px]">
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Blocks</span>
                          </Button>
                        </Link>
                        <Link
                          href={`/${p.slug === "home" ? "" : p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="View live page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
