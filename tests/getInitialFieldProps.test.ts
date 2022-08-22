import { getInitialFieldProps } from "../src/core";

const mock = {
  meta: {
    pristine: true,
    hasError: false,
    isTouched: false,
  },
};

describe("getInitialFieldProps", () => {
  it("should output the default field props", () => {
    const values = getInitialFieldProps();

    expect(JSON.stringify(values)).toStrictEqual(JSON.stringify(mock));
  });
});
