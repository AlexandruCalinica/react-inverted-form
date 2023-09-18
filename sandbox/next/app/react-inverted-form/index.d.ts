import * as react from 'react';
import { ReactNode } from 'react';

declare type ActionType = "INIT" | "REGISTER_FIELD" | "SET_DEFAULT_VALUES" | "SET_HANDLERS" | "FIELD_CHANGE" | "FIELD_BLUR" | "SET_FIELD_ERROR" | "SET_FIELD_PRISTINE" | "SET_FIELD_TOUCHED" | "SET_VALIDATION_ERRORS" | "IS_SUBMITTING" | "HAS_SUBMITTED" | "ATTEMPTED_SUBMIT" | "SET_TOTAL_STEPS" | "SET_DEFAULT_CURRENT_STEP" | "SET_CURRENT_STEP" | "STEP_TO_NEXT" | "STEP_TO_PREVIOUS" | "STEP_TO_FIRST" | "STEP_TO_LAST" | "SNAPSHOT_STATE" | "RESET";
declare type ActionPayload = any;
declare type Action = {
    type: ActionType;
    payload?: ActionPayload;
};
declare type GenericObject = {
    [k: string]: any;
};
declare type FieldMeta = {
    pristine: boolean;
    hasError: boolean;
    isTouched: boolean;
};
declare type FieldProps = {
    meta: FieldMeta;
    error?: string;
};
declare type Fields<T> = Record<keyof T, FieldProps>;
interface FormMetaProps<T extends GenericObject> extends Omit<FormState<T>, "values"> {
}
declare type FormHandlers<T extends GenericObject> = {
    change: (values: T, formMeta: FormMetaProps<T>) => void;
    blur: (values: T, formMeta: FormMetaProps<T>) => void;
    submit: (values: T, formMeta: FormMetaProps<T>) => Promise<void>;
    validate: (values: T, formMeta: FormMetaProps<T>) => Promise<Partial<{
        [k in keyof T]: string;
    }>>;
};
declare type Snapshot<T extends GenericObject> = {
    values: T;
    fields: Fields<T>;
    steps: FormSteps;
    form: Omit<FormMeta<T>, "snapshot" | "history" | "debug" | "handlers">;
};
declare type FormMeta<T extends GenericObject> = {
    isSubmitting: boolean;
    hasSubmitted: boolean;
    attemptedSubmit: boolean;
    hasDefaultValues: boolean;
    hasDefaultCurrentStep: boolean;
    handlers: FormHandlers<T>;
    snapshot: Snapshot<T> | null;
    history: Action[];
    debug: boolean;
};
declare type FormSteps = {
    total: number;
    current: number;
    canNext: boolean;
    canPrevious: boolean;
};
declare type FormState<T extends GenericObject> = {
    values: T;
    fields: Fields<T>;
    steps: FormSteps;
    form: FormMeta<T>;
};
declare type UseFieldOptions = {
    native?: boolean;
};
interface InputProps {
    name: string;
    id: string;
    value: any;
    onBlur: (e: any) => void;
    onChange: (e: any) => void;
}
interface NativeInputProps {
    name: string;
    id: string;
    value: any;
    onBlur: (e: any) => void;
    onChangeText: (e: any) => void;
}

declare function useFormState<T extends GenericObject>(formId: string, options?: {
    debug?: boolean;
}): FormState<T>;
declare function useField<T extends GenericObject, Property extends keyof T>(name: keyof T, formId: string, options?: UseFieldOptions): {
    state: {
        value: any;
        meta: FieldProps;
    };
    renderError: (renderer: (error: string) => ReactNode) => ReactNode;
    getInputProps: () => InputProps;
    getLabelProps: () => {
        htmlFor: string;
    };
    getNativeInputProps: () => NativeInputProps;
};
interface UseFormOptions<T extends GenericObject> {
    formId: string;
    defaultValues?: T;
    stateReducer?: (state: FormState<T>, action: Action, next: FormState<T>) => FormState<T>;
    totalSteps?: number;
    defaultCurrentStep?: number;
    onBlur?: (values: T, metaProps: FormMetaProps<T>) => void;
    onChange?: (values: T, metaProps: FormMetaProps<T>) => void;
    onSubmit?: (values: T, metaProps: FormMetaProps<T>) => Promise<void>;
    validator?: (values: T, metaProps: FormMetaProps<T>) => Promise<Partial<{
        [k in keyof T]: string;
    }>>;
    debug?: boolean;
}
declare function useForm<T extends GenericObject>(options: UseFormOptions<T>): {
    state: FormState<T>;
    reset: () => void;
    stepToNext: () => void;
    stepToLast: () => void;
    stepToFirst: () => void;
    handleSubmit: <T_1 extends GenericObject>(event: react.FormEvent<HTMLFormElement>) => void;
    asyncDispatch: <T_2 extends GenericObject>(type: ActionType, payload: (state: FormState<T_2>) => Promise<unknown>, options?: {
        formId?: string | undefined;
    } | undefined) => void;
    setCurrentStep: (step: number) => void;
    stepToPrevious: () => void;
    setDefaultValues: <T_3 extends GenericObject>(defaultValues: T_3) => void;
    setValidationErrors: <T_4 extends GenericObject>(errors: Partial<{ [k in keyof T_4]: string; }>) => void;
};

export { useField, useForm, useFormState };
