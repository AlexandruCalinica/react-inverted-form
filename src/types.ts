export type ActionType =
  | "INIT"
  | "REGISTER_FIELD"
  | "SET_DEFAULT_VALUES"
  | "SET_HANDLERS"
  | "FIELD_CHANGE"
  | "FIELD_BLUR"
  | "SET_FIELD_ERROR"
  | "SET_FIELD_PRISTINE"
  | "SET_FIELD_TOUCHED"
  | "SET_VALIDATION_ERRORS"
  | "IS_SUBMITTING"
  | "HAS_SUBMITTED"
  | "ATTEMPTED_SUBMIT"
  | "SET_TOTAL_STEPS"
  | "SET_DEFAULT_CURRENT_STEP"
  | "SET_CURRENT_STEP"
  | "STEP_TO_NEXT"
  | "STEP_TO_PREVIOUS"
  | "STEP_TO_FIRST"
  | "STEP_TO_LAST";

export type ActionPayload = any;
export type Action = {
  type: ActionType;
  payload?: ActionPayload;
};

export type GenericObject = { [k: string]: any };

export type FieldMeta = {
  pristine: boolean;
  hasError: boolean;
  isTouched: boolean;
};
export type FieldProps = {
  meta: FieldMeta;
  error?: string;
};
export type Fields<T> = Record<keyof T, FieldProps>;

export interface FormMetaProps<T extends GenericObject>
  extends Omit<FormState<T>, "values"> {}

export type FormHandlers<T> = {
  change: (values: T, formMeta: FormMetaProps<T>) => void;
  blur: (values: T, formMeta: FormMetaProps<T>) => void;
  submit: (values: T, formMeta: FormMetaProps<T>) => Promise<void>;
  validate: (
    values: T,
    formMeta: FormMetaProps<T>
  ) => Promise<Partial<{ [k in keyof T]: string }>>;
};

export type FormMeta<T> = {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  attemptedSubmit: boolean;
  hasDefaultValues: boolean;
  hasDefaultCurrentStep: boolean;
  handlers: FormHandlers<T>;
};

export type FormSteps = {
  total: number;
  current: number;
  canNext: boolean;
  canPrevious: boolean;
};

export type FormState<T extends GenericObject> = {
  values: T;
  fields: Fields<T>;
  steps: FormSteps;
  form: FormMeta<T>;
};

export type StoreState = { [k: string]: FormState<GenericObject> };
export type UseFieldOptions = {
  native?: boolean;
};
