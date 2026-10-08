// In-memory media store fallback for offline and local mode
export interface MemoryMedia {
  _id: string;
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  altText: string;
  category: "hero" | "gallery" | "sponsor" | "document" | "other";
  uploadedBy: string;
  createdAt: string;
}

const DEFAULT_MEDIA: MemoryMedia[] = [
  {
    _id: "media-001",
    filename: "simats-iot-coe-bench.jpg",
    url: "/logo.png",
    fileSize: 245000,
    mimeType: "image/png",
    dimensions: { width: 1200, height: 800 },
    altText: "Saveetha IoT Lab Centre of Excellence Workstations",
    category: "gallery",
    uploadedBy: "admin@saveetha.simats.edu",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "media-002",
    filename: "expothon-banner-2026.png",
    url: "/logo.png",
    fileSize: 184000,
    mimeType: "image/png",
    dimensions: { width: 800, height: 600 },
    altText: "Expothon 2026 National Exhibition Banner",
    category: "hero",
    uploadedBy: "admin@saveetha.simats.edu",
    createdAt: new Date().toISOString(),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var memoryMedia: MemoryMedia[] | undefined;
}

if (!global.memoryMedia) {
  global.memoryMedia = [...DEFAULT_MEDIA];
}

export function getMemoryMedia(): MemoryMedia[] {
  return global.memoryMedia || DEFAULT_MEDIA;
}

export function addMemoryMedia(item: Omit<MemoryMedia, "_id" | "createdAt">): MemoryMedia {
  const newMedia: MemoryMedia = {
    ...item,
    _id: `media-mem-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  global.memoryMedia = [newMedia, ...(global.memoryMedia || [])];
  return newMedia;
}

export function deleteMemoryMedia(id: string): boolean {
  if (!global.memoryMedia) return false;
  const initialLen = global.memoryMedia.length;
  global.memoryMedia = global.memoryMedia.filter((m) => m._id !== id);
  return global.memoryMedia.length < initialLen;
}
