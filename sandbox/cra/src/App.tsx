import { useForm, useField } from "./react-inverted-form";
import { useState } from "react";

interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: any) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    onChange?.(value);
  };

  return <input onChange={handleChange} value={value} {...props} />;
};

const Options: React.FC<{
  onChange?: (value: any) => void;
  value?: any;
  onBlur?: (value: any) => void;
}> = ({ onChange, onBlur, value }) => {
  const handleClick = (i: number) => () => {
    onChange?.({
      key: i,
      value: `Value for option ${i}`,
    });
    onBlur?.({
      key: i,
      value: `Value for option ${i}`,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick(1)}
        style={{ background: value?.key === 1 ? "salmon" : "unset" }}
      >
        option 1
      </button>
      <button
        type="button"
        onClick={handleClick(2)}
        style={{ background: value?.key === 2 ? "salmon" : "unset" }}
      >
        option 2
      </button>
    </>
  );
};

interface FormState {
  firstname: string;
  surname: string;
  age: number;
  options?: {
    key: number;
    value: string;
  };
}

export default function App() {
  const [res, setRes] = useState("");

  const {
    state,
    handleSubmit,
    stepToNext,
    stepToPrevious,
    stepToFirst,
    stepToLast,
    reset,
  } = useForm<FormState>({
    formId: "foo",
    defaultValues: {
      firstname: "",
      surname: "",
      age: 0,
      options: {
        key: 0,
        value: "",
      },
    },
    totalSteps: 2,
    onSubmit: async (values) => {
      setRes(JSON.stringify(values, null, 4));
    },
  });

  const nameField = useField("firstname", "foo");
  const surnameField = useField("surname", "foo");
  const ageField = useField("age", "foo");
  const optionsField = useField("options", "foo");

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {state.steps?.current === 1 && (
          <>
            <div className="form-element">
              <label {...nameField.getLabelProps()}>Firstname</label>
              <input {...nameField.getInputProps()} />
              {nameField.renderError((error) => (
                <span className="error">{error}</span>
              ))}
            </div>

            <div className="form-element">
              <label {...surnameField.getLabelProps()}>Surname</label>
              <CustomInput {...surnameField.getInputProps()} />
              {surnameField.renderError((error) => (
                <span className="error">{error}</span>
              ))}
            </div>
          </>
        )}

        {state.steps?.current === 2 && (
          <>
            <div className="form-element">
              <label {...ageField.getLabelProps()}>Age</label>
              <input type="number" {...ageField.getInputProps()} />
              {ageField.renderError((error) => (
                <span className="error">{error}</span>
              ))}
            </div>

            {!!state?.values?.age && (
              <div className="form-element">
                <label {...optionsField.getLabelProps()}>Options</label>
                <Options {...optionsField.getInputProps()} />
                {optionsField.renderError((error) => (
                  <span className="error">{error}</span>
                ))}
              </div>
            )}
          </>
        )}

        <div className="form-step-controlls">
          <button
            disabled={!state.steps?.canPrevious}
            type="button"
            onClick={stepToFirst}
          >{`<< first`}</button>
          <button
            disabled={!state.steps?.canPrevious}
            type="button"
            onClick={stepToPrevious}
          >{`< prev`}</button>
          <button
            disabled={!state.steps?.canNext}
            type="button"
            onClick={stepToNext}
          >{`next >`}</button>
          <button
            disabled={!state.steps?.canNext}
            type="button"
            onClick={stepToLast}
          >{`last >>`}</button>
        </div>

        <button type="submit">Submit</button>
      </form>
      <button onClick={reset}>reset</button>

      {res && <pre>{res}</pre>}
    </div>
  );
}
