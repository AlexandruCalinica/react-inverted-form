import "./index.css";
import { useState } from "react";

import { object, string } from "yup";
import { createYupValidator } from "../../validators/yup";
import { useForm, useField } from "../../react-inverted-form";

type LoginInput = {
  email: string;
  password: string;
};

const formSchema = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
});

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit } = useForm<LoginInput>({
    formId: "login-4",
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createYupValidator(formSchema),
  });

  const email = useField<LoginInput>("email", "login-4");
  const password = useField<LoginInput>("password", "login-4");

  return (
    <form onSubmit={handleSubmit}>
      <label {...email.getLabelProps()}>Email</label>
      <input {...email.getInputProps()} />
      {email.renderError((error) => (
        <span>{error}</span>
      ))}

      <label {...password.getLabelProps()}>Password</label>
      <input {...password.getInputProps()} type="password" />
      {password.renderError((error) => (
        <span>{error}</span>
      ))}

      <button type="submit">submit</button>

      {res && <pre>{res}</pre>}
    </form>
  );
}
