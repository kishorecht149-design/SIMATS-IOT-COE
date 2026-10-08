import React from "react";
import { getAuditLogs } from "@/lib/services/audit-service";
import { Badge } from "@/components/ui/Badge";
import { History, ShieldAlert } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const { logs, total } = await getAuditLogs(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="tech" size="sm">
              AUDIT TRAIL
            </Badge>
            <Badge variant="outline" size="sm">
              {total} TOTAL EVENTS
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <span>System Audit & Activity Logs</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Immutable log of staff actions, logins, registration updates, and content mutations.
          </p>
        </div>
      </div>

      <div className="rounded border border-border bg-card overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground">
            No audit records logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[10px] font-mono uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Actor / Email</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Details / Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {logs.map((log: any) => (
                  <tr key={log._id.toString()} className="hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground whitespace-nowrap text-[11px]">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="p-3">
                      <Badge variant="tech" size="sm" className="font-bold">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 text-foreground font-semibold">
                      {log.targetEntity}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {log.userEmail}
                    </td>
                    <td className="p-3 text-muted-foreground text-[11px]">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="p-3 max-w-xs truncate text-muted-foreground text-[10px]">
                      {log.diff && Object.keys(log.diff).length > 0
                        ? JSON.stringify(log.diff)
                        : "—"}
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
