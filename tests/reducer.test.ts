import * as core from "../src/core";

interface TestShape {
  name: string;
}

describe("reducer", () => {
  const { reducer, getInitialState } = core;
  const initialState = getInitialState<TestShape>();

  const stateWithField = reducer<TestShape>(initialState, {
    type: "REGISTER_FIELD",
    payload: "name",
  });

  test("INIT", () => {
    const nextState = reducer<TestShape>(initialState, { type: "INIT" });

    expect(JSON.stringify(nextState)).toBe(
      JSON.stringify({
        ...initialState,
        form: {
          ...initialState.form,
          hasInitiated: true,
        },
      })
    );
  });

  test("INIT with debug", () => {
    const nextState = reducer<TestShape>(initialState, {
      type: "INIT",
      payload: { debug: true },
    });

    expect(JSON.stringify(nextState)).toBe(
      JSON.stringify({
        ...initialState,
        form: {
          ...initialState.form,
          hasInitiated: true,
          debug: true,
          history: [{ type: "INIT", payload: { debug: true } }],
        },
      })
    );
  });

  test("REGISTER_FIELD", () => {
    const nextState = reducer<TestShape>(initialState, {
      type: "REGISTER_FIELD",
      payload: "name",
    });

    expect(nextState).toHaveProperty("values.name");
    expect(nextState.values["name"]).toBe(null);
    expect(nextState).toHaveProperty("fields.name");
    expect(nextState.fields["name"]).toStrictEqual({
      meta: {
        hasError: false,
        isTouched: false,
        pristine: true,
      },
    });
  });

  test("SET_DEFAULT_VALUES", () => {
    const nextState = reducer<TestShape>(initialState, {
      type: "SET_DEFAULT_VALUES",
      payload: { name: "John Doe" },
    });

    expect(nextState).toHaveProperty("values.name");
    expect(nextState.values["name"]).toBe("John Doe");
    expect(nextState).not.toHaveProperty("fields.name");
    expect(nextState).toHaveProperty("form.hasDefaultValues");
    expect(nextState.form.hasDefaultValues).toBe(true);
  });

  test("SET_HANDLERS", () => {
    const mockHandlers = {
      change: jest.fn(),
      blur: jest.fn(),
      submit: jest.fn(),
      validate: jest.fn(),
    };
    const nextState = reducer<TestShape>(initialState, {
      type: "SET_HANDLERS",
      payload: mockHandlers,
    });

    expect(nextState).toHaveProperty("form.handlers");
    expect(nextState.form.handlers).toStrictEqual(mockHandlers);
  });

  test("FIELD_CHANGE", () => {
    const nextState = reducer<TestShape>(stateWithField, {
      type: "FIELD_CHANGE",
      payload: {
        name: "name",
        value: "Changed value",
      },
    });

    expect(nextState.values).toHaveProperty("name");
    expect(nextState.values["name"]).toBe("Changed value");
  });

  test("SET_FIELD_PRISTINE", () => {
    expect(stateWithField.fields["name"].meta.pristine).toBe(true);

    const nextState = reducer<TestShape>(stateWithField, {
      type: "SET_FIELD_PRISTINE",
      payload: {
        name: "name",
        pristine: false,
      },
    });

    expect(nextState.fields).toHaveProperty("name");
    expect(nextState.fields["name"].meta.pristine).toBe(false);
  });

  test("FIELD_BLUR", () => {
    const nextState = reducer<TestShape>(stateWithField, {
      type: "FIELD_BLUR",
      payload: {
        name: "name",
        value: "John Doe",
      },
    });

    expect(nextState.values).toHaveProperty("name");
    expect(nextState.values["name"]).toBe("John Doe");
  });

  test("SET_FIELD_TOUCHED", () => {
    const nextState = reducer<TestShape>(stateWithField, {
      type: "SET_FIELD_TOUCHED",
      payload: {
        name: "name",
        isTouched: true,
      },
    });

    expect(nextState.fields).toHaveProperty("name");
    expect(nextState.fields["name"].meta.isTouched).toBe(true);
  });

  test("SET_VALIDATION_ERRORS", () => {
    const nextState = reducer<TestShape>(stateWithField, {
      type: "SET_VALIDATION_ERRORS",
      payload: {
        name: "This is a validation error.",
      },
    });

    expect(nextState.fields).toHaveProperty("name");
    expect(nextState.fields["name"]).toHaveProperty("error");
    expect(nextState.fields["name"].meta).toHaveProperty("hasError");
    expect(nextState.fields["name"].meta.hasError).toBe(true);
    expect(nextState.fields["name"].error).toBe("This is a validation error.");

    const nextState2 = reducer<TestShape>(nextState, {
      type: "SET_VALIDATION_ERRORS",
      payload: {},
    });

    expect(nextState2.fields).toHaveProperty("name");
    expect(nextState2.fields["name"]).not.toHaveProperty("error");
    expect(nextState.fields["name"].meta).toHaveProperty("hasError");
    expect(nextState.fields["name"].meta.hasError).toBe(true);
  });

  test("IS_SUBMITTING", () => {
    expect(initialState.form.isSubmitting).toBe(false);

    const nextState = reducer<TestShape>(initialState, {
      type: "IS_SUBMITTING",
    });

    expect(nextState.form.isSubmitting).toBe(true);
  });

  test("HAS_SUBMITTED", () => {
    expect(initialState.form.hasSubmitted).toBe(false);
    const s1 = reducer<TestShape>(initialState, {
      type: "IS_SUBMITTING",
    });
    expect(s1.form.isSubmitting).toBe(true);

    const nextState = reducer<TestShape>(s1, {
      type: "HAS_SUBMITTED",
    });

    expect(nextState.form.hasSubmitted).toBe(true);
    expect(nextState.form.isSubmitting).toBe(false);
  });

  test("ATTEMPTED_SUBMIT", () => {
    expect(initialState.form.attemptedSubmit).toBe(false);

    const nextState = reducer<TestShape>(initialState, {
      type: "ATTEMPTED_SUBMIT",
    });

    expect(nextState.form.attemptedSubmit).toBe(true);
  });

  test("SET_TOTAL_STEPS", () => {
    expect(initialState.steps.total).toBe(1);

    const nextState = reducer<TestShape>(initialState, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });

    expect(nextState.steps.total).toBe(3);
  });

  test("SET_DEFAULT_CURRENT_STEP", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_DEFAULT_CURRENT_STEP",
      payload: 2,
    });

    expect(s1.steps.current).toBe(2);
    expect(s1.steps.canNext).toBe(false);
    expect(s1.steps.canPrevious).toBe(true);
    expect(s1.form.hasDefaultCurrentStep).toBe(true);

    const s2 = reducer<TestShape>(
      {
        ...initialState,
        steps: {
          ...initialState.steps,
          total: 3,
        },
      },
      {
        type: "SET_DEFAULT_CURRENT_STEP",
        payload: 2,
      }
    );

    expect(s2.steps.current).toBe(2);
    expect(s2.steps.canNext).toBe(true);
    expect(s2.steps.canPrevious).toBe(true);
    expect(s2.form.hasDefaultCurrentStep).toBe(true);
  });

  test("SET_CURRENT_STEP", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_CURRENT_STEP",
      payload: 2,
    });

    expect(s1.steps.current).toBe(2);
    expect(s1.steps.canNext).toBe(false);
    expect(s1.steps.canPrevious).toBe(true);
    expect(s1.form.hasDefaultCurrentStep).toBe(false);

    const s2 = reducer<TestShape>(
      {
        ...initialState,
        steps: {
          ...initialState.steps,
          total: 3,
        },
      },
      {
        type: "SET_CURRENT_STEP",
        payload: 2,
      }
    );

    expect(s2.steps.current).toBe(2);
    expect(s2.steps.canNext).toBe(true);
    expect(s2.steps.canPrevious).toBe(true);
    expect(s2.form.hasDefaultCurrentStep).toBe(false);
  });

  test("STEP_TO_NEXT", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });
    const s2 = reducer<TestShape>(s1, {
      type: "STEP_TO_NEXT",
    });

    expect(s2.steps.current).toBe(2);
    expect(s2.steps.canNext).toBe(true);
    expect(s2.steps.canPrevious).toBe(true);

    const s3 = reducer<TestShape>(s2, {
      type: "STEP_TO_NEXT",
    });
    expect(s3.steps.current).toBe(3);
    expect(s3.steps.canNext).toBe(false);
    expect(s3.steps.canPrevious).toBe(true);
  });

  test("STEP_TO_PREVIOUS", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });
    const s2 = reducer<TestShape>(s1, {
      type: "SET_DEFAULT_CURRENT_STEP",
      payload: 3,
    });
    const s3 = reducer<TestShape>(s2, {
      type: "STEP_TO_PREVIOUS",
    });

    expect(s3.steps.current).toBe(2);
    expect(s3.steps.canNext).toBe(true);
    expect(s3.steps.canPrevious).toBe(true);

    const s4 = reducer<TestShape>(s3, {
      type: "STEP_TO_PREVIOUS",
    });

    expect(s4.steps.current).toBe(1);
    expect(s4.steps.canNext).toBe(true);
    expect(s4.steps.canPrevious).toBe(false);
  });

  test("STEP_TO_FIRST", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });
    const s2 = reducer<TestShape>(s1, {
      type: "SET_DEFAULT_CURRENT_STEP",
      payload: 3,
    });
    const s3 = reducer<TestShape>(s2, {
      type: "STEP_TO_FIRST",
    });

    expect(s3.steps.current).toBe(1);
    expect(s3.steps.canNext).toBe(true);
    expect(s3.steps.canPrevious).toBe(false);
  });

  test("STEP_TO_LAST", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });
    const s2 = reducer<TestShape>(s1, {
      type: "STEP_TO_LAST",
    });

    expect(s2.steps.current).toBe(3);
    expect(s2.steps.canNext).toBe(false);
    expect(s2.steps.canPrevious).toBe(true);
  });

  test("SNAPSHOT_STATE", () => {
    const s = reducer<TestShape>(initialState, {
      type: "SNAPSHOT_STATE",
    });

    expect(JSON.stringify(s.form.snapshot)).toEqual(
      JSON.stringify({
        values: { ...initialState.values },
        fields: { ...initialState.fields },
        steps: { ...initialState.steps },
        form: {
          ...initialState.form,
          snapshot: null,
          history: [],
          debug: false,
        },
      })
    );
  });

  test("RESET", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "REGISTER_FIELD",
      payload: {
        name: "name",
      },
    });
    const s2 = reducer<TestShape>(s1, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });
    const s3 = reducer<TestShape>(s2, {
      type: "SET_DEFAULT_CURRENT_STEP",
      payload: 2,
    });
    const s4 = reducer<TestShape>(s3, {
      type: "SET_DEFAULT_VALUES",
      payload: {
        name: "John Doe",
      },
    });
    const s5 = reducer<TestShape>(s4, {
      type: "SNAPSHOT_STATE",
    });
    const s6 = reducer<TestShape>(s5, {
      type: "FIELD_CHANGE",
      payload: {
        name: "name",
        value: "Jane Doe changed",
      },
    });
    const s7 = reducer<TestShape>(s6, {
      type: "RESET",
    });

    expect(JSON.stringify(s7)).toEqual(JSON.stringify(s4));
  });

  test("Debug mode", () => {
    const s1 = reducer<TestShape>(initialState, {
      type: "INIT",
      payload: { debug: true },
    });

    const s2 = reducer<TestShape>(s1, {
      type: "REGISTER_FIELD",
      payload: {
        name: "name",
      },
    });
    const s3 = reducer<TestShape>(s2, {
      type: "FIELD_CHANGE",
      payload: {
        name: "name",
        value: "John Doe",
      },
    });
    const s4 = reducer<TestShape>(s3, {
      type: "SET_TOTAL_STEPS",
      payload: 3,
    });

    expect(JSON.stringify(s4)).toBe(
      JSON.stringify({
        ...s4,
        form: {
          ...initialState.form,
          debug: true,
          hasInitiated: true,
          history: [
            { type: "INIT", payload: { debug: true } },
            { type: "REGISTER_FIELD", payload: { name: "name" } },
            {
              type: "FIELD_CHANGE",
              payload: { name: "name", value: "John Doe" },
            },
            { type: "SET_TOTAL_STEPS", payload: 3 },
          ],
        },
      })
    );
  });
});
