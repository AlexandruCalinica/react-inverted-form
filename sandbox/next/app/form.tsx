"use client";
import { useField, useForm } from "./react-inverted-form";

interface Form {
  name: string;
  surname: string;
}

export function Form({ data }: { data: Form }) {
  const { handleSubmit } = useForm<Form>({
    formId: "my-form",
    defaultValues: data,
    onSubmit: async (values) => alert("Submitted: " + JSON.stringify(values)),
  });

  const nameField = useField<Form, "name">("name", "my-form");
  const surnameField = useField<Form, "surname">("surname", "my-form");

  return (
    <form onSubmit={handleSubmit}>
      <input {...nameField.getInputProps()} />
      <input {...surnameField.getInputProps()} />
      <button type="submit" />
    </form>
  );
}
