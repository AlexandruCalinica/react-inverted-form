import { GenericObject, FormState } from "./types";

export function getMetaProps<T extends GenericObject>(state: FormState<T>) {
  const { values, ...rest } = state;
  return rest;
}

export function mergeCurrentWithPrevious<T extends GenericObject>(
  name: keyof T,
  value: any,
  values: { [k in keyof T]: any }
) {
  return Object.assign(values, { [name]: value });
}
