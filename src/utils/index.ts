export * from "./hooks";
export const pluck = <T, K extends keyof T>(
  o: T,
  propertyNames: K[]
): T[K][] => {
  return propertyNames.map((n) => o[n]);
};
