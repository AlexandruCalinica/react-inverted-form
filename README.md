# react-inverted-form
Form management solution for React that offers unparalleled flexibility via inversion of control patterns.

[![CI](https://github.com/AlexandruCalinica/react-inverted-form/actions/workflows/workflow.yaml/badge.svg)](https://github.com/AlexandruCalinica/react-inverted-form/actions/workflows/workflow.yaml)

### Key features
1. Headless approach
2. Uses React's hooks api
3. State reducer
4. Built in stepper
5. Feels like `react-table` or `downshift`

## Installation

via `npm`
```bash
npm install react-inverted-form
```

via `yarn`
```bash
yarn add react-inverted-form
```

## API
#### `react-inverted-form`
The module export.
```ts
import { 
  useForm,
  useField,
  useFormState,
  createYupValidator,
  createClassValidator,
} from 'react-inverted-form';
```

#### `useForm<T extends GenericObject>(options: UseFormOptions<T>): FormMethods<T>`
```ts
const {
  state,
  stepToNext,
  stepToLast,
  stepToFirst,
  handleSubmit,
  stepToPrevious,
  setCurrentStep,
  setDefaultValues,
  setValidationErrors,
} = useForm<User>({
  formId: 'user',
  totalSteps: 3,
  defaultValues: {},
  defaultCurrentStep: 1,
  onBlur: (values) => {},
  onChange: (values) => {},
  onSubmit: async (values) => {},
  validator: createYupValidator(schema),
  stateReducer: (state, action, next) => next,
  debug: false,
});
```
`useForm` is the main hook that you will use to create a form. It returns a set of methods that you can use to control the form's state. The methods also contain the form's current state which can be used to react uppon. This hook also accepts a generic type which is the type of the form's values. The generic type is used to type the form's state, methods and the validator.

`useForm` receives an object of type `UseFormOptions` as an argument. The options are the following:
#### `UseFormOptions<T extends GenericObject>`
* `formId: string` - The form id. Used for separating form contexts.
* `defaultValues?: T` - Values preset in the form at initialization. Defaults to `{}`.
* `defaultCurrentStep?: number` - The current step preset at initialization for the form stepper. Defaults to `1`.
* `totalSteps?: number` - The total number of steps for the form stepper. Defaults to `1`.
* `onBlur?: (values: T) => void` - Callback for when a field is blurred.
* `onChange?: (values: T) => void` - Callback for when a field is changed.
* `onSubmit?: (values: T) => Promise<void>` - Callback for when the form is submitted.
* `validator?: (values: T, metaProps: FormMetaProps<T>) => Promise<Partial<{ [k in keyof T]: string }>>;` - Validator for the form.
* `stateReducer?: (state: FormState<T>, action: Action, next: FormState<T>) => FormState<T>` - State reducer for the form.
* `debug?: boolean` - Whether to record the history of form's actions. Defaults to `false`.
  
`useForm` returns an object of type `FormMethods` which contains the following properties:
#### `FormMethods<T extends GenericObject>`
* `state: FormState<T>` - The form's current state.
* `stepToNext: () => void` - Steps to the next step in the form stepper.
* `stepToPrevious: () => void` - Steps to the previous step in the form stepper.
* `stepToFirst: () => void` - Steps to the first step in the form stepper.
* `stepToLast: () => void` - Steps to the last step in the form stepper.
* `handleSubmit: () => void` - Submits the form.
* `setCurrentStep: (step: number) => void` - Sets the current step in the form stepper.
* `setDefaultValues: (values: T) => void` - Sets the default values for the form.
* `setValidationErrors: (errors: Partial<{ [k in keyof T]: string }>) => void` - Imperatively set validation errors for the form.
* `asyncDispatch: (type: ActionType, payload: (state: FormState<T>, options?: { formId?: string }) => Promise<unknown>) => void` - Dispatches an action to the form's state reducer. The callback receives the form's current state and returns a promise that resolves to the next state. This method is useful for dispatching async actions inside the state reducer. Optionally, it receives a formId in the options argument usefull for dispathing actions inside other forms.
* `reset: () => void` - Resets the form's state to the initial state.


#### `useField<T extends GenericObject>(name: keyof T, formId: string, options?: UseFieldOptions): FieldMethods<T>`
```ts
const {
  state,
  renderError,
  getInputProps,
  getLabelProps,
} = useField<User>('name', 'user');
```
`useField` is a hook that is used to register an input field within a form. It returns a set of methods and properties that you can use to control the field's state. The methods also contain the field's current state which can be used to react uppon. This hook also accepts a generic type which is the type of the form's values. The generic type is used to type the field's state and props.

`useField` receives a name of a field, the form id and an optional object of type `UseFieldOptions` as arguments. The name is the name of the field that you want to register. The form id is the id of the form that you want to register the field in. The options are the following:

#### `UseFieldOptions`
* `native?: boolean` - Used only for registering `react-native` inputs. Defaults to `false`.

`useField` returns an object of type `FieldMethods` which contains the following properties:
#### `FieldMethods<T extends GenericObject>`
* `state: FieldState<T>` - The field's current state.
* `renderError: (renderer: (error: string) => ReactNode) => ReactNode` - A function that renders the field's error.
* `getInputProps: () => {
    name: keyof T;
    id: keyof T;
    value: any;
    onBlur: ((e: any) => void) | undefined;
    onChange: ((e: any) => void) | undefined;
    onChangeText: ((e: any) => void) | undefined;
}` - A function that returns the props that must be passed to the input field.
* `getLabelProps: () => {
    htmlFor: keyof T;
}` - A function that returns the props that must be passed to the label of the input field.

#### `useFormState<T extends GenericObject>(formId: string): FormState<T>`
```ts
const state = useFormState<User>('user');
```
`useFormState` is a hook that is used to get the form's state. This hook also accepts a generic type which is the type of the form's values. The generic type is used to type the form's state.

`useFormState` receives a form id as an argument. The form id is the id of the form that you want to get the state of.

### Validators
`react-inverted-form` comes with two built in validators. One for `yup` and one for `class-validator`. You can also create your own validator.
#### `createYupValidator(schema: AnySchema): (values: any) => Promise<Record<string, any>>`
```ts
const formSchema = object({
  name: string().required("Name is required"),
  surname: string().required("Surname is required"),
  age: number().positive().required("Age is required")
});

const validator = createYupValidator(formSchema);
```

#### `createClassValidator<T extends Object>(Constructor: new () => T): (values: any) => Promise<Record<string, any>>`
```ts
class User {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsPositive()
  @IsNotEmpty()
  age: number;
}

const validator = createClassValidator(User);
```

#### `createYupSyncValidator(schema: AnySchema): (values: any) => Record<string, any>`

Synchronous version of `createYupValidator`. Useful for validating values manually inside stateReducer.

```ts
const formSchema = object({
  name: string().required("Name is required"),
  surname: string().required("Surname is required"),
  age: number().positive().required("Age is required")
});

const validator = createYupSyncValidator(formSchema);
```

#### `createClassSyncValidator<T extends Object>(Constructor: new () => T): (values: any) => Record<string, any>`

Synchronous version of `createClassValidator`. Useful for validating values manually inside stateReducer.

```ts
class User {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsPositive()
  @IsNotEmpty()
  age: number;
}

const validator = createClassSyncValidator(User);
```
#### `custom validator`
`validator` property of `UseFormOptions` can be used to create a custom validator. The validator must return a promise that resolves to an object of type `Partial<{ [k in keyof T]: string }>`.

```ts
const validator = (values: any) => {
  const errors: Record<string, any> = {};

  if (!values.name) {
    errors.name = "Name is required";
  }

  if (!values.surname) {
    errors.surname = "Surname is required";
  }

  if (!values.age) {
    errors.age = "Age is required";
  } else if (values.age < 0) {
    errors.age = "Age must be positive";
  }

  return Promise.resolve(errors);
};
```

### State shape
```json
{
    "values": {
        "name": "",
        "surname": "Calinica",
    },
    "fields": {
        "name": {
            "meta": {
                "pristine": true,
                "hasError": false,
                "isTouched": false
            },
            "error": ""
        },
        "surname": {
            "meta": {
                "pristine": true,
                "hasError": false,
                "isTouched": false
            },
            "error": ""
        },
    },
    "steps": {
        "total": 2,
        "current": 1,
        "canNext": true,
        "canPrevious": false
    },
    "form": {
        "isSubmitting": false,
        "hasSubmitted": false,
        "attemptedSubmit": false,
        "hasDefaultValues": true,
        "hasDefaultCurrentStep": false,
        "handlers": {},
        "history": [],
        "snapshot": null,
        "debug": false
    }
}
```