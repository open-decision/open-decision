export * from "remeda";

export const canGoBackInArray = (array: any[], position: number) =>
  array.length > 1 && position < array.length - 1;

export const canGoForwardInArray = (array: any[], position: number) =>
  position > 0 && array.length < position;
