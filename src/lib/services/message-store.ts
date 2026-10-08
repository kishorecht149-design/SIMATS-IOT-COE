// In-memory messages store fallback for offline mode
export interface MemoryMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Replied" | "Archived";
  createdAt: string;
}

const DEFAULT_MESSAGES: MemoryMessage[] = [
  {
    _id: "msg-001",
    name: "Dr. R. Ramanathan",
    email: "ramanathan.ece@mitindia.edu",
    subject: "Inquiry regarding LoRaWAN testbed frequencies",
    message: "Greetings, we have a student team preparing an agricultural telemetry project using 865-867 MHz frequency band. Will the lab provide an 868 MHz multi-channel LoRa gateway for field packet decoding?",
    status: "Unread",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    _id: "msg-002",
    name: "S. Swathi",
    email: "swathi.iot@gmail.com",
    subject: "Power supply accommodation for 12V 5A motor drivers",
    message: "Our robotics prototype requires dual 12V 5A DC power lines. Can we bring our own regulated benchtop power supply unit or will one be allotted at the booth?",
    status: "Read",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var memoryMessages: MemoryMessage[] | undefined;
}

if (!global.memoryMessages) {
  global.memoryMessages = [...DEFAULT_MESSAGES];
}

export function getMemoryMessages(): MemoryMessage[] {
  return global.memoryMessages || DEFAULT_MESSAGES;
}

export function addMemoryMessage(msg: Omit<MemoryMessage, "_id" | "status" | "createdAt">): MemoryMessage {
  const newMsg: MemoryMessage = {
    ...msg,
    _id: `msg-mem-${Date.now()}`,
    status: "Unread",
    createdAt: new Date().toISOString(),
  };
  global.memoryMessages = [newMsg, ...(global.memoryMessages || [])];
  return newMsg;
}

export function updateMemoryMessageStatus(id: string, status: MemoryMessage["status"]): boolean {
  if (!global.memoryMessages) global.memoryMessages = [...DEFAULT_MESSAGES];
  const item = global.memoryMessages.find((m) => m._id === id);
  if (item) {
    item.status = status;
    return true;
  }
  return false;
}
