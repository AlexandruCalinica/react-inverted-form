import { useState, useEffect, ReactNode } from "react";

import { Store } from "./store";
import { getInitialState, getInitialFieldProps } from "./core";
import {
  Action,
  FormState,
  FieldProps,
  GenericObject,
  FormMetaProps,
  UseFieldOptions,
} from "./types";
import { getStoreHandlers } from "./handlers";

const store = new Store<FormState<any>>();

export function useFormState<T extends GenericObject>(
  formId: string,
  options?: { debug?: boolean }
) {
  const [state, setState] = useState<FormState<T>>(() => getInitialState());

  useEffect(() => {
    store.init(formId);
    store.dispatch(formId, {
      type: "INIT",
      payload: options,
    });

    const subscription = store.subscribe(formId, setState);
    return () => subscription.unsubscribe();
  }, []);

  return state;
}

export function useField<T extends GenericObject>(
  name: keyof T,
  formId: string,
  options?: UseFieldOptions
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
    htmlFor: String(name),
  });

  const getInputProps = () => {
    return {
      name,
      id: name,
      value: state.value,
      onBlur: !options?.native ? handleFieldBlur(name) : undefined,
      onChange: !options?.native ? handleFieldChange(name) : undefined,
      onChangeText: options?.native ? handleFieldChange(name) : undefined,
    };
  };

  const renderError = (renderer: (error: string) => ReactNode) => {
    if (!state.meta?.error) return null;
    return renderer(state.meta.error ?? "");
  };

  useEffect(() => {
    store.init(formId);
  }, []);

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
  debug?: boolean;
}

export function useForm<T extends GenericObject>(options: UseFormOptions<T>) {
  const state = useFormState<T>(options.formId, {
    debug: options?.debug ?? false,
  });
  const {
    reset,
    stepToLast,
    stepToNext,
    stepToFirst,
    setHandlers,
    handleSubmit,
    registerField,
    setTotalSteps,
    snapshotState,
    asyncDispatch,
    stepToPrevious,
    setCurrentStep,
    setDefaultValues,
    setValidationErrors,
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

    snapshotState();
  }, []);

  return {
    state,
    reset,
    stepToNext,
    stepToLast,
    stepToFirst,
    handleSubmit,
    asyncDispatch,
    setCurrentStep,
    stepToPrevious,
    setDefaultValues,
    setValidationErrors,
  };
}
