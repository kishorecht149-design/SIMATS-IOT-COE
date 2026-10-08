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

// Cooldown period after a failed connection attempt (e.g., local DB offline or bad credentials)
const FAILURE_COOLDOWN_MS = 15000;

export function isDatabaseConnected(): boolean {
  return (mongoose.connection.readyState as number) === 1;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  // If already connected, return in 0ms
  if ((mongoose.connection.readyState as number) === 1) {
    cached.conn = mongoose;
    return mongoose;
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
      serverSelectionTimeoutMS: 2500, // 2.5s discovery timeout
      connectTimeoutMS: 2500,
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
          "MongoDB unavailable (memory fallback store active):",
          err.message || err
        );
        return null;
      });
  }

  try {
    const res = await cached.promise;
    if (res && (mongoose.connection.readyState as number) === 1) {
      return res;
    }
    return null;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastFailedTime = Date.now();
    return null;
  }
}

export default connectToDatabase;
