"use client";
import { useState } from "react";
import { useField, useForm } from "./react-inverted-form";

interface Form {
  name: string;
  surname: string;
}

export function Form({ data }: { data: Form }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Show Form</button>
      {isOpen && <InnerForm data={data} />}
    </>
  );
}

const InnerForm = ({ data }: { data: Form }) => {
  const { handleSubmit } = useForm<Form>({
    formId: "my-form",
    defaultValues: data,
    onSubmit: async (values) => alert("Submitted: " + JSON.stringify(values)),
  });

  const surnameField = useField<Form, "surname">("surname", "my-form");

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput />
      <input {...surnameField.getInputProps()} />
      <button type="submit">submit</button>
    </form>
  );
};

const CustomInput = () => {
  const field = useField<Form, "name">("name", "my-form");
  const { ...rest } = field.getInputProps();

  return <input {...rest} />;
};
