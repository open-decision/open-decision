export * from "./hooks";

export const log = <T>(value: T): T => {
  console.log(value);
  return value;
};
