import { Observable, Subscription } from "rxjs";

import { Store } from "../src/store";
import { mockState } from "./mocks";
import { FormState } from "../src/types";

describe("Store", () => {
  const store = new Store();

  it("should instantiate", () => {
    expect(store).toBeInstanceOf(Store);
  });
  it("should have init method implemented", () => {
    expect(store).toHaveProperty("init");
    expect(typeof store.init).toBe("function");
  });
  it("should have setReducer method implemented", () => {
    expect(store).toHaveProperty("setReducer");
    expect(typeof store.setReducer).toBe("function");
  });
  it("should have select method implemented", () => {
    expect(store).toHaveProperty("select");
    expect(typeof store.select).toBe("function");
  });
  it("should have selectValue method implemented", () => {
    expect(store).toHaveProperty("selectValue");
    expect(typeof store.selectValue).toBe("function");
  });
  it("should have selectField method implemented", () => {
    expect(store).toHaveProperty("selectField");
    expect(typeof store.selectField).toBe("function");
  });
  it("should have subscribe method implemented", () => {
    expect(store).toHaveProperty("subscribe");
    expect(typeof store.subscribe).toBe("function");
  });
  it("should have dispatch method implemented", () => {
    expect(store).toHaveProperty("dispatch");
    expect(typeof store.dispatch).toBe("function");
  });
  it("should have asyncDispatch method implemented", () => {
    expect(store).toHaveProperty("asyncDispatch");
    expect(typeof store.asyncDispatch).toBe("function");
  });
});

describe("Store instance methods", () => {
  describe("init", () => {
    const store = new Store<FormState<any>>();
    const initSpy = jest.spyOn(store, "init");

    const res = store.init("foo");

    afterAll(() => {
      initSpy.mockReset();
    });

    it("should be callable", () => {
      expect(initSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(initSpy).toHaveBeenCalledWith("foo");
    });
    it("should return undefined when called", () => {
      expect(res).toBeUndefined();
    });
  });

  describe("setReducer", () => {
    const store = new Store<FormState<any>>();
    const setReducerSpy = jest.spyOn(store, "setReducer");
    const mockReducerFn = jest.fn(
      (_initialReducer) => (state: any, _action: any) => state
    );

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.setReducer("foo", mockReducerFn)).toThrow();
    });

    store.init("foo");
    const res = store.setReducer("foo", mockReducerFn);

    afterAll(() => {
      setReducerSpy.mockReset();
    });

    it("should be callable", () => {
      expect(setReducerSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(setReducerSpy).toHaveBeenCalledWith("foo", mockReducerFn);
    });
    it("should return undefined when called", () => {
      expect(res).toBeUndefined();
    });
  });

  describe("select", () => {
    const store = new Store<FormState<any>>();
    const selectSpy = jest.spyOn(store, "select");

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.select("foo", "values")).toThrow();
    });

    store.init("foo");
    const res = store.select("foo", "values");

    afterAll(() => {
      selectSpy.mockReset();
    });

    it("should be callable", () => {
      expect(selectSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(selectSpy).toHaveBeenCalledWith("foo", "values");
    });
    it("should return an Observable when called", () => {
      expect(res).not.toBeUndefined();
      expect(res).toBeInstanceOf(Observable);
    });
  });

  describe("selectValue", () => {
    const store = new Store<FormState<any>>();
    const selectValueSpy = jest.spyOn(store, "selectValue");

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.selectValue("foo", "name")).toThrow();
    });

    store.init("foo");
    const res = store.selectValue("foo", "name");

    afterAll(() => {
      selectValueSpy.mockReset();
    });

    it("should be callable", () => {
      expect(selectValueSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(selectValueSpy).toHaveBeenCalledWith("foo", "name");
    });
    it("should return an Observable when called", () => {
      expect(res).not.toBeUndefined();
      expect(res).toBeInstanceOf(Observable);
    });
  });

  describe("selectField", () => {
    const store = new Store<FormState<any>>();
    const selectFieldSpy = jest.spyOn(store, "selectField");

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.selectField("foo", "name")).toThrow();
    });

    store.init("foo");
    const res = store.selectField("foo", "name");

    afterAll(() => {
      selectFieldSpy.mockReset();
    });

    it("should be callable", () => {
      expect(selectFieldSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(selectFieldSpy).toHaveBeenCalledWith("foo", "name");
    });
    it("should return an Observable when called", () => {
      expect(res).not.toBeUndefined();
      expect(res).toBeInstanceOf(Observable);
    });
  });

  describe("subscribe", () => {
    const store = new Store<FormState<any>>();
    const subscribeSpy = jest.spyOn(store, "subscribe");
    const mockSubFn = jest.fn((_next) => undefined);
    const mockk = jest.fn(() => mockState);

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.subscribe("foo", mockSubFn)).toThrow();
    });

    store.init("foo");
    const res = store.subscribe("foo", mockSubFn);

    afterAll(() => {
      subscribeSpy.mockReset();
    });

    it("should be callable", () => {
      expect(subscribeSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(subscribeSpy).toHaveBeenCalledWith("foo", mockSubFn);
    });
    it("should return a Subscription when called", () => {
      expect(res).not.toBeUndefined();
      expect(res).toBeInstanceOf(Subscription);
    });
    it("should call the subscribe callback function once", () => {
      expect(mockSubFn).toHaveBeenCalled();
      expect(JSON.stringify(mockSubFn.mock.calls[0][0])).toBe(
        JSON.stringify(mockState)
      );
    });
  });

  describe("dispatch", () => {
    const store = new Store<FormState<any>>();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() => store.dispatch("foo", { type: "INIT" })).toThrow();
    });

    store.init("foo");
    const res = store.dispatch("foo", { type: "INIT" });

    afterAll(() => {
      dispatchSpy.mockReset();
    });

    it("should be callable", () => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(dispatchSpy).toHaveBeenCalledWith("foo", { type: "INIT" });
    });
    it("should return undefined when called", () => {
      expect(res).toBeUndefined();
    });
  });

  describe("asyncDispatch", () => {
    const store = new Store<FormState<any>>();
    const dispatchSpy = jest.spyOn(store, "asyncDispatch");
    const mockPromise = jest.fn(() => Promise.resolve(true));

    it("should throw if prerequisites are not met", () => {
      const store = new Store<FormState<any>>();
      expect(() =>
        store.asyncDispatch("foo", "INIT", mockPromise)
      ).rejects.toThrow();
    });

    store.init("foo");
    const res = store.asyncDispatch("foo", "INIT", mockPromise);

    afterAll(() => {
      dispatchSpy.mockReset();
    });

    it("should be callable", () => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
    it("should be called with 1 argument", () => {
      expect(dispatchSpy).toHaveBeenCalledWith("foo", "INIT", mockPromise);
    });
    it("should return undefined when called", () => {
      expect(res).resolves.toBeUndefined();
    });
  });
});
