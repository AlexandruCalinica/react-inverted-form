import {
  useState,
  cloneElement,
  isValidElement,
  PropsWithChildren,
} from "react";
import { IsNotEmpty, IsEmail } from "class-validator";

import { useForm, useField } from "../../react-inverted-form";
import { createClassValidator } from "../../validators/class-validator";

interface FormElementProps<T> {
  name: keyof T;
  label: any;
  formId: string;
}

function FormElement<T extends object>({
  name,
  label,
  formId,
  children,
}: PropsWithChildren<FormElementProps<T>>) {
  const { getInputProps, getLabelProps, renderError } = useField<T>(
    name,
    formId
  );

  if (!isValidElement(children)) return null;

  return (
    <>
      <label {...getLabelProps()}>{label}</label>
      {cloneElement(children, getInputProps())}
      {renderError((error) => (
        <span>{error}</span>
      ))}
    </>
  );
}

class RegisterForm {
  @IsEmail()
  email = "";

  @IsNotEmpty()
  password = "";

  @IsNotEmpty()
  age = "";

  @IsNotEmpty()
  name = "";

  @IsNotEmpty()
  address = "";
}

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit } = useForm<RegisterForm>({
    formId: "register",
    defaultValues: {
      email: "",
      password: "",
      age: "",
      name: "",
      address: "",
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createClassValidator(RegisterForm),
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormElement<RegisterForm> name="name" label="Name" formId="register">
        <input />
      </FormElement>

      <FormElement<RegisterForm> name="email" label="Email" formId="register">
        <input />
      </FormElement>

      <FormElement<RegisterForm> name="age" label="Age" formId="register">
        <input type="number" />
      </FormElement>

      <FormElement<RegisterForm>
        name="password"
        label="Password"
        formId="register"
      >
        <input type="password" />
      </FormElement>

      <FormElement<RegisterForm>
        name="address"
        label="Address"
        formId="register"
      >
        <input />
      </FormElement>
      <button type="submit">submit</button>

      {res && <pre>{res}</pre>}
    </form>
  );
}
