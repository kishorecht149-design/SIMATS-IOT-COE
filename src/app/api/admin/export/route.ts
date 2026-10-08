import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import connectToDatabase from "@/lib/db/mongodb";
import Registration from "@/models/Registration";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "REGISTRATION_MANAGER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "xlsx";
  const status = searchParams.get("status") || "";
  const track = searchParams.get("track") || "";

  await connectToDatabase();

  const query: any = {};
  if (status && status !== "all") query.status = status;
  if (track && track !== "all") query.trackId = track;

  const registrations = await Registration.find(query).sort({ createdAt: -1 }).lean();

  const exportRows = registrations.map((r: any) => ({
    "Registration ID": r.registrationId,
    "Status": r.status,
    "Team Name": r.teamName,
    "College Name": r.collegeName,
    "Department": r.department,
    "Year of Study": r.yearOfStudy,
    "City": r.city,
    "State": r.state,
    "Lead Name": r.leadMember?.name || "",
    "Lead Email": r.leadMember?.email || "",
    "Lead Phone": r.leadMember?.phone || "",
    "Lead Roll No": r.leadMember?.rollNo || "",
    "Total Members": 1 + (r.teamMembers?.length || 0),
    "Member 2": r.teamMembers?.[0]?.name ? `${r.teamMembers[0].name} (${r.teamMembers[0].email})` : "",
    "Member 3": r.teamMembers?.[1]?.name ? `${r.teamMembers[1].name} (${r.teamMembers[1].email})` : "",
    "Member 4": r.teamMembers?.[2]?.name ? `${r.teamMembers[2].name} (${r.teamMembers[2].email})` : "",
    "Project Title": r.projectTitle,
    "Track": r.trackId,
    "Project Stage": r.projectStage,
    "Hardware Components": (r.hardwareComponents || []).join(", "),
    "Power Outlet Needed": r.requirements?.powerOutlet ? "YES" : "NO",
    "Wi-Fi Needed": r.requirements?.wifi ? "YES" : "NO",
    "Special Equipment": r.requirements?.specialEquipment || "",
    "Mentor Name": r.mentorDetails?.name || "",
    "Mentor Email": r.mentorDetails?.email || "",
    "Checked In": r.checkedIn ? "YES" : "NO",
    "Submitted Date": r.createdAt ? new Date(r.createdAt).toISOString() : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expothon_Registrations");

  if (format === "csv") {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="expothon_registrations_${Date.now()}.csv"`,
      },
    });
  }

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="expothon_registrations_${Date.now()}.xlsx"`,
    },
  });
}
