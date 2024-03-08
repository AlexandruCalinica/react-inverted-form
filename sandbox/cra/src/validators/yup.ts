import { ValidationError, AnySchema } from "yup";

export function createYupValidator(schema: AnySchema) {
  return async function yupValidator(values: any) {
    const errors = {};

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

export function createYupSyncValidator(schema: AnySchema) {
  return function yupSyncValidator(values: any) {
    const errors = {};

    try {
      schema.validateSync(values, { abortEarly: false, strict: true });
    } catch (err) {
      const inner = (err as ValidationError).inner;

      const out = inner.reduce(
        (acc, curr) =>
          curr?.path ? { ...acc, [curr.path]: curr.message } : acc,
        {}
      );
      Object.assign(errors, out);
    }

    return errors;
  };
}
