import React from "react";
import connectToDatabase from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import AuditLog from "@/models/AuditLog";
import { getGlobalSettings } from "@/lib/services/settings-service";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [conn, settings] = await Promise.all([
    connectToDatabase(),
    getGlobalSettings(),
  ]);

  let totalRegistrations = 0;
  let statusCounts: Record<string, number> = {
    Submitted: 0,
    "Under Review": 0,
    Shortlisted: 0,
    Confirmed: 0,
    Waitlisted: 0,
    Rejected: 0,
  };
  let trackCounts: Record<string, number> = {};
  let stateCounts: Record<string, number> = {};
  let recentRegistrations: any[] = [];
  let recentAudits: any[] = [];

  let hardwareStats = {
    powerNeeded: 0,
    wifiNeeded: 0,
    pcbCount: 0,
    breadboardCount: 0,
    prototypeCount: 0,
  };

  let institutionStats = {
    internalCount: 0,
    externalCount: 0,
  };

  if (conn) {
    try {
      totalRegistrations = await Registration.countDocuments();

      const [statusAgg, trackAgg, stateAgg, regList, audits] = await Promise.all([
        Registration.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Registration.aggregate([{ $group: { _id: "$trackId", count: { $sum: 1 } } }]),
        Registration.aggregate([{ $group: { _id: "$state", count: { $sum: 1 } } }]),
        Registration.find().sort({ createdAt: -1 }).limit(10).lean(),
        AuditLog.find().sort({ createdAt: -1 }).limit(6).lean(),
      ]);

      statusAgg.forEach((item) => {
        if (item._id) statusCounts[item._id] = item.count;
      });

      trackAgg.forEach((item) => {
        if (item._id) trackCounts[item._id] = item.count;
      });

      stateAgg.forEach((item) => {
        if (item._id) stateCounts[item._id] = item.count;
      });

      recentRegistrations = regList.map((r: any) => ({
        ...r,
        _id: r._id.toString(),
      }));

      recentAudits = audits.map((a: any) => ({
        ...a,
        _id: a._id.toString(),
      }));

      // Compute hardware & institution logistics
      const allRegs = await Registration.find().select("requirements projectStage collegeName").lean();
      allRegs.forEach((r: any) => {
        if (r.requirements?.powerOutlet) hardwareStats.powerNeeded++;
        if (r.requirements?.wifi) hardwareStats.wifiNeeded++;
        if (r.projectStage === "Completed PCB / Tested Prototype") hardwareStats.pcbCount++;
        else if (r.projectStage === "Working Breadboard Prototype") hardwareStats.breadboardCount++;
        else hardwareStats.prototypeCount++;

        const isInternal = (r.collegeName || "").toLowerCase().includes("saveetha") || (r.collegeName || "").toLowerCase().includes("sse");
        if (isInternal) institutionStats.internalCount++;
        else institutionStats.externalCount++;
      });
    } catch (error) {
      console.error("Dashboard stats aggregation error:", error);
    }
  }

  return (
    <DashboardClient
      settings={settings}
      totalRegistrations={totalRegistrations}
      statusCounts={statusCounts}
      trackCounts={trackCounts}
      stateCounts={stateCounts}
      recentRegistrations={recentRegistrations}
      recentAudits={recentAudits}
      hardwareStats={hardwareStats}
      institutionStats={institutionStats}
    />
  );
}
