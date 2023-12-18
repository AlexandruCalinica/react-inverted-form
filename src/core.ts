import {
  Action,
  Fields,
  FormMeta,
  FormState,
  FormSteps,
  FieldProps,
  GenericObject,
} from "./types";

export function getInitialMetaProps<T extends GenericObject>(options?: {
  debug?: boolean;
}): FormMeta<T> {
  return {
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
    snapshot: null,
    history: [],
    debug: options?.debug ?? false,
  };
}

export function getInitialStepsProps(): FormSteps {
  return {
    total: 1,
    current: 1,
    canNext: false,
    canPrevious: false,
  };
}

export function getInitialState<T extends object>(options?: {
  debug: boolean;
}): FormState<T> {
  return {
    values: {} as T,
    fields: {} as Fields<T>,
    steps: getInitialStepsProps(),
    form: getInitialMetaProps(options),
  };
}

export function applyDefaultValues<T extends object>(
  state: FormState<T>,
  defaultValues?: FormState<T>["values"]
) {
  if (defaultValues) {
    const prevValues = { ...state.values };

    return {
      ...state,
      values: Object.assign(prevValues, defaultValues),
      form: {
        ...state.form,
        hasDefaultValues: true,
      },
    };
  }

  return state;
}

export function getInitialFieldProps(): FieldProps {
  return {
    meta: {
      pristine: true,
      hasError: false,
      isTouched: false,
    },
  };
}

export function reducer<T extends object>(
  state: FormState<T>,
  action: Action
): FormState<T> {
  if (state.form.debug) {
    state.form.history.push(action);
  }

  switch (action.type) {
    case "INIT": {
      const next = getInitialState<T>(action?.payload);

      if (action.payload?.debug) {
        next.form.history.push(action);
      }

      return next;
    }
    case "REGISTER_FIELD": {
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload]: null,
        },
        fields: {
          ...state.fields,
          [action.payload]: getInitialFieldProps(),
        },
      };
    }
    case "SET_DEFAULT_VALUES":
      return applyDefaultValues<T>(state, action.payload);
    case "SET_HANDLERS": {
      const handlers = Object.assign(
        { ...state.form.handlers },
        action.payload
      );
      return {
        ...state,
        form: {
          ...state.form,
          handlers,
        },
      };
    }
    case "FIELD_CHANGE": {
      const { values } = state;
      const { name, value } = action.payload;

      const prevValues = { ...values };
      const nextValues = Object.assign(prevValues, {
        [name]: value,
      });

      return {
        ...state,
        values: nextValues,
      };
    }
    case "SET_FIELD_PRISTINE": {
      const { name, pristine } = action.payload;
      const { fields } = state;

      if (fields?.[name as keyof T]?.meta?.pristine) {
        const nextFields = { ...fields };
        nextFields[name as keyof T].meta.pristine = pristine;

        return {
          ...state,
          fields: nextFields,
        };
      }

      return state;
    }
    case "FIELD_BLUR": {
      const { values } = state;
      const { name, value } = action.payload;

      const prevValues = { ...values };
      const nextValues = Object.assign(prevValues, {
        [name]: value,
      });

      return {
        ...state,
        values: nextValues,
      };
    }
    case "SET_FIELD_TOUCHED": {
      const { name, isTouched } = action.payload;
      const { fields } = state;

      if (!fields?.[name as keyof T]?.meta?.isTouched) {
        const nextFields = { ...fields };
        nextFields[name as keyof T].meta.isTouched = isTouched;

        return {
          ...state,
          fields: nextFields,
        };
      }

      return state;
    }
    case "SET_VALIDATION_ERRORS": {
      const errors = action.payload as Partial<{ [k in keyof T]: string }>;
      const fields = Object.entries(state.fields).reduce(
        (acc, [name, props]) => {
          if (!(name in errors)) {
            return {
              ...acc,
              [name]: {
                meta: {
                  ...(props as FieldProps)?.meta,
                  hasError: false,
                },
              },
            };
          }

          return {
            ...acc,
            [name]: {
              ...(props as FieldProps),
              meta: {
                ...(props as FieldProps)?.meta,
                hasError: true,
              },
              error: errors[name as keyof T],
            },
          };
        },
        state.fields
      );

      return {
        ...state,
        fields,
      };
    }
    case "IS_SUBMITTING": {
      return {
        ...state,
        form: {
          ...state.form,
          isSubmitting: true,
        },
      };
    }
    case "HAS_SUBMITTED": {
      return {
        ...state,
        form: {
          ...state.form,
          isSubmitting: false,
          hasSubmitted: true,
        },
      };
    }
    case "ATTEMPTED_SUBMIT": {
      return {
        ...state,
        form: {
          ...state.form,
          attemptedSubmit: true,
        },
      };
    }
    case "SET_TOTAL_STEPS": {
      const total = action.payload;
      const canNext = total > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          total,
          canNext,
        },
      };
    }
    case "SET_DEFAULT_CURRENT_STEP": {
      const current = action.payload;
      const total = state.steps.total;
      const canNext = current < total;
      const canPrevious = current > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
        form: {
          ...state.form,
          hasDefaultCurrentStep: true,
        },
      };
    }
    case "SET_CURRENT_STEP": {
      const current = action.payload;
      const total = state.steps.total;
      const canNext = current < total;
      const canPrevious = current > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
      };
    }
    case "STEP_TO_NEXT": {
      const total = state.steps.total;
      const prevCanNext = state.steps.canNext;
      const prevCurrent = state.steps.current;
      const current = prevCanNext ? prevCurrent + 1 : prevCurrent;
      const canNext = current < total;
      const canPrevious = current > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
      };
    }
    case "STEP_TO_PREVIOUS": {
      const total = state.steps.total;
      const prevCanPrevious = state.steps.canPrevious;
      const prevCurrent = state.steps.current;
      const current = prevCanPrevious ? prevCurrent - 1 : prevCurrent;
      const canNext = current < total;
      const canPrevious = current > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
      };
    }
    case "STEP_TO_FIRST": {
      const total = state.steps.total;
      const current = 1;
      const canPrevious = false;
      const canNext = total > current;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
      };
    }
    case "STEP_TO_LAST": {
      const total = state.steps.total;
      const current = total;
      const canNext = false;
      const canPrevious = current > 1;
      return {
        ...state,
        steps: {
          ...state.steps,
          current,
          canNext,
          canPrevious,
        },
      };
    }
    case "SNAPSHOT_STATE": {
      return {
        ...state,
        form: {
          ...state.form,
          snapshot: {
            values: { ...state.values },
            fields: { ...state.fields },
            steps: { ...state.steps },
            form: {
              ...state.form,
            },
          },
        },
      };
    }
    case "RESET": {
      if (!state.form.snapshot) return state;

      const { values, fields, form, steps } = state.form.snapshot;

      return {
        ...state,
        values: { ...values },
        fields: { ...fields },
        steps: { ...steps },
        form: {
          ...state.form,
          ...form,
        },
      };
    }
    default:
      return state;
  }
}
