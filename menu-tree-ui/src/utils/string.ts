export const requireEnv = (value: string | undefined, keyName: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${keyName}`);
  }
  return value;
};
