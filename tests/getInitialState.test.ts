import { getInitialState } from "../src/core";
import { mockState } from "./mocks";

describe("getInitialState", () => {
  it("should output default state", () => {
    const values = getInitialState();

    expect(JSON.stringify(values)).toBe(JSON.stringify(mockState));
  });
});
