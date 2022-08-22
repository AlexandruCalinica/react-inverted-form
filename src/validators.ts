import { validate } from "class-validator";
import { ValidationError, AnySchema } from "yup";

export function createYupValidator(schema: AnySchema) {
  return async function yupValidator(values: any) {
    let errors = {};

    try {
      await schema.validate(values, { abortEarly: false, strict: true });
    } catch (err) {
      const keys = Object.keys((err as ValidationError).value)
        .sort()
        .reverse();
      const messages = (err as ValidationError).errors;

      const out = keys.reduce(
        (acc, curr, idx) => ({ ...acc, [curr]: messages[idx] }),
        {}
      );
      Object.assign(errors, out);
    }

    return errors;
  };
}

export function createClassValidator<T extends object>(
  Constructor: new () => T
) {
  let constructor = new Constructor();

  return async function classValidator(values: any) {
    let errors = {};
    Object.assign(constructor, values);

    try {
      const err = await validate(constructor);
      const out = err.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.property]: Object.values(curr?.constraints ?? {})[0]
        }),
        {}
      );
      Object.assign(errors, out);
    } catch (error) {}

    return errors;
  };
}
