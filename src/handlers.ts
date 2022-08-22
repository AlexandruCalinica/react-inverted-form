import { BaseSyntheticEvent, FormEvent } from "react";

import { Store } from "./store";
import { GenericObject, FormHandlers, FormState } from "./types";
import { mergeCurrentWithPrevious, getMetaProps } from "./utils";

interface ValidateOptions {
  attemptedSubmit?: boolean;
}

interface StoreHandlers {
  registerField: (name: string) => void;
  setDefaultValues: <T extends GenericObject>(defaultValues: T) => void;
  setHandlers: <T extends GenericObject>(
    handlers: Partial<FormHandlers<T>>
  ) => void;
  setValidationErrors: <T extends GenericObject>(
    errors: Partial<{ [k in keyof T]: string }>
  ) => void;
  setTotalSteps: (total: number) => void;
  setDefaultCurrentStep: (step: number) => void;
  setCurrentStep: (step: number) => void;
  stepToNext: () => void;
  stepToPrevious: () => void;
  stepToFirst: () => void;
  stepToLast: () => void;
  validate: <T extends GenericObject>(options?: ValidateOptions) => void;
  handleChangeCallback: <T extends GenericObject>() => void;
  handleFieldChange: <T extends GenericObject>(
    name: keyof T
  ) => (e: any) => void;
  handleFieldBlur: <T extends GenericObject>(name: keyof T) => (e: any) => void;
  handleSubmit: <T extends GenericObject>(
    event: FormEvent<HTMLFormElement>
  ) => void;
}

export function getStoreHandlers(
  key: string,
  store: Store<FormState<any>>
): StoreHandlers {
  function registerField(name: string) {
    store.dispatch(key, { type: "REGISTER_FIELD", payload: name });
  }
  function setDefaultValues<T extends GenericObject>(defaultValues: T) {
    store.dispatch(key, {
      type: "SET_DEFAULT_VALUES",
      payload: defaultValues,
    });
  }
  function setHandlers<T extends GenericObject>(
    handlers: Partial<FormHandlers<T>>
  ) {
    store.dispatch(key, { type: "SET_HANDLERS", payload: handlers });
  }
  function setValidationErrors<T extends GenericObject>(
    errors: Partial<{ [k in keyof T]: string }>
  ) {
    store.dispatch(key, { type: "SET_VALIDATION_ERRORS", payload: errors });
  }
  function setTotalSteps(total: number) {
    store.dispatch(key, { type: "SET_TOTAL_STEPS", payload: total });
  }
  function setDefaultCurrentStep(step: number) {
    store.dispatch(key, { type: "SET_DEFAULT_CURRENT_STEP", payload: step });
  }
  function setCurrentStep(step: number) {
    store.dispatch(key, { type: "SET_CURRENT_STEP", payload: step });
  }
  function stepToNext() {
    store.dispatch(key, { type: "STEP_TO_NEXT" });
  }
  function stepToPrevious() {
    store.dispatch(key, { type: "STEP_TO_PREVIOUS" });
  }
  function stepToFirst() {
    store.dispatch(key, { type: "STEP_TO_FIRST" });
  }
  function stepToLast() {
    store.dispatch(key, { type: "STEP_TO_LAST" });
  }

  function validate<T extends GenericObject>(options?: ValidateOptions) {
    store
      .subscribe(key, async (state) => {
        const { values, form } = state;
        try {
          if (options?.attemptedSubmit) {
            if (form.attemptedSubmit) {
              const validationErrors = await form.handlers.validate(
                values,
                getMetaProps<T>(state)
              );
              setValidationErrors(validationErrors);
            }
          } else {
            const validationErrors = await form.handlers.validate(
              values,
              getMetaProps<T>(state)
            );
            setValidationErrors(validationErrors);
          }
        } catch (error) {
          console.error(error);
        }
      })
      .unsubscribe();
  }

  function handleChangeCallback<T extends GenericObject>() {
    store
      .subscribe(key, (state) => {
        const { values, form } = state;
        form.handlers.change(values, getMetaProps<T>(state));
      })
      .unsubscribe();
  }
  function handleFieldChange<T extends GenericObject>(name: keyof T) {
    return function (e: any) {
      let value = e;
      if ((e as BaseSyntheticEvent).nativeEvent) {
        value = (e as BaseSyntheticEvent).target.value;
      }

      validate<T>({ attemptedSubmit: true });

      store.dispatch(key, { type: "FIELD_CHANGE", payload: { name, value } });
      store.dispatch(key, {
        type: "SET_FIELD_PRISTINE",
        payload: { name, pristine: false },
      });
    };
  }

  function handleFieldBlur<T extends GenericObject>(name: keyof T) {
    return function (e: any) {
      let value = e;
      if ((e as BaseSyntheticEvent).nativeEvent) {
        value = (e as BaseSyntheticEvent).target.value;
      }

      store
        .subscribe(key, (state) => {
          const values = state.values;
          const handler = state.form.handlers?.blur;

          const nextValues = mergeCurrentWithPrevious<T>(name, value, values);
          handler?.(nextValues, getMetaProps<T>(state));
        })
        .unsubscribe();

      store.dispatch(key, { type: "FIELD_BLUR", payload: { name, value } });
      store.dispatch(key, {
        type: "SET_FIELD_TOUCHED",
        payload: { name, isTouched: true },
      });
    };
  }

  function handleSubmit<T extends GenericObject>(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    store.dispatch(key, { type: "ATTEMPTED_SUBMIT" });

    store
      .subscribe(key, async (state) => {
        const values = state.values;
        const handler = state.form.handlers?.submit;
        const validate = state.form.handlers?.validate;
        const metaProps = getMetaProps<T>(state);

        try {
          const errors = await validate(values, metaProps);
          if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
          } else {
            store.dispatch(key, { type: "IS_SUBMITTING" });

            await handler?.(values, metaProps);
            store.dispatch(key, { type: "HAS_SUBMITTED" });
          }
        } catch (error) {
          console.error(error);
        }
      })
      .unsubscribe();
  }

  return {
    registerField,
    setDefaultValues,
    setHandlers,
    setValidationErrors,
    setTotalSteps,
    setDefaultCurrentStep,
    setCurrentStep,
    stepToNext,
    stepToPrevious,
    stepToFirst,
    stepToLast,
    validate,
    handleChangeCallback,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
  };
}
