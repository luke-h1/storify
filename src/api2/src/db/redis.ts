import Redis from 'ioredis';

const redis = new Redis({
  port: parseInt(process.env.REDIS_PORT, 10),
  username: 'default',
  password: process.env.REDIS_PASSWORD,
});

export async function get(key: string): Promise<string | null> {
  return redis.get(key);
}

export async function set<T extends string>(key: string, data: T) {
  return redis.set(key, data);
}

export async function del(key: string) {
  return redis.del(key);
}
