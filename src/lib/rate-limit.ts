interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Lightweight sliding-window rate limiter
 * @param identifier Unique IP or token string
 * @param limit Max requests allowed in window
 * @param windowMs Window length in milliseconds
 */
export async function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60 * 1000
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  // Clean up expired records occasionally
  if (memoryStore.size > 10000) {
    for (const [key, value] of memoryStore.entries()) {
      if (now > value.resetTime) {
        memoryStore.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(identifier, newRecord);
    return {
      success: true,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  memoryStore.set(identifier, record);

  return {
    success: true,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
