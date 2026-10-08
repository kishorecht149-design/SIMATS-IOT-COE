export type SectionType =
  | "hero"
  | "stats_strip"
  | "text_image"
  | "tracks_grid"
  | "timeline"
  | "card_grid"
  | "judging_criteria"
  | "awards_prizes"
  | "faq_accordion"
  | "downloads"
  | "team_grid"
  | "contact_strip"
  | "rich_text"
  | "schedule_agenda"
  | "speakers_grid"
  | "sponsors_grid"
  | "venue_floorplan"
  | "registration_stages"
  | "workshops_list"
  | "event_announcement";

export interface SectionDefinition {
  type: SectionType;
  label: string;
  description: string;
  defaultData: Record<string, any>;
}

export const SECTION_REGISTRY: Record<SectionType, SectionDefinition> = {
  event_announcement: {
    type: "event_announcement",
    label: "Announce New Event / Hackathon",
    description: "High-visibility announcement card for new workshops, upcoming hackathons, or flash symposiums.",
    defaultData: {
      badge: "UPCOMING NATIONAL HACKATHON",
      title: "National TinyML & Edge AI Hackathon 2026",
      subtitle: "36-Hour Continuous Embedded Innovation Sprint",
      description: "Organized by IoT Lab Centre of Excellence, Department of ECE. Open to engineering students across India to develop low-power edge intelligence firmware.",
      eventDate: "December 12 - 13, 2026",
      venue: "IoT Lab CoE, Saveetha School of Engineering",
      prizePool: "₹1,00,000 Cash Pool + Certificates",
      eligibility: "UG/PG Engineering Students (2 to 4 per team)",
      highlights: [
        "36-Hour Non-stop Hardware Prototyping Hackathon",
        "Pre-configured ESP32-S3 & LoRa hardware development kits provided",
        "Live mentorship from semiconductor firmware architects",
        "Cash prizes and direct incubation pathway for top 3 teams",
      ],
      primaryCtaLabel: "Register for Hackathon",
      primaryCtaHref: "/register",
      secondaryCtaLabel: "Download Circular",
      secondaryCtaHref: "/downloads",
      coordinatorInfo: "Contact: iotcoe.ece@saveetha.com | +91 44 2680 1999",
      urgentBannerText: "FLASH CALL: Early Bird Registration Closes Soon!",
    },
  },
  hero: {
    type: "hero",
    label: "Hero Header",
    description: "Main header with headline, event badges, countdown, and primary action buttons.",
    defaultData: {
      badge: "SAVEETHA ECE • IoT COE",
      title: "Expothon 2026",
      subtitle: "National-Level IoT & Embedded Systems Project Exhibition",
      description: "Organized by IoT Lab Centre of Excellence, Department of Electronics & Communication Engineering, Saveetha School of Engineering, SIMATS.",
      primaryCtaLabel: "Register Project",
      primaryCtaHref: "/register",
      secondaryCtaLabel: "Event Details",
      secondaryCtaHref: "/expothon",
      showCircuitBg: true,
      showStatusBadge: true,
    },
  },
  stats_strip: {
    type: "stats_strip",
    label: "Statistics Strip",
    description: "Real-time numbers queried from the database or verified institutional facts.",
    defaultData: {
      title: "Event & Laboratory Overview",
      showLiveRegistrations: true,
      stats: [
        { label: "Innovation Tracks", value: "04", helper: "Healthcare, Edge AI, Agri-Tech, Industrial" },
        { label: "Workstations", value: "60", helper: "Equipped Testing Benches" },
        { label: "Hardware Prototype", value: "Required", helper: "Physical Demo Mandate" },
      ],
    },
  },
  schedule_agenda: {
    type: "schedule_agenda",
    label: "Hourly Agenda & Stage Timings",
    description: "Detailed hourly timeline of day-of-event schedule, jury rounds, and ceremony.",
    defaultData: {
      badge: "DAY SCHEDULE",
      title: "Day-of-Event Detailed Agenda",
      subtitle: "Hourly itinerary for participants and jury members",
      dateLabel: "November 04, 2026",
      items: [
        {
          time: "08:30 AM - 09:30 AM",
          title: "Registration Desk Verification & Kit Distribution",
          location: "IoT Lab CoE Entrance, 3rd Floor",
          speaker: "Registration Desk Committee",
          badge: "CHECK-IN",
          description: "Reporting of participants, badge verification, Wi-Fi credential allotment, and bench allocation.",
        },
        {
          time: "09:30 AM - 10:15 AM",
          title: "Inaugural Ceremony & Keynote Address",
          location: "ECE Seminar Hall",
          speaker: "Head of Department & Guest of Honour",
          badge: "CEREMONY",
          description: "Formal inauguration, lighting of lamp, and introductory remarks on emerging embedded IoT systems.",
        },
        {
          time: "10:30 AM - 01:00 PM",
          title: "Evaluation Round 1: Architecture & Hardware Demonstration",
          location: "IoT Lab Workstations (Zones A, B, C, D)",
          speaker: "Track Jury Panels",
          badge: "JURY ROUND 1",
          description: "Rigorous technical inspection of schematics, PCB assembly, sensor data telemetry, and power efficiency.",
        },
        {
          time: "01:00 PM - 02:00 PM",
          title: "Lunch Break & Peer Project Networking",
          location: "Dining Hall",
          badge: "NETWORKING",
          description: "Complimentary lunch provided for all verified registered student teams and faculty guides.",
        },
        {
          time: "02:00 PM - 03:45 PM",
          title: "Evaluation Round 2: Stress Testing & Technical Q&A",
          location: "IoT Lab Workstations",
          speaker: "Industry Jury Experts",
          badge: "JURY ROUND 2",
          description: "Edge case testing, sensor latency measurements, and viva voce with industry evaluators.",
        },
        {
          time: "04:00 PM - 05:00 PM",
          title: "Valedictory Ceremony & Cash Award Distribution",
          location: "Main Auditorium",
          speaker: "Principal & Chief Guest",
          badge: "VALEDICTORY",
          description: "Announcement of track winners, presentation of cash awards, trophies, and participation certificates.",
        },
      ],
    },
  },
  speakers_grid: {
    type: "speakers_grid",
    label: "Keynote Speakers & Jury Panel",
    description: "Showcase guest speakers, industry evaluators, and academic dignitaries.",
    defaultData: {
      badge: "DISTINGUISHED GUESTS",
      title: "Keynote Speakers & Industry Jury Panel",
      subtitle: "Experienced engineers and researchers evaluating Expothon 2026 projects",
      speakers: [
        {
          name: "Dr. Faculty Convenor",
          designation: "Professor & Head, IoT Lab CoE",
          organization: "Department of ECE, SSE SIMATS",
          topic: "Next-Generation Low Power Edge Intelligence",
          bio: "Specialist in embedded microcontrollers, edge TinyML acceleration, and low-power RF mesh networks.",
          linkedin: "https://linkedin.com",
          badge: "HOST / CONVENOR",
        },
        {
          name: "Industry Lead Evaluator",
          designation: "Principal Firmware Architect",
          organization: "Industrial IoT Systems Inc.",
          topic: "Real-world Industrial Telemetry & Field Reliability",
          bio: "20+ years designing mission-critical SCADA, Modbus telemetry, and automotive embedded control units.",
          linkedin: "https://linkedin.com",
          badge: "INDUSTRY JURY",
        },
        {
          name: "Edge AI Researcher",
          designation: "Senior Staff AI Engineer",
          organization: "Edge Silicon Labs",
          topic: "TinyML Deployment on Heterogeneous Microcontrollers",
          bio: "Author of multiple IEEE papers on neural network quantization for ultra-low power RISC-V platforms.",
          linkedin: "https://linkedin.com",
          badge: "KEYNOTE SPEAKER",
        },
      ],
    },
  },
  sponsors_grid: {
    type: "sponsors_grid",
    label: "Sponsors & Industry Partners",
    description: "Logo grid of technical sponsors, hardware providers, and industry partners.",
    defaultData: {
      badge: "COLLABORATIONS",
      title: "Industry Sponsors & Technical Partners",
      subtitle: "Organizations supporting technological innovation at Saveetha IoT CoE",
      partnerNote: "Hardware development kits and evaluation boards sponsored by leading semiconductor partners.",
      sponsors: [
        {
          name: "SIMATS Deemed University",
          tier: "Title Sponsor",
          description: "Institutional patron providing state-of-the-art laboratory infrastructure and research funding.",
          websiteUrl: "https://saveetha.com",
        },
        {
          name: "IEEE Student Branch",
          tier: "Technical Partner",
          description: "Technical co-sponsor providing certification standards and publication guidance.",
          websiteUrl: "https://ieee.org",
        },
        {
          name: "Embedded Silicon Partner",
          tier: "Hardware Partner",
          description: "Development board testing partner supporting microcontroller toolchains and firmware kits.",
          websiteUrl: "#",
        },
        {
          name: "IoT Research Alliance",
          tier: "Academic Partner",
          description: "Network of engineering institutions collaborating on wireless sensor node benchmarking.",
          websiteUrl: "#",
        },
      ],
    },
  },
  venue_floorplan: {
    type: "venue_floorplan",
    label: "Venue & Floor Plan Layout",
    description: "Interactive floorplan zones, workstation equipment, and venue navigation.",
    defaultData: {
      badge: "LAB INFRASTRUCTURE",
      title: "Exhibition Venue & Floor Plan",
      subtitle: "Explore laboratory layout and allocated workstation zones",
      venueName: "IoT Lab Centre of Excellence, 3rd Floor, Department of ECE",
      venueAddress: "Saveetha School of Engineering, SIMATS Deemed University, Chennai - 602105",
      zones: [
        {
          zoneCode: "ZONE-A",
          name: "Smart Healthcare & Telemetry",
          description: "Equipped with isolated AC power, DSO oscilloscopes, and bio-signal safety test mats.",
          facilities: ["Isolated AC Supply", "Digital Oscilloscopes", "Grounding Mats"],
        },
        {
          zoneCode: "ZONE-B",
          name: "Edge AI & Autonomous Systems",
          description: "High-bandwidth Wi-Fi zone with dedicated 5V/12V regulated DC supplies for compute modules.",
          facilities: ["Dedicated 5GHz Wi-Fi", "Regulated DC Power", "Camera Mounts"],
        },
        {
          zoneCode: "ZONE-C",
          name: "Smart Agriculture & Environment",
          description: "Testbeds for LoRaWAN gateways, soil parameter rigs, and outdoor antenna test jacks.",
          facilities: ["LoRa Gateway", "Sensor Test Rig", "High-Gain Antennas"],
        },
        {
          zoneCode: "ZONE-D",
          name: "Industrial IoT & Infrastructure",
          description: "Heavy-duty test benches for Modbus/RS485, PLC telemetry, and power metering hardware.",
          facilities: ["RS485 Bus Analyzers", "3-Phase Power Monitoring", "DIN Rails"],
        },
      ],
      amenities: [
        "60 Fully Equipped Lab Workstations",
        "Dual 230V AC Sockets per Team",
        "High-Speed Campus Wi-Fi (SSID: EXPOTHON-2026)",
        "Soldering & Hardware Rework Bench",
        "Digital Storage Oscilloscopes (DSO)",
        "Emergency First Aid & Safety Extinguishers",
      ],
    },
  },
  registration_stages: {
    type: "registration_stages",
    label: "Registration & Stage Tracker",
    description: "Visual pipeline showing current active registration phase, deadlines, and requirements.",
    defaultData: {
      badge: "SUBMISSION PIPELINE",
      title: "Registration & Evaluation Pipeline",
      subtitle: "Multi-stage selection and demonstration workflow",
      note: "Notice: Hardware verification on November 04, 2026 is mandatory for all registered teams.",
      primaryCtaLabel: "Register Project Online",
      primaryCtaHref: "/register",
      stages: [
        {
          stageNumber: "01",
          title: "Online Registration & Team Details",
          dateRange: "Oct 10 - Oct 28, 2026",
          status: "active",
          description: "Team Leader registers online with member names, register numbers, department, and contact info.",
          actionText: "Register Online",
          actionHref: "/register",
        },
        {
          stageNumber: "02",
          title: "Abstract PDF & Architecture Upload",
          dateRange: "By Oct 28, 2026 (5:00 PM)",
          status: "active",
          description: "Submit 1-page IEEE format project abstract with block diagram, microcontroller selection, and problem statement.",
          actionText: "Submission Guidelines",
          actionHref: "/guidelines",
        },
        {
          stageNumber: "03",
          title: "Technical Review & Shortlist Notice",
          dateRange: "Nov 01, 2026",
          status: "upcoming",
          description: "Faculty review committee screens submissions for originality, hardware feasibility, and track alignment.",
        },
        {
          stageNumber: "04",
          title: "On-Campus Live Demonstration",
          dateRange: "Nov 04, 2026 (9:00 AM - 4:00 PM)",
          status: "upcoming",
          description: "Shortlisted teams assemble at IoT Lab CoE benches for physical prototype demonstration and jury Q&A.",
        },
        {
          stageNumber: "05",
          title: "Jury Scoring & Valedictory Ceremony",
          dateRange: "Nov 04, 2026 (4:00 PM onwards)",
          status: "upcoming",
          description: "Announcement of track winners, cash awards, and distribution of IEEE participation certificates.",
        },
      ],
    },
  },
  workshops_list: {
    type: "workshops_list",
    label: "Technical Workshops & Hands-on Training",
    description: "List of hands-on bootcamps and specialized training sessions conducted during the event.",
    defaultData: {
      badge: "TECHNICAL BOOTCAMPS",
      title: "Technical Workshops & Hands-on Training",
      subtitle: "Hands-on engineering workshops conducted by domain specialists",
      workshops: [
        {
          title: "Hands-on ESP32 & FreeRTOS Real-Time Firmware",
          track: "Track 01 & 04",
          instructor: "Dr. Technical Coordinator",
          instructorDesignation: "IoT Lab CoE, Saveetha School of Engineering",
          date: "November 03, 2026",
          time: "10:00 AM - 1:00 PM",
          location: "IoT Systems Laboratory (Room 304)",
          seats: "40 Seats (Pre-registration required)",
          description: "Learn multi-threaded sensor acquisition, non-blocking MQTT telemetry, and low-power deep sleep cycles using ESP-IDF.",
          prerequisites: "Basic C/C++ knowledge",
          badge: "HANDS-ON LAB",
        },
        {
          title: "TinyML: Deploying Neural Networks on Microcontrollers",
          track: "Track 02",
          instructor: "Industry Expert & Edge AI Specialist",
          instructorDesignation: "Embedded Systems Partner",
          date: "November 03, 2026",
          time: "2:00 PM - 5:00 PM",
          location: "Advanced Computing Lab (Room 308)",
          seats: "40 Seats (Pre-registration required)",
          description: "TensorFlow Lite for Microcontrollers, model quantization, vibration anomaly detection, and vision inference on ESP32-S3.",
          prerequisites: "Python and microcontroller basics",
          badge: "ADVANCED WORKSHOP",
        },
        {
          title: "LoRaWAN & Long-Range Telemetry for Smart Agriculture",
          track: "Track 03",
          instructor: "RF Systems Faculty Specialist",
          instructorDesignation: "Department of ECE, SSE SIMATS",
          date: "November 04, 2026",
          time: "11:30 AM - 1:00 PM",
          location: "RF & Wireless Systems Lab",
          seats: "35 Seats",
          description: "SX1276 transceiver configuration, ChirpStack/The Things Network gateway setup, and long-range environmental telemetry.",
          prerequisites: "Basic sensor interfacing",
          badge: "FIELD TELEMETRY",
        },
      ],
    },
  },
  text_image: {
    type: "text_image",
    label: "Text & Image Block",
    description: "Editorial layout with verified institutional overview and links.",
    defaultData: {
      badge: "ABOUT THE COE",
      title: "IoT Lab Centre of Excellence",
      body: "<p>The IoT Lab Centre of Excellence at Saveetha School of Engineering (SIMATS) provides students with access to industry-standard embedded processors, RF communication analyzers, and sensor measurement testbeds.</p><p>The lab supports technical research in low-power wireless telemetry, edge microcontroller firmware, smart agriculture sensor nodes, and healthcare monitoring systems.</p>",
      imageSlot: "",
      imageAlt: "Saveetha IoT Lab Centre of Excellence",
      imagePosition: "right",
      ctaLabel: "View Lab Facilities",
      ctaHref: "/facilities",
    },
  },
  tracks_grid: {
    type: "tracks_grid",
    label: "Exhibition Tracks Grid",
    description: "Showcase the four official competition tracks with focus topics.",
    defaultData: {
      title: "Expothon Exhibition Tracks",
      subtitle: "Select one track for your project submission",
      tracks: [
        {
          id: "track-1",
          code: "TRACK-01",
          title: "Smart Healthcare & Telemetry",
          description: "Wearable patient monitoring, bio-signal telemetry, hospital IoT automation, and assistive health technology.",
          topics: "Wearable sensors, ECG/PPG telemetry, BLE, Remote patient diagnostics",
        },
        {
          id: "track-2",
          code: "TRACK-02",
          title: "Edge AI & Autonomous Systems",
          description: "Microcontroller-level machine learning (TinyML), computer vision on edge, robotics, and smart rovers.",
          topics: "TinyML, ESP32-CAM, OpenCV, Edge TPU, Autonomous rovers",
        },
        {
          id: "track-3",
          code: "TRACK-03",
          title: "Smart Agriculture & Environment",
          description: "Soil parameter sensing, automated micro-irrigation, weather stations, and environmental telemetry nodes.",
          topics: "LoRaWAN, Soil NPK sensors, Solar IoT nodes, Water telemetry",
        },
        {
          id: "track-4",
          code: "TRACK-04",
          title: "Industrial IoT & Smart Infrastructure",
          description: "Predictive maintenance, SCADA telemetry, smart energy grids, and industrial asset tracking.",
          topics: "Modbus/RS485, MQTT, Vibration analysis, Smart metering",
        },
      ],
    },
  },
  timeline: {
    type: "timeline",
    label: "Timeline / Key Dates",
    description: "Milestones for submission deadlines, shortlisting, and exhibition day.",
    defaultData: {
      title: "Event Milestones & Schedule",
      subtitle: "Important dates for participating teams",
      events: [
        {
          phase: "01",
          title: "Abstract Submission Opens",
          date: "October 10, 2026",
          status: "completed",
          description: "Online submission portal opens for team registration and abstract PDF uploads.",
        },
        {
          phase: "02",
          title: "Abstract Submission Deadline",
          date: "October 28, 2026",
          status: "active",
          description: "Final deadline for all internal and external college project abstracts.",
        },
        {
          phase: "03",
          title: "Shortlist Announcement",
          date: "November 01, 2026",
          status: "upcoming",
          description: "Technical committee announces shortlisted teams for on-campus demonstration.",
        },
        {
          phase: "04",
          title: "Expothon Grand Exhibition & Jury Evaluation",
          date: "November 04, 2026",
          status: "upcoming",
          description: "Live physical prototype demonstration and jury evaluation rounds at SSE SIMATS IoT CoE Lab.",
        },
      ],
    },
  },
  card_grid: {
    type: "card_grid",
    label: "Feature / Card Grid",
    description: "General multi-card grid for rules, facilities, or guidelines.",
    defaultData: {
      title: "Rules & Eligibility Guidelines",
      subtitle: "Requirements for participating teams",
      columns: 3,
      cards: [
        {
          badge: "RULE-01",
          title: "Team Composition",
          description: "Teams must consist of 2 to 4 actively enrolled undergraduate or diploma engineering students.",
        },
        {
          badge: "RULE-02",
          title: "Physical Hardware Prototype",
          description: "Every entry must feature a functional physical hardware setup or live testbench. Pure simulations without hardware are not eligible.",
        },
        {
          badge: "RULE-03",
          title: "Bonafide Verification",
          description: "All participants from external colleges must carry a valid institutional student ID card or bonafide certificate.",
        },
      ],
    },
  },
  judging_criteria: {
    type: "judging_criteria",
    label: "Evaluation Rubrics",
    description: "Breakdown of jury scoring criteria and weightages.",
    defaultData: {
      title: "Jury Evaluation Rubrics",
      subtitle: "Standardized evaluation parameters across all technical tracks",
      criteria: [
        { title: "Hardware Architecture & Circuit Design", weight: "25%", description: "Component selection, schematic layout, power efficiency, and wiring quality." },
        { title: "Firmware & Software Implementation", weight: "25%", description: "Code structure, communication protocols (MQTT/HTTP/BLE/LoRa), and edge responsiveness." },
        { title: "Problem Relevance & Practical Impact", weight: "25%", description: "Originality of solution and direct applicability to real-world operational challenges." },
        { title: "Working Demonstration & Technical Q&A", weight: "25%", description: "Reliability of live prototype demonstration and depth during jury interaction." },
      ],
    },
  },
  awards_prizes: {
    type: "awards_prizes",
    label: "Awards & Recognition",
    description: "Institutional prizes, cash rewards, and certificates.",
    defaultData: {
      title: "Awards & Recognition",
      subtitle: "Honoring outstanding IoT engineering prototypes",
      prizes: [
        { tier: "First Place", badge: "WINNER", description: "Cash Award + Trophy + Certificate of Excellence" },
        { tier: "Second Place", badge: "RUNNER UP", description: "Cash Award + Trophy + Certificate of Excellence" },
        { tier: "Third Place", badge: "2ND RUNNER UP", description: "Cash Award + Trophy + Certificate of Excellence" },
        { tier: "Special Category", badge: "INNOVATION AWARD", description: "Best Hardware Prototyping & Best Low-Power IoT Design" },
      ],
      certificateNote: "All verified participants with working hardware prototypes will receive official Certificates of Participation.",
    },
  },
  faq_accordion: {
    type: "faq_accordion",
    label: "FAQ Accordion",
    description: "Frequently asked questions for students and mentors.",
    defaultData: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to common queries regarding Expothon 2026",
      items: [
        { question: "Who is eligible to participate?", answer: "Undergraduate engineering, polytechnic, and diploma students from recognized institutions and universities across India." },
        { question: "Is there any registration fee?", answer: "Details regarding participation confirmation are provided in the official event circular." },
        { question: "Will power outlets and Wi-Fi be provided at the demonstration booth?", answer: "Yes, standard 230V AC power sockets and high-speed campus Wi-Fi will be arranged for each shortlisted team bench." },
        { question: "Can we refine our hardware prototype after abstract submission?", answer: "Incremental improvements to code and hardware are permitted, provided the core project theme and title match the shortlisted abstract." },
      ],
    },
  },
  downloads: {
    type: "downloads",
    label: "Official Downloads",
    description: "Downloadable PDF rulebooks, brochures, and NOC formats.",
    defaultData: {
      title: "Official Documents & Downloads",
      subtitle: "Authorized event circulars, abstract templates, and permission formats",
      files: [
        { title: "Expothon 2026 Event Circular", size: "PDF Document", href: "#" },
        { title: "Project Abstract Format & Rubrics", size: "PDF Document", href: "#" },
        { title: "Institutional Bonafide & NOC Format", size: "DOCX Document", href: "#" },
      ],
    },
  },
  team_grid: {
    type: "team_grid",
    label: "Coordinators & Team Grid",
    description: "Faculty coordinators and student committee members.",
    defaultData: {
      title: "Organizing Committee",
      subtitle: "Faculty and student coordinators for the IoT Lab CoE",
      members: [
        { name: "Faculty Lead Coordinator", designation: "Head, IoT Lab Centre of Excellence", department: "Department of ECE, SSE SIMATS", email: "iotcoe.ece@saveetha.com" },
        { name: "Faculty Technical Convenor", designation: "Assistant Professor, Department of ECE", department: "Saveetha School of Engineering, SIMATS", email: "iotcoe.ece@saveetha.com" },
        { name: "Student Convenor Desk", designation: "Student Committee Convenor", department: "Department of ECE, SSE SIMATS", email: "iotcoe.ece@saveetha.com" },
      ],
    },
  },
  contact_strip: {
    type: "contact_strip",
    label: "Contact & Venue Strip",
    description: "Contact cards, interactive map embed, and email form.",
    defaultData: {
      title: "Contact & Venue Details",
      subtitle: "For queries regarding submissions, logistics, or lab access",
      email: "iotcoe.ece@saveetha.com",
      phone: "+91 44 2680 1999",
      address: "Saveetha School of Engineering, SIMATS Deemed University, Chennai - 602105",
      showMapEmbed: true,
    },
  },
  rich_text: {
    type: "rich_text",
    label: "Rich Text Document",
    description: "Rich text content for institutional policies and terms.",
    defaultData: {
      title: "Code of Conduct & Guidelines",
      content: "<p>All participants must uphold academic honesty, ethical engineering practices, and respect laboratory equipment safety guidelines.</p>",
    },
  },
};
