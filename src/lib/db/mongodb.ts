import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  lastFailedTime: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastFailedTime: 0,
};

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null, lastFailedTime: 0 };
}

// Cooldown period after a failed connection attempt (e.g., local DB offline)
const FAILURE_COOLDOWN_MS = 30000;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  // If already connected, return in 0ms
  if (cached.conn) {
    return cached.conn;
  }

  // If previous attempt failed recently, bypass immediately (0ms latency fallback)
  const now = Date.now();
  if (cached.lastFailedTime && now - cached.lastFailedTime < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 600, // Super-fast 600ms discovery timeout
      connectTimeoutMS: 600,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        cached.lastFailedTime = 0;
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        cached.lastFailedTime = Date.now();
        console.warn(
          "MongoDB unavailable (instant zero-delay memory cache active):",
          err.message || err
        );
        return null;
      });
  }

  try {
    const res = await cached.promise;
    return res;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailedTime = Date.now();
    return null;
  }
}

export default connectToDatabase;
