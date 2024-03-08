import { useState } from "react";
import { IsNotEmpty } from "class-validator";

import { useForm, useField } from "../../react-inverted-form";
import { createClassValidator } from "../../validators/class-validator";

class RegisterInput {
  @IsNotEmpty()
  age = "";

  @IsNotEmpty()
  title = "";
}

export default function App() {
  const [res, setRes] = useState("");

  const { handleSubmit, asyncDispatch } = useForm<RegisterInput>({
    formId: "register-2",
    defaultValues: {
      age: "",
      title: "fill in age first...",
    },
    onSubmit: async (values) => setRes(JSON.stringify(values)),
    validator: createClassValidator(RegisterInput),
    stateReducer: (_, action, next) => {
      switch (action.type) {
        case "FIELD_CHANGE":
          if (action.payload.name === "age") {
            asyncDispatch("FIELD_CHANGE", async () => ({
              name: "title",
              value: action.payload.value >= 18 ? "Major" : "Minor",
            }));
          }
          return next;
        default:
          return next;
      }
    },
  });

  const age = useField<RegisterInput>("age", "register-2");
  const title = useField<RegisterInput>("title", "register-2");

  return (
    <form onSubmit={handleSubmit}>
      <label {...age.getLabelProps()}>Age</label>
      <input {...age.getInputProps()} type="number" />
      {age.renderError((error) => (
        <span>{error}</span>
      ))}

      <label {...title.getLabelProps()}>Title</label>
      <input {...title.getInputProps()} readOnly disabled />
      {title.renderError((error) => (
        <span>{error}</span>
      ))}

      <button type="submit">submit</button>

      {res && <pre>{res}</pre>}
    </form>
  );
}
