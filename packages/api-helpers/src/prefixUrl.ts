export function prefixUrl(url: string, prefix?: string) {
  let combinedUrl = url;

  if (prefix) combinedUrl = prefix + url;

  return combinedUrl;
}
