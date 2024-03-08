import "./index.css";
import { useState } from "react";
import { useForm, useField } from "../../react-inverted-form";

type LoginInput = {
  email: string;
  password: string;
};

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit } = useForm<LoginInput>({
    formId: "login",
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
  });

  const email = useField<LoginInput>("email", "login");
  const password = useField<LoginInput>("password", "login");

  return (
    <form onSubmit={handleSubmit}>
      <label {...email.getLabelProps()}>Email</label>
      <input {...email.getInputProps()} />

      <label {...password.getLabelProps()}>Password</label>
      <input {...password.getInputProps()} type="password" />

      <button type="submit">submit</button>

      {res && <pre>{res}</pre>}
    </form>
  );
}
