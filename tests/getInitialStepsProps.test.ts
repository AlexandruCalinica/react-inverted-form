import { getInitialStepsProps } from "../src/core";

const mock = {
  total: 1,
  current: 1,
  canNext: false,
  canPrevious: false,
};

describe("getInitialStepsProps", () => {
  it("should output the default steps props", () => {
    const values = getInitialStepsProps();

    expect(JSON.stringify(values)).toStrictEqual(JSON.stringify(mock));
  });
});
