import "./index.css";
import { useState } from "react";
import { IsNotEmpty, Validate } from "class-validator";

import { useForm, useField } from "../../react-inverted-form";
import { createClassValidator } from "../../validators/class-validator";

import { CustomProps } from "./CustomValidator";
import { CustomData, CustomFormElement } from "./CustomFormElement";

class FormOne {
  @IsNotEmpty()
  name = "";

  @IsNotEmpty()
  password = "";

  @Validate(CustomProps, [3])
  preferences: CustomData = {
    age: 0,
    address: "",
    preference: "",
  };
}

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit } = useForm<FormOne>({
    formId: "myForm",
    defaultValues: {
      name: "",
      password: "",
      preferences: {
        age: 0,
        address: "",
        preference: "",
      },
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createClassValidator(FormOne),
  });

  const name = useField<FormOne>("name", "myForm");
  const password = useField<FormOne>("password", "myForm");

  return (
    <form onSubmit={handleSubmit}>
      <label {...name.getLabelProps()}>Name</label>
      <input {...name.getInputProps()} />
      {name.renderError((error) => (
        <span>{error}</span>
      ))}

      <label {...password.getLabelProps()}>Password</label>
      <input {...password.getInputProps()} type="password" />
      {password.renderError((error) => (
        <span>{error}</span>
      ))}

      <CustomFormElement name="preferences" formId="myForm" />

      <button type="submit">submit one</button>

      {res && <pre>{res}</pre>}
    </form>
  );
}
