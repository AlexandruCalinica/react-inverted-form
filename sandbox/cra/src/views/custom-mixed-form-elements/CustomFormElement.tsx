import { ChangeEventHandler } from "react";

import { useField } from "../../react-inverted-form";

export class CustomData {
  age = 0;
  address = "";
  preference = "";
}

interface CustomFormElementProps {
  name: string;
  formId: string;
}

export const CustomFormElement = ({ name, formId }: CustomFormElementProps) => {
  const { getInputProps, renderError } = useField(name, formId);
  const { value, onChange, onBlur } = getInputProps();

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    onChange?.({ ...value, [e.target.name]: e.target.value });
  };
  const handleBlur: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (
    e
  ) => {
    onBlur?.({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="customInput">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          onBlur={handleBlur}
          value={value?.["age"]}
          onChange={handleChange}
        />

        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          onBlur={handleBlur}
          onChange={handleChange}
          value={value?.["address"]}
        />

        <label htmlFor="preference">Preference</label>
        <select
          id="preference"
          name="preference"
          onBlur={handleBlur}
          onChange={handleChange}
          value={value?.["preference"]}
        >
          <option>foo</option>
          <option>baz</option>
          <option>bar</option>
        </select>
      </div>
      {renderError((error) => (
        <span>{error}</span>
      ))}
    </>
  );
};
