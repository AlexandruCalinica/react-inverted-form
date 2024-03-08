import "./index.css";
import { useState } from "react";

import { IsNotEmpty, IsEmail } from "class-validator";
import { useForm, useField } from "../../react-inverted-form";
import { createClassValidator } from "../../validators/class-validator";

class LoginInput {
  @IsEmail()
  email = "";

  @IsNotEmpty()
  password = "";
}

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit } = useForm<LoginInput>({
    formId: "login-3",
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createClassValidator(LoginInput),
  });

  const email = useField<LoginInput>("email", "login-3");
  const password = useField<LoginInput>("password", "login-3");

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
