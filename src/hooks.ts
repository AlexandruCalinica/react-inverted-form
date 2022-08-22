import { useState, useEffect, ReactNode } from "react";

import { Store } from "./store";
import { getInitialState, getInitialFieldProps } from "./core";
import {
  Action,
  FormState,
  FieldProps,
  GenericObject,
  FormMetaProps,
} from "./types";
import { getStoreHandlers } from "./handlers";

const store = new Store<FormState<any>>();

export function useFormState<T extends GenericObject>(formId: string) {
  const [state, setState] = useState<FormState<T>>(() => getInitialState());

  useEffect(() => {
    store.init(formId);
    const subscription = store.subscribe(formId, setState);
    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export function useField<T extends GenericObject>(
  name: keyof T,
  formId: string
) {
  const [state, setState] = useState<{ value: any; meta: FieldProps }>({
    value: undefined,
    meta: getInitialFieldProps(),
  });

  const { handleFieldBlur, handleFieldChange } = getStoreHandlers(
    formId,
    store
  );

  const getLabelProps = () => ({
    htmlFor: name,
  });

  const getInputProps = () => {
    return {
      name,
      id: name,
      value: state.value,
      onBlur: handleFieldBlur(name),
      onChange: handleFieldChange(name),
    };
  };

  const renderError = (renderer: (error: string) => ReactNode) => {
    if (!state.meta?.error) return null;
    return renderer(state.meta.error ?? "");
  };

  useEffect(() => {
    const subscription = store
      .selectField(formId, name as string)
      .subscribe(setState);
    return () => subscription.unsubscribe();
  }, [name]);

  return {
    state,
    renderError,
    getInputProps,
    getLabelProps,
  };
}

interface UseFormOptions<T extends GenericObject> {
  formId: string;
  defaultValues?: T;
  stateReducer?: (
    state: FormState<T>,
    action: Action,
    next: FormState<T>
  ) => FormState<T>;
  totalSteps?: number;
  defaultCurrentStep?: number;
  onBlur?: (values: T, metaProps: FormMetaProps<T>) => void;
  onChange?: (values: T, metaProps: FormMetaProps<T>) => void;
  onSubmit?: (values: T, metaProps: FormMetaProps<T>) => Promise<void>;
  validator?: (
    values: T,
    metaProps: FormMetaProps<T>
  ) => Promise<Partial<{ [k in keyof T]: string }>>;
}

export function useForm<T extends GenericObject>(options: UseFormOptions<T>) {
  const state = useFormState<T>(options.formId);
  const {
    stepToLast,
    stepToNext,
    stepToFirst,
    setHandlers,
    handleSubmit,
    registerField,
    setTotalSteps,
    stepToPrevious,
    setCurrentStep,
    setDefaultValues,
    setDefaultCurrentStep,
  } = getStoreHandlers(options.formId, store);

  useEffect(() => {
    if (options.defaultValues) {
      Object.keys(options.defaultValues).forEach(registerField);
      setDefaultValues<T>(options?.defaultValues);
    }
    if (options.defaultCurrentStep) {
      setDefaultCurrentStep(options?.defaultCurrentStep);
    }
    if (options?.totalSteps) {
      setTotalSteps(options.totalSteps);
    }
    if (options?.stateReducer) {
      store.setReducer(
        options.formId,
        (reducer) => (state, action) =>
          options.stateReducer?.(
            state,
            action,
            reducer(state, action)
          ) as FormState<T>
      );
    }

    setHandlers<T>({
      blur: options?.onBlur,
      change: options?.onChange,
      submit: options?.onSubmit,
      validate: options?.validator,
    });
  }, []);

  return {
    state,
    stepToNext,
    stepToLast,
    stepToFirst,
    setCurrentStep,
    stepToPrevious,
    handleSubmit,
    setDefaultValues,
  };
}
