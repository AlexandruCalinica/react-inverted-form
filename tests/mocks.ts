import { FormState } from "../src/types";

export const mockState: FormState<any> = {
  values: {},
  fields: {},
  steps: {
    total: 1,
    current: 1,
    canNext: false,
    canPrevious: false,
  },
  form: {
    isSubmitting: false,
    hasSubmitted: false,
    attemptedSubmit: false,
    hasDefaultValues: false,
    hasDefaultCurrentStep: false,
    handlers: {
      change: () => undefined,
      blur: () => undefined,
      submit: async () => undefined,
      validate: async () => ({}),
    },
  },
};
