export function getFromEnv<T>(key: string): T {
  const value = process.env[key];

  if (value) {
    return JSON.parse(value) as T;
  }

  throw new Error("The requested key does not exist in the environment");
}
