import { validate } from "class-validator";

export function createClassValidator<T extends object>(
  Constructor: new () => T
) {
  const constructor = new Constructor();

  return async function classValidator(values: any) {
    const errors = {};
    Object.assign(constructor, values);

    try {
      const err = await validate(constructor);
      const out = err.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.property]: Object.values(curr?.constraints ?? {})[0],
        }),
        {}
      );
      Object.assign(errors, out);
    } catch (error) {
      // log errors here
      console.log(error);
    }

    return errors;
  };
}
