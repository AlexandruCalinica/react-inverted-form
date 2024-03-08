import { getInitialMetaProps } from "../src/core";

const mock = {
  isSubmitting: false,
  hasSubmitted: false,
  hasInitiated: false,
  attemptedSubmit: false,
  hasDefaultValues: false,
  hasDefaultCurrentStep: false,
  handlers: {
    change: () => undefined,
    blur: () => undefined,
    submit: async () => undefined,
    validate: async () => ({}),
  },
  snapshot: null,
  history: [],
  debug: false,
};

describe("getInitialMetaProps", () => {
  it("should output the default meta props", () => {
    const values = getInitialMetaProps();

    expect(JSON.stringify(values)).toStrictEqual(JSON.stringify(mock));
  });
});
