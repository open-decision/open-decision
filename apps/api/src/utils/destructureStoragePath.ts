export const getStorageVars = (storageUrl: string) => {
  const url = new URL(storageUrl);
  const bucket = url.hostname.replace(".s3.eu-central-1.amazonaws.com", "");
  return { bucket, key: url.pathname.substring(1) };
};
