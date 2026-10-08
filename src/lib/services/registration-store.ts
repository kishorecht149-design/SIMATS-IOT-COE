// In-memory registration fallback store with realistic sample teams for offline mode
export interface MemoryRegistration {
  _id: string;
  registrationId: string;
  teamName: string;
  collegeName: string;
  department: string;
  city: string;
  state: string;
  yearOfStudy: string;
  leadMember: {
    name: string;
    email: string;
    phone: string;
    registerNumber: string;
  };
  teamMembers: Array<{
    name: string;
    email: string;
    phone: string;
    registerNumber: string;
    department: string;
  }>;
  projectTitle: string;
  trackId: string;
  abstractText: string;
  hardwareComponents: string;
  projectStage: string;
  demoUrl?: string;
  requirements: {
    powerSupply: boolean;
    oscilloscope: boolean;
    wifiAccess: boolean;
    solderingStation: boolean;
    additionalNotes?: string;
  };
  mentorDetails?: {
    name: string;
    designation: string;
    email: string;
  };
  abstractFileUrl?: string;
  status: "Submitted" | "Shortlisted" | "Approved" | "Waitlisted" | "Rejected";
  score?: number;
  allocatedBench?: string;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_REGISTRATIONS: MemoryRegistration[] = [
  {
    _id: "reg-mem-001",
    registrationId: "EXP-2026-1042",
    teamName: "BioSense Innovators",
    collegeName: "Saveetha School of Engineering, SIMATS",
    department: "Electronics and Communication Engineering",
    city: "Chennai",
    state: "Tamil Nadu",
    yearOfStudy: "3rd Year",
    leadMember: {
      name: "Aravind Kumar",
      email: "aravind.k@saveetha.simats.edu",
      phone: "+91 98401 23456",
      registerNumber: "192011042",
    },
    teamMembers: [
      {
        name: "Pooja Ramesh",
        email: "pooja.r@saveetha.simats.edu",
        phone: "+91 98401 23457",
        registerNumber: "192011088",
        department: "ECE",
      },
      {
        name: "Sanjay Raj",
        email: "sanjay.r@saveetha.simats.edu",
        phone: "+91 98401 23458",
        registerNumber: "192011112",
        department: "ECE",
      },
    ],
    projectTitle: "Low-Power Wearable Multi-Parametric Patient Telemetry Node",
    trackId: "track-1",
    abstractText: "A wearable bio-signal telemetry node implementing BLE and ESP-NOW protocols for ultra-low latency continuous ECG and SpO2 vital signs telemetry with fail-safe local SD logging.",
    hardwareComponents: "ESP32-S3-WROOM, MAX30102 PPG sensor, AD8232 ECG analog front-end, LiPo 3.7V 1200mAh, TP4056 BMS",
    projectStage: "Working Prototype",
    requirements: {
      powerSupply: true,
      oscilloscope: true,
      wifiAccess: true,
      solderingStation: false,
    },
    mentorDetails: {
      name: "Dr. S. Karthikeyan",
      designation: "Associate Professor, Dept of ECE",
      email: "karthikeyan.ece@saveetha.com",
    },
    status: "Shortlisted",
    score: 88,
    allocatedBench: "BENCH-A04 (Zone A - Healthcare)",
    adminRemarks: "Abstract approved. Hardware verified for low-noise bio-potential acquisition.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    _id: "reg-mem-002",
    registrationId: "EXP-2026-1077",
    teamName: "EdgeVision Labs",
    collegeName: "Anna University (CEG Campus)",
    department: "Electronics Engineering",
    city: "Chennai",
    state: "Tamil Nadu",
    yearOfStudy: "4th Year",
    leadMember: {
      name: "Kavitha Sundaram",
      email: "kavitha.s@ceg.annauniv.edu",
      phone: "+91 97910 88776",
      registerNumber: "2020205012",
    },
    teamMembers: [
      {
        name: "Dinesh Varman",
        email: "dinesh.v@ceg.annauniv.edu",
        phone: "+91 97910 88777",
        registerNumber: "2020205019",
        department: "ECE",
      },
    ],
    projectTitle: "Quantized TinyML Edge Camera for Industrial Anomaly Detection",
    trackId: "track-2",
    abstractText: "Deploying an 8-bit quantized MobileNet convolutional neural network directly on an ESP32-S3 dual-core microcontroller running FreeRTOS for sub-80ms real-time surface defect detection on conveyor belts.",
    hardwareComponents: "ESP32-S3 Cam (8MB PSRAM), OV2640 Camera module, I2C 0.96 OLED, Relay driver board",
    projectStage: "Field Tested Prototype",
    requirements: {
      powerSupply: true,
      oscilloscope: false,
      wifiAccess: true,
      solderingStation: false,
    },
    status: "Submitted",
    score: 92,
    allocatedBench: "BENCH-B02 (Zone B - Edge AI)",
    adminRemarks: "Excellent TinyML model quantization benchmarks.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: "reg-mem-003",
    registrationId: "EXP-2026-1120",
    teamName: "AgriLoRa Networks",
    collegeName: "PSG College of Technology",
    department: "Robotics & Automation",
    city: "Coimbatore",
    state: "Tamil Nadu",
    yearOfStudy: "3rd Year",
    leadMember: {
      name: "Manoj Prabhakar",
      email: "manoj.p@psgtech.ac.in",
      phone: "+91 94432 11998",
      registerNumber: "21R104",
    },
    teamMembers: [
      {
        name: "Vigneshwaran K",
        email: "vignesh.k@psgtech.ac.in",
        phone: "+91 94432 11999",
        registerNumber: "21R156",
        department: "Robotics",
      },
    ],
    projectTitle: "Solar-Powered LoRaWAN Soil Telemetry & Precision Drip Grid",
    trackId: "track-3",
    abstractText: "Long-range LoRaWAN 868MHz sensor node measuring capacitive soil moisture, soil EC, and NPK parameters, communicating over 4.2km range to a local SX1302 ChirpStack gateway node.",
    hardwareComponents: "STM32L051 ultra-low power MCU, SX1276 LoRa transceiver, RS485 NPK Sensor, 6V 3W Solar Panel, BQ25504 MPPT Harvester",
    projectStage: "Field Tested Prototype",
    requirements: {
      powerSupply: true,
      oscilloscope: true,
      wifiAccess: true,
      solderingStation: true,
    },
    status: "Shortlisted",
    score: 85,
    allocatedBench: "BENCH-C01 (Zone C - AgriTech)",
    adminRemarks: "Outdoor transmission verified at 868 MHz band.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var memoryRegistrations: MemoryRegistration[] | undefined;
}

if (!global.memoryRegistrations) {
  global.memoryRegistrations = [...DEFAULT_REGISTRATIONS];
}

export function getMemoryRegistrations(): MemoryRegistration[] {
  return global.memoryRegistrations || DEFAULT_REGISTRATIONS;
}

export function addMemoryRegistration(reg: Omit<MemoryRegistration, "_id" | "createdAt" | "updatedAt">): MemoryRegistration {
  const newReg: MemoryRegistration = {
    ...reg,
    _id: `reg-mem-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  global.memoryRegistrations = [newReg, ...(global.memoryRegistrations || [])];
  return newReg;
}

export function updateMemoryRegistration(id: string, updates: Partial<MemoryRegistration>): MemoryRegistration | null {
  if (!global.memoryRegistrations) global.memoryRegistrations = [...DEFAULT_REGISTRATIONS];
  const idx = global.memoryRegistrations.findIndex((r) => r._id === id || r.registrationId === id);
  if (idx === -1) return null;

  global.memoryRegistrations[idx] = {
    ...global.memoryRegistrations[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return global.memoryRegistrations[idx];
}

export function deleteMemoryRegistration(id: string): boolean {
  if (!global.memoryRegistrations) return false;
  const initialLen = global.memoryRegistrations.length;
  global.memoryRegistrations = global.memoryRegistrations.filter((r) => r._id !== id && r.registrationId !== id);
  return global.memoryRegistrations.length < initialLen;
}
