import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "customProps", async: false })
export class CustomProps implements ValidatorConstraintInterface {
  validate(o: any, args: ValidationArguments) {
    return Object.values(o).filter(Boolean).length >= args.constraints[0];
  }

  defaultMessage(args: ValidationArguments) {
    const keys = Object.entries(args.value)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    return `${keys[0]} should not be empty`;
  }
}
