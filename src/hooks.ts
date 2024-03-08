import {
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
  useSyncExternalStore,
} from "react";

import { Store } from "./store";
import {
  Action,
  FormState,
  InputProps,
  GenericObject,
  FormMetaProps,
  UseFieldOptions,
  NativeInputProps,
} from "./types";
import { getStoreHandlers } from "./handlers";

const store = new Store<FormState<any>>();

let defaultValuesStore: Record<string, object> = {};

export function useFormState<T extends GenericObject>(
  formId: string,
  options?: { debug?: boolean }
) {
  store.initState(formId, options);

  const subscribe = useCallback(store.getSubscribe(formId), [formId]);
  const getSnapshot = useCallback(store.getSnapshot(formId), [formId]);
  const state = useSyncExternalStore<FormState<T>>(subscribe, getSnapshot);

  return state;
}

export function useFieldMeta<T extends GenericObject>(
  formId: string,
  name: keyof T
) {
  const subscribe = useCallback(
    store.getFieldSubscribe(formId, name as string),
    [formId, name]
  );
  const getMetaSnapshot = useCallback(
    store.getFieldMetaSnapshot(formId, name as string),
    [formId, name]
  );

  return useSyncExternalStore(subscribe, getMetaSnapshot);
}

export function useFieldValue<T extends GenericObject>(
  formId: string,
  name: keyof T
) {
  const subscribe = useCallback(
    store.getFieldSubscribe(formId, name as string),
    [formId, name]
  );
  const getValueSnapshot = useCallback(
    store.getFieldValueSnapshot(formId, name as string),
    [formId, name]
  );

  return useSyncExternalStore(subscribe, getValueSnapshot);
}

export function useFieldError<T extends GenericObject>(
  formId: string,
  name: keyof T
) {
  const subscribe = useCallback(
    store.getFieldSubscribe(formId, name as string),
    [formId, name]
  );
  const getErrorSnapshot = useCallback(
    store.getFieldErrorSnapshot(formId, name as string),
    [formId, name]
  );

  return useSyncExternalStore(subscribe, getErrorSnapshot);
}

export function useField<T extends GenericObject>(
  name: keyof T,
  formId: string,
  options?: UseFieldOptions
) {
  store.initState(formId);

  const meta = useFieldMeta<T>(formId, name);
  const value = useFieldValue<T>(formId, name);
  const error = useFieldError<T>(formId, name);

  const { handleFieldBlur, handleFieldChange } = getStoreHandlers(
    formId,
    store
  );

  const state = useMemo(
    () => ({ value, meta }),
    [
      value,
      meta?.error,
      meta?.meta?.hasError,
      meta?.meta?.pristine,
      meta?.meta?.isTouched,
    ]
  );

  const getLabelProps = () => ({
    htmlFor: String(name),
  });

  const getInputProps = (): InputProps => ({
    name: name as string,
    id: name as string,
    value: value ?? defaultValuesStore[formId]?.[name as keyof object],
    onBlur: handleFieldBlur(name),
    onChange: handleFieldChange(name),
  });

  const getNativeInputProps = (): NativeInputProps => ({
    name: name as string,
    id: name as string,
    value: value ?? defaultValuesStore[formId]?.[name as keyof object],
    onBlur: handleFieldBlur(name),
    onChangeText: handleFieldChange(name),
  });

  const renderError = (renderer: (error: string) => ReactNode) => {
    if (!error) return null;
    return renderer(error ?? "");
  };

  return {
    state,
    renderError,
    getInputProps,
    getLabelProps,
    getNativeInputProps,
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

  if (options.defaultValues && !defaultValuesStore[options.formId]) {
    defaultValuesStore[options.formId] = options.defaultValues;
  }

  const {
    reset,
    destroy,
    stepToLast,
    stepToNext,
    stepToFirst,
    setHandlers,
    handleSubmit,
    registerField,
    setTotalSteps,
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
  }, []);

  useEffect(() => {
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
  }, [options?.stateReducer]);

  return {
    state,
    reset,
    destroy,
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
