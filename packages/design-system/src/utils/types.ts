import { ClassNameValue } from "./twMerge";

export type ClassNameArrayProp = ClassNameValue[] | ClassNameValue;

export type WithClassNameArray<TElement> = TElement & {
  classNames?: ClassNameArrayProp;
};
