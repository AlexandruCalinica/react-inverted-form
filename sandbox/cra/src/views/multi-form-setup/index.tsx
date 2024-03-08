import "./index.css";
import { useState } from "react";
import { useForm, useField } from "../../react-inverted-form";

type FormOne = {
  name: string;
  password: string;
};

type FormTwo = {
  age: string;
  email: string;
  address: string;
};

export default function App() {
  const [res1, setRes1] = useState("");
  const [res2, setRes2] = useState("");

  const formOne = useForm<FormOne>({
    formId: "formOne",
    defaultValues: {
      name: "",
      password: "",
    },
    onSubmit: async (values) => setRes1(JSON.stringify(values)),
  });

  const formTwo = useForm<FormTwo>({
    formId: "formTwo",
    defaultValues: {
      age: "",
      email: "",
      address: "",
    },
    onSubmit: async (values) => setRes2(JSON.stringify(values)),
  });

  const name = useField<FormOne>("name", "formOne");
  const password = useField<FormOne>("password", "formOne");

  const age = useField<FormTwo>("age", "formTwo");
  const address = useField<FormTwo>("address", "formTwo");
  const email = useField<FormTwo>("email", "formTwo");

  return (
    <div>
      <p>Form One</p>
      <form onSubmit={formOne.handleSubmit}>
        <label {...name.getLabelProps()}>Name</label>
        <input {...name.getInputProps()} />

        <label {...password.getLabelProps()}>Password</label>
        <input {...password.getInputProps()} type="password" />

        <button type="submit">submit one</button>
      </form>

      {res1 && <pre>{res1}</pre>}

      <p>Form Two</p>
      <form onSubmit={formTwo.handleSubmit}>
        <label {...age.getLabelProps()}>Age</label>
        <input {...age.getInputProps()} type="number" />

        <label {...address.getLabelProps()}>Address</label>
        <input {...address.getInputProps()} />

        <label {...email.getLabelProps()}>Email</label>
        <input {...email.getInputProps()} />

        <button type="submit">submit two</button>
      </form>

      {res2 && <pre>{res2}</pre>}
    </div>
  );
}
