"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Building,
  Cpu,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CircuitBackground } from "@/components/ui/CircuitBackground";

const STORAGE_KEY = "simats_expothon_draft_v1";

const DEFAULT_FORM_DATA = {
  teamName: "",
  collegeName: "",
  department: "",
  city: "",
  state: "",
  yearOfStudy: "3rd Year B.E. / B.Tech",
  leadMember: {
    name: "",
    email: "",
    phone: "",
    rollNo: "",
    gender: "",
    isLead: true,
  },
  teamMembers: [
    {
      name: "",
      email: "",
      phone: "",
      rollNo: "",
      gender: "",
      isLead: false,
    },
  ],
  projectTitle: "",
  trackId: "Smart Healthcare & Telemetry",
  abstractText: "",
  hardwareComponents: ["ESP32-S3", "DHT22 Sensor"],
  projectStage: "Working Hardware Prototype",
  demoUrl: "",
  requirements: {
    powerOutlet: true,
    wifi: true,
    specialEquipment: "",
  },
  mentorDetails: {
    name: "",
    designation: "",
    email: "",
    phone: "",
  },
  abstractFileUrl: "",
  posterFileUrl: "",
  declarationAgreed: false,
  honeypot: "",
  customFieldAnswers: {} as Record<string, any>,
};

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const initialTrack = searchParams.get("track");

  const [settings, setSettings] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [hardwareInput, setHardwareInput] = useState("");
  const [abstractFileName, setAbstractFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((e) => console.error("Could not fetch registration settings", e));
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          trackId: initialTrack || parsed.trackId || prev.trackId,
        }));
      } else if (initialTrack) {
        setFormData((prev) => ({ ...prev, trackId: initialTrack }));
      }
    } catch (e) {
      console.error("Autosave load error", e);
    }
  }, [initialTrack]);

  useEffect(() => {
    if (!submittedId) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {}
    }
  }, [formData, submittedId]);

  const maxMembersAllowed = settings?.maxTeamSize ? settings.maxTeamSize - 1 : 3;

  const addTeamMember = () => {
    if (formData.teamMembers.length >= maxMembersAllowed) return;
    setFormData({
      ...formData,
      teamMembers: [
        ...formData.teamMembers,
        { name: "", email: "", phone: "", rollNo: "", gender: "", isLead: false },
      ],
    });
  };

  const removeTeamMember = (index: number) => {
    if (formData.teamMembers.length <= 1) return;
    const updated = formData.teamMembers.filter((_, idx) => idx !== index);
    setFormData({ ...formData, teamMembers: updated });
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...formData.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, teamMembers: updated });
  };

  const addHardwareComponent = () => {
    if (!hardwareInput.trim()) return;
    if (!formData.hardwareComponents.includes(hardwareInput.trim())) {
      setFormData({
        ...formData,
        hardwareComponents: [...formData.hardwareComponents, hardwareInput.trim()],
      });
    }
    setHardwareInput("");
  };

  const removeHardwareComponent = (name: string) => {
    setFormData({
      ...formData,
      hardwareComponents: formData.hardwareComponents.filter((c) => c !== name),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("Abstract file must be a valid PDF document");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Abstract PDF size must be under 8MB");
      return;
    }

    setAbstractFileName(file.name);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        abstractFileUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!formData.teamName.trim() || formData.teamName.length < 3) {
        setErrorMessage("Please enter a valid team name (at least 3 characters).");
        return false;
      }
      if (!formData.collegeName.trim() || formData.collegeName.length < 3) {
        setErrorMessage("Please enter your College / University name.");
        return false;
      }
      if (!formData.department.trim()) {
        setErrorMessage("Please enter your department.");
        return false;
      }
      if (!formData.city.trim() || !formData.state.trim()) {
        setErrorMessage("Please provide your city and state.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.leadMember.name || !formData.leadMember.email || !formData.leadMember.phone) {
        setErrorMessage("Please fill all required Team Lead details (Name, Email, Phone).");
        return false;
      }
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const m = formData.teamMembers[i];
        if (!m.name || !m.email || !m.phone) {
          setErrorMessage(`Please complete all details for Team Member #${i + 2}.`);
          return false;
        }
      }
    } else if (step === 3) {
      if (!formData.projectTitle || formData.projectTitle.length < 5) {
        setErrorMessage("Project Title must be at least 5 characters long.");
        return false;
      }
      if (!formData.abstractText || formData.abstractText.length < 50) {
        setErrorMessage("Abstract must be at least 50 characters describing your project.");
        return false;
      }
      if (formData.hardwareComponents.length === 0) {
        setErrorMessage("Please add at least one hardware component/board used.");
        return false;
      }
    } else if (step === 6) {
      if (!formData.abstractFileUrl) {
        setErrorMessage("Please upload your Project Abstract PDF file.");
        return false;
      }
    } else if (step === 7) {
      if (!formData.declarationAgreed) {
        setErrorMessage("You must accept the participation declaration to submit.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(7, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrorMessage("");
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Submission failed. Please check your inputs.");
      } else {
        setSubmittedId(data.registrationId);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      setErrorMessage("Network error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRegistrationId = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedId) {
    return (
      <div className="py-20 border-b border-border bg-background min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-lg border border-border bg-card shadow-lg text-center space-y-6 relative overflow-hidden">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="tech" size="sm" className="bg-primary/10 text-primary border-primary/20">
                [SUBMISSION CONFIRMED]
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Registration Successfully Recorded
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                Department of ECE • IoT Lab CoE • Saveetha School of Engineering
              </p>
            </div>

            <div className="p-6 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 space-y-3">
              <span className="text-xs font-mono uppercase text-muted-foreground block">
                Official Registration Identification ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-4xl font-black font-mono tracking-wider text-primary">
                  {submittedId}
                </span>
                <button
                  type="button"
                  onClick={copyRegistrationId}
                  className="p-2 rounded bg-background border border-border text-foreground hover:bg-muted transition-colors"
                  title="Copy Registration ID"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground">
                Save this ID. You will need it along with your Team Lead email to check your shortlisting and booth status.
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground text-left font-mono border-t border-border pt-4">
              <div><strong>Team Name:</strong> {formData.teamName}</div>
              <div><strong>Project Title:</strong> {formData.projectTitle}</div>
              <div><strong>Lead Email:</strong> {formData.leadMember.email}</div>
              <div><strong>Track:</strong> {formData.trackId}</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href={`/registration-status?id=${submittedId}&email=${encodeURIComponent(formData.leadMember.email)}`}>
                <Button className="gap-2 font-mono text-xs">
                  <span>View Submission Status Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="font-mono text-xs">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (settings && !settings.registrationOpen) {
    return (
      <div className="p-8 sm:p-12 rounded-lg border border-border bg-card text-center space-y-4 max-w-2xl mx-auto shadow-md">
        <Badge variant="outline" size="sm" className="text-amber-500 border-amber-500/30 bg-amber-500/10">
          REGISTRATIONS CURRENTLY PAUSED
        </Badge>
        <h2 className="text-2xl font-bold text-foreground">
          Online Submissions Closed
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
          The online registration portal for Expothon 2026 has been paused by the organizing committee. For inquiries or waitlist assistance, please contact the coordinator desk.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link href="/contact">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              Contact Coordinators
            </Button>
          </Link>
          <Link href="/registration-status">
            <Button variant="primary" size="sm" className="font-mono text-xs">
              Check Existing Status
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Fee & Instructions Banner from Settings */}
      {(settings?.registrationFormConfig?.customInstructions || settings?.registrationFormConfig?.registrationFeeNote) && (
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-xs font-mono space-y-1.5 shadow-xs">
          {settings.registrationFormConfig.registrationFeeNote && (
            <div className="flex items-center gap-2 font-bold text-primary">
              <Zap className="h-4 w-4 flex-shrink-0" />
              <span>{settings.registrationFormConfig.registrationFeeNote}</span>
            </div>
          )}
          {settings.registrationFormConfig.customInstructions && (
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {settings.registrationFormConfig.customInstructions}
            </p>
          )}
        </div>
      )}

      {/* Step Progress Pills */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[10px] font-mono">
        {[
          "1. Team",
          "2. Members",
          "3. Project",
          "4. Space",
          "5. Mentor",
          "6. Upload",
          "7. Review",
        ].map((label, idx) => {
          const stepNum = idx + 1;
          const isCurrent = step === stepNum;
          const isDone = step > stepNum;

          return (
            <div
              key={label}
              className={`py-2 px-1 rounded border transition-colors truncate ${
                isCurrent
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                  : isDone
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-semibold"
                  : "border-border bg-card/40 text-muted-foreground"
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">S{stepNum}</span>
            </div>
          );
        })}
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded border border-red-800/40 bg-red-950/20 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-lg border border-border bg-card shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 1: Team & College Information
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Enter official institution and team credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-muted-foreground">TEAM NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g. EdgeNodes Saveetha"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-semibold"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono text-muted-foreground">COLLEGE / INSTITUTION NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  placeholder="e.g. Saveetha School of Engineering, SIMATS"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">DEPARTMENT *</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Electronics and Communication Engineering (ECE)"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">YEAR OF STUDY *</label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                >
                  <option value="1st Year B.E. / B.Tech">1st Year B.E. / B.Tech</option>
                  <option value="2nd Year B.E. / B.Tech">2nd Year B.E. / B.Tech</option>
                  <option value="3rd Year B.E. / B.Tech">3rd Year B.E. / B.Tech</option>
                  <option value="4th Year B.E. / B.Tech">4th Year B.E. / B.Tech</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                  <option value="Postgraduate (M.E. / M.Tech)">Postgraduate (M.E. / M.Tech)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">CITY *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Chennai"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">STATE *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 2: Team Lead & Members
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Minimum 2 members, maximum 4 members. Team Lead is the primary contact.
              </p>
            </div>

            <div className="p-4 rounded border border-primary/40 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary font-mono flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>TEAM LEAD (PRIMARY APPLICANT)</span>
                </span>
                <Badge variant="tech" size="sm">LEAD</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.leadMember.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadMember: { ...formData.leadMember, name: e.target.value },
                      })
                    }
                    placeholder="e.g. Kishore Kumar"
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={formData.leadMember.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadMember: { ...formData.leadMember, email: e.target.value },
                      })
                    }
                    placeholder="kishore@college.edu"
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    value={formData.leadMember.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadMember: { ...formData.leadMember, phone: e.target.value },
                      })
                    }
                    placeholder="+91 9876543210"
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">ROLL / REG NO.</label>
                  <input
                    type="text"
                    value={formData.leadMember.rollNo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadMember: { ...formData.leadMember, rollNo: e.target.value },
                      })
                    }
                    placeholder="e.g. 191801045"
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-foreground">
                  Additional Team Members ({formData.teamMembers.length})
                </span>
                {formData.teamMembers.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                    className="gap-1.5 font-mono text-[11px] h-7"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Member</span>
                  </Button>
                )}
              </div>

              {formData.teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded border border-border bg-muted/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-muted-foreground">
                      MEMBER #{idx + 2}
                    </span>
                    {formData.teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(idx)}
                        className="text-red-500 hover:text-red-400 font-mono text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => updateMember(idx, "name", e.target.value)}
                        placeholder="Member full name"
                        className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={member.email}
                        onChange={(e) => updateMember(idx, "email", e.target.value)}
                        placeholder="member@college.edu"
                        className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        value={member.phone}
                        onChange={(e) => updateMember(idx, "phone", e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground">ROLL / REG NO.</label>
                      <input
                        type="text"
                        value={member.rollNo || ""}
                        onChange={(e) => updateMember(idx, "rollNo", e.target.value)}
                        placeholder="e.g. 191801046"
                        className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 3: Project Architecture & Abstract
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Detail your IoT hardware, problem statement, and firmware architecture.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="e.g. LoRaWAN-Based Precision Soil Nitrate Monitoring Node"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-muted-foreground">THEMATIC TRACK *</label>
                  <select
                    value={formData.trackId}
                    onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                  >
                    <option value="Smart Healthcare & Telemetry">Track 01: Smart Healthcare & Telemetry</option>
                    <option value="Edge AI & Autonomous Systems">Track 02: Edge AI & Autonomous Systems</option>
                    <option value="Smart Agriculture & Environment">Track 03: Smart Agriculture & Environment</option>
                    <option value="Industrial IoT & Smart Infrastructure">Track 04: Industrial IoT & Smart Infrastructure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-muted-foreground">DEVELOPMENT STAGE *</label>
                  <select
                    value={formData.projectStage}
                    onChange={(e) => setFormData({ ...formData, projectStage: e.target.value })}
                    className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                  >
                    <option value="Working Hardware Prototype">Working Hardware Prototype (Bench Tested)</option>
                    <option value="Prototype Under Final Assembly">Prototype Under Final Assembly</option>
                    <option value="Proof of Concept / Lab Simulation">Proof of Concept / Lab Simulation</option>
                    <option value="Field Deployed / Pilot Tested">Field Deployed / Pilot Tested</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-muted-foreground">PROJECT ABSTRACT *</label>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {formData.abstractText.length} / 3000 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={formData.abstractText}
                  onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                  placeholder="Describe the problem, proposed embedded IoT architecture, sensor interfaces, wireless protocols, and expected outcomes..."
                  className="w-full p-3 rounded border border-border bg-background text-foreground leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">HARDWARE BOARDS / SENSORS USED *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hardwareInput}
                    onChange={(e) => setHardwareInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addHardwareComponent();
                      }
                    }}
                    placeholder="e.g. STM32 Nucleo, LoRa SX1276, NPK Sensor..."
                    className="flex-1 h-9 px-3 rounded border border-border bg-background text-foreground font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHardwareComponent}
                    className="font-mono text-xs"
                  >
                    Add Tag
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {formData.hardwareComponents.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted text-foreground border border-border font-mono text-[11px]"
                    >
                      <span>{comp}</span>
                      <button
                        type="button"
                        onClick={() => removeHardwareComponent(comp)}
                        className="text-muted-foreground hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">VIDEO DEMO OR GITHUB REPO URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={formData.demoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://youtube.com/... or https://github.com/..."
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 4: Bench & Power Requirements
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Specify utilities required for your exhibition booth at Saveetha IoT CoE.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded border border-border bg-muted/20 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requirements.powerOutlet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          powerOutlet: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded text-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">
                      230V AC Single Phase Power Socket
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Required for oscilloscopes, soldering stations, or power adapters.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-border/50">
                  <input
                    type="checkbox"
                    checked={formData.requirements.wifi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          wifi: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded text-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">
                      Campus Wi-Fi Internet Access
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      For MQTT cloud telemetry or remote dashboard live feed.
                    </span>
                  </div>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">
                  SPECIAL BENCH OR SAFETY EQUIPMENT REQUIREMENTS (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements.specialEquipment || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requirements: {
                        ...formData.requirements,
                        specialEquipment: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Floor space for rover, water container for agricultural node, etc."
                  className="w-full p-3 rounded border border-border bg-background text-foreground resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 5: Faculty Mentor / Guide Details
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Optional. Provide if your project is guided under an academic advisor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">MENTOR FULL NAME</label>
                <input
                  type="text"
                  value={formData.mentorDetails.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorDetails: { ...formData.mentorDetails, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Dr. S. Anitha"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">DESIGNATION / DEPARTMENT</label>
                <input
                  type="text"
                  value={formData.mentorDetails.designation || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorDetails: {
                        ...formData.mentorDetails,
                        designation: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Associate Professor, ECE"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">MENTOR INSTITUTIONAL EMAIL</label>
                <input
                  type="email"
                  value={formData.mentorDetails.email || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorDetails: { ...formData.mentorDetails, email: e.target.value },
                    })
                  }
                  placeholder="guide@college.edu"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-muted-foreground">MENTOR PHONE</label>
                <input
                  type="tel"
                  value={formData.mentorDetails.phone || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorDetails: { ...formData.mentorDetails, phone: e.target.value },
                    })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full h-9 px-3 rounded border border-border bg-background text-foreground font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 6: Abstract PDF Document Upload
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Upload your comprehensive project abstract or block schematic (PDF format, max 8MB).
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-8 rounded-lg border-2 border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center text-center space-y-3 blueprint-grid">
                <div className="h-12 w-12 rounded bg-background border border-border flex items-center justify-center text-primary shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-foreground block font-mono">
                    {abstractFileName || "Upload Project Abstract (PDF)"}
                  </span>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Includes circuit diagram, methodology, and component bill of materials.
                  </p>
                </div>

                <label className="cursor-pointer pt-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" size="sm" className="pointer-events-none gap-2 font-mono text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{formData.abstractFileUrl ? "Replace PDF Document" : "Select PDF File"}</span>
                  </Button>
                </label>
              </div>

              {formData.abstractFileUrl && (
                <div className="p-3 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs flex items-center justify-between font-mono">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>PDF Abstract Attached ({abstractFileName || "abstract.pdf"})</span>
                  </span>
                  <Badge variant="success" size="sm">READY</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground font-mono">
                Step 7: Verification & Declaration
              </h2>
              <p className="text-muted-foreground text-[11px] font-mono">
                Review your submission summary and submit your project to the jury queue.
              </p>
            </div>

            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                tabIndex={-1}
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                autoComplete="off"
              />
            </div>

            <div className="p-4 rounded border border-border bg-muted/20 space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between border-b border-border/50 pb-1.5">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-bold text-foreground">{formData.teamName} ({1 + formData.teamMembers.length} Members)</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1.5">
                <span className="text-muted-foreground">College:</span>
                <span className="font-semibold text-foreground truncate max-w-xs">{formData.collegeName}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1.5">
                <span className="text-muted-foreground">Lead:</span>
                <span className="text-foreground">{formData.leadMember.name} &lt;{formData.leadMember.email}&gt;</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1.5">
                <span className="text-muted-foreground">Track:</span>
                <span className="text-primary font-semibold">{formData.trackId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="text-foreground font-semibold truncate max-w-xs">{formData.projectTitle}</span>
              </div>
            </div>

            <div className="p-4 rounded border border-border bg-card space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declarationAgreed}
                  onChange={(e) =>
                    setFormData({ ...formData, declarationAgreed: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-primary mt-0.5"
                />
                <div className="space-y-1">
                  <span className="font-semibold text-foreground block">
                    Institutional Declaration & Academic Honesty
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    We declare that the submitted project is an original technical prototype developed by our team. We agree to abide by the rules of Expothon 2026, adhere to lab safety protocols, and accept the final decision of the jury panel.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={prevStep}
              className="gap-1.5 font-mono text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous Step</span>
            </Button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <Button
              type="button"
              size="sm"
              onClick={nextStep}
              className="gap-1.5 font-mono text-xs"
            >
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              size="sm"
              className="gap-1.5 font-semibold font-mono text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <span>Submit Final Registration</span>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="py-12 md:py-20 border-b border-border bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2">
            <Badge variant="tech" size="sm">
              [EXPOTHON 2026]
            </Badge>
            <Badge variant="outline" size="sm">
              ONLINE REGISTRATION WIZARD
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Expothon Project Registration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            IoT Lab Centre of Excellence • Saveetha School of Engineering, SIMATS
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center font-mono text-xs">Loading registration wizard...</div>}>
          <RegisterFormContent />
        </Suspense>
      </div>
    </div>
  );
}
