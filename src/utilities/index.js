import { complement, isEmpty } from "ramda";

export const trace = (data) => {
  console.log(data);
  return data;
};

export const isNotEmpty = complement(isEmpty);
