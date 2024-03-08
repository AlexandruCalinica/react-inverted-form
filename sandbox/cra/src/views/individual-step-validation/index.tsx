import { useState } from "react";
import { object, string } from "yup";

import {
  createYupValidator,
  createYupSyncValidator,
} from "../../validators/yup";
import { useForm, useField } from "../../react-inverted-form";

interface RegisterInput {
  email: string;
  password: string;
  age: string;
  name: string;
  address: string;
}

const registerFormSchema = object({
  name: string().required(),
  email: string().required().email(),
  age: string().required(),
  address: string().required(),
  password: string().required(),
});

const step1Schema = object({
  name: string().required(),
  email: string().required().email(),
});
const step2Schema = object({
  age: string().required(),
  address: string().required(),
});

const validateStep1 = createYupSyncValidator(step1Schema);
const validateStep2 = createYupSyncValidator(step2Schema);

export default function App() {
  const [res, setRes] = useState("");

  const {
    state,
    handleSubmit,
    stepToNext,
    stepToPrevious,
    stepToFirst,
    stepToLast,
    asyncDispatch,
  } = useForm<RegisterInput>({
    formId: "register-1",
    defaultValues: {
      email: "",
      password: "",
      age: "",
      name: "",
      address: "",
    },
    totalSteps: 3,
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createYupValidator(registerFormSchema),
    stateReducer: (state, action, next) => {
      switch (action.type) {
        case "STEP_TO_NEXT": {
          const { name, email, age, address } = state.values;

          if (state.steps.current === 1) {
            const errors = validateStep1({ name, email });
            asyncDispatch("SET_VALIDATION_ERRORS", async () => errors);
            if (Object.values(errors).length) {
              return state;
            }
          }

          if (state.steps.current === 2) {
            const errors = validateStep2({ age, address });
            asyncDispatch("SET_VALIDATION_ERRORS", async () => errors);
            if (Object.values(errors).length) {
              return state;
            }
          }

          return next;
        }
        default:
          return next;
      }
    },
  });

  const email = useField<RegisterInput>("email", "register-1");
  const password = useField<RegisterInput>("password", "register-1");
  const age = useField<RegisterInput>("age", "register-1");
  const name = useField<RegisterInput>("name", "register-1");
  const address = useField<RegisterInput>("address", "register-1");

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          {state.steps.current === 1 && (
            <>
              <label {...name.getLabelProps()}>Name</label>
              <input {...name.getInputProps()} />
              {name.renderError((error) => (
                <span>{error}</span>
              ))}

              <label {...email.getLabelProps()}>Email</label>
              <input {...email.getInputProps()} />
              {email.renderError((error) => (
                <span>{error}</span>
              ))}
            </>
          )}

          {state.steps.current === 2 && (
            <>
              <label {...age.getLabelProps()}>Age</label>
              <input {...age.getInputProps()} type="number" />
              {age.renderError((error) => (
                <span>{error}</span>
              ))}

              <label {...address.getLabelProps()}>Address</label>
              <input {...address.getInputProps()} />
              {address.renderError((error) => (
                <span>{error}</span>
              ))}
            </>
          )}

          {state.steps.current === 3 && (
            <>
              <label {...password.getLabelProps()}>Password</label>
              <input {...password.getInputProps()} type="password" />
              {password.renderError((error) => (
                <span>{error}</span>
              ))}
            </>
          )}

          <button type="submit" disabled={state.steps.canNext}>
            submit
          </button>
        </form>
        <div>
          <p>
            Current step: {state.steps.current} of {state.steps.total}
          </p>
          <button onClick={stepToFirst} disabled={!state.steps.canPrevious}>
            first
          </button>
          <button onClick={stepToPrevious} disabled={!state.steps.canPrevious}>
            back
          </button>
          <button onClick={stepToNext} disabled={!state.steps.canNext}>
            next
          </button>
          <button onClick={stepToLast} disabled={!state.steps.canNext}>
            last
          </button>
        </div>

        {res && <pre>{res}</pre>}
      </div>
    </>
  );
}
