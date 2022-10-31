import { getStoreHandlers } from "../src/handlers";
import { Store } from "../src/store";
import { FormState } from "../src/types";
import { mockState } from "./mocks";

describe("Store handlers", () => {
  describe("prerequisites", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");

    const handlers = getStoreHandlers("foo", store);

    it('should have "registerField" handler', () => {
      expect(handlers).toHaveProperty("registerField");
    });
    it('should have "setDefaultValues" handler', () => {
      expect(handlers).toHaveProperty("setDefaultValues");
    });
    it('should contain "setHandlers" handler', () => {
      expect(handlers).toHaveProperty("setHandlers");
    });
    it('should contain "setValidationErrors" handler', () => {
      expect(handlers).toHaveProperty("setValidationErrors");
    });
    it('should contain "setTotalSteps" handler', () => {
      expect(handlers).toHaveProperty("setTotalSteps");
    });
    it('should contain "setTotalSteps" handler', () => {
      expect(handlers).toHaveProperty("setTotalSteps");
    });
    it('should contain "setDefaultCurrentStep" handler', () => {
      expect(handlers).toHaveProperty("setDefaultCurrentStep");
    });
    it('should contain "setCurrentStep" handler', () => {
      expect(handlers).toHaveProperty("setCurrentStep");
    });
    it('should contain "stepToNext" handler', () => {
      expect(handlers).toHaveProperty("stepToNext");
    });
    it('should contain "stepToPrevious" handler', () => {
      expect(handlers).toHaveProperty("stepToPrevious");
    });
    it('should contain "stepToFirst" handler', () => {
      expect(handlers).toHaveProperty("stepToFirst");
    });
    it('should contain "stepToLast" handler', () => {
      expect(handlers).toHaveProperty("stepToLast");
    });
    it('should contain "validate" handler', () => {
      expect(handlers).toHaveProperty("setHandlers");
    });
    it('should contain "handleChangeCallback" handler', () => {
      expect(handlers).toHaveProperty("handleChangeCallback");
    });
    it('should contain "handleFieldBlur" handler', () => {
      expect(handlers).toHaveProperty("handleFieldBlur");
    });
    it('should contain "handleSubmit" handler', () => {
      expect(handlers).toHaveProperty("handleSubmit");
    });
    it('should contain "asyncDispatch" handler', () => {
      expect(handlers).toHaveProperty("asyncDispatch");
    });
    it('should contain "snapshotState" handler', () => {
      expect(handlers).toHaveProperty("snapshotState");
    });
    it('should contain "reset" handler', () => {
      expect(handlers).toHaveProperty("reset");
    });
  });

  describe("registerField", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const registerFieldSpy = jest.spyOn(handlers, "registerField");

    afterAll(() => {
      registerFieldSpy.mockReset();
      handlers.registerField("name");
    });

    handlers.registerField("name");
    it("should be callable", () => {
      expect(registerFieldSpy).toHaveBeenCalled();
      expect(registerFieldSpy).toHaveBeenCalledWith("name");
    });

    it("should register a field in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.values).toHaveProperty("name");
          expect(next.values["name"]).toBe(null);
          expect(next.fields).toHaveProperty("name");
          expect(next.fields["name"]).toEqual({
            meta: {
              pristine: true,
              hasError: false,
              isTouched: false,
            },
          });
        })
        .unsubscribe();
    });
  });

  describe("setDefaultValues", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setDefaultValuesSpy = jest.spyOn(handlers, "setDefaultValues");

    afterAll(() => {
      setDefaultValuesSpy.mockReset();
    });

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });

    it("should be callable", () => {
      expect(setDefaultValuesSpy).toHaveBeenCalled();
      expect(setDefaultValuesSpy).toHaveBeenCalledWith({ name: "John Doe" });
    });

    it("should set default values in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.values).toHaveProperty("name");
          expect(next.values["name"]).toBe("John Doe");

          expect(next.fields["name"]).toStrictEqual({
            meta: {
              pristine: true,
              hasError: false,
              isTouched: false,
            },
          });

          expect(next.form.hasDefaultValues).toBe(true);
        })
        .unsubscribe();
    });
  });

  describe("setValidationErrors", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setValidationErrorsSpy = jest.spyOn(handlers, "setValidationErrors");

    afterAll(() => {
      setValidationErrorsSpy.mockReset();
    });

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });
    handlers.setValidationErrors({ name: "This is an error" });

    it("should be callable", () => {
      expect(setValidationErrorsSpy).toHaveBeenCalled();
      expect(setValidationErrorsSpy).toHaveBeenCalledWith({
        name: "This is an error",
      });
    });

    it("should set validation errors in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.values).toHaveProperty("name");
          expect(next.values["name"]).toBe("John Doe");
          expect(next.fields["name"]).toHaveProperty("error");
          expect(next.fields["name"].error).toBe("This is an error");
          expect(next.fields["name"].meta.hasError).toBe(true);
        })
        .unsubscribe();
    });
  });

  describe("setHandlers", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setHandlersSpy = jest.spyOn(handlers, "setHandlers");

    afterAll(() => {
      setHandlersSpy.mockReset();
    });

    const payload = {
      change: jest.fn(),
      blur: jest.fn(),
      submit: jest.fn(),
      validate: jest.fn(),
    };

    handlers.setHandlers(payload);

    it("should be callable", () => {
      expect(setHandlersSpy).toHaveBeenCalled();
      expect(setHandlersSpy).toHaveBeenCalledWith(payload);
    });

    it("should set handlers in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.form.handlers).toEqual(payload);
        })
        .unsubscribe();
    });
  });

  describe("setTotalSteps", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setTotalStepsSpy = jest.spyOn(handlers, "setTotalSteps");

    afterAll(() => {
      setTotalStepsSpy.mockReset();
    });

    handlers.setTotalSteps(3);

    it("should be callable", () => {
      expect(setTotalStepsSpy).toHaveBeenCalled();
      expect(setTotalStepsSpy).toHaveBeenCalledWith(3);
    });

    it("should set total steps in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.total).toBe(3);
        })
        .unsubscribe();
    });
  });

  describe("setDefaultCurrentStep", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setDefaultCurrentStepSpi = jest.spyOn(
      handlers,
      "setDefaultCurrentStep"
    );

    afterAll(() => {
      setDefaultCurrentStepSpi.mockReset();
    });

    handlers.setTotalSteps(3);
    handlers.setDefaultCurrentStep(2);

    it("should be callable", () => {
      expect(setDefaultCurrentStepSpi).toHaveBeenCalled();
      expect(setDefaultCurrentStepSpi).toHaveBeenCalledWith(2);
    });

    it("should set default current step in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(2);
          expect(next.form.hasDefaultCurrentStep).toBe(true);
        })
        .unsubscribe();
    });
  });

  describe("setCurrentStep", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const setCurrentStepSpi = jest.spyOn(handlers, "setCurrentStep");

    afterAll(() => {
      setCurrentStepSpi.mockReset();
    });

    handlers.setTotalSteps(3);
    handlers.setCurrentStep(2);

    it("should be callable", () => {
      expect(setCurrentStepSpi).toHaveBeenCalled();
      expect(setCurrentStepSpi).toHaveBeenCalledWith(2);
    });

    it("should set current step in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(2);
        })
        .unsubscribe();
    });
  });

  describe("stepToNext", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const stepToNextSpy = jest.spyOn(handlers, "stepToNext");

    afterAll(() => {
      stepToNextSpy.mockReset();
    });

    handlers.setTotalSteps(2);
    handlers.stepToNext();

    it("should be callable", () => {
      expect(stepToNextSpy).toHaveBeenCalled();
      expect(stepToNextSpy).toHaveBeenCalledWith();
    });

    it("should increment current step by 1 in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(2);
          expect(next.steps.canNext).toBe(false);
          expect(next.steps.canPrevious).toBe(true);
        })
        .unsubscribe();
    });
  });

  describe("stepToPrevious", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const stepToPreviousSpy = jest.spyOn(handlers, "stepToPrevious");

    afterAll(() => {
      stepToPreviousSpy.mockReset();
    });

    handlers.setTotalSteps(2);
    handlers.setCurrentStep(2);
    handlers.stepToPrevious();

    it("should be callable", () => {
      expect(stepToPreviousSpy).toHaveBeenCalled();
      expect(stepToPreviousSpy).toHaveBeenCalledWith();
    });

    it("should decrement current step by 1 in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(1);
          expect(next.steps.canNext).toBe(true);
          expect(next.steps.canPrevious).toBe(false);
        })
        .unsubscribe();
    });
  });

  describe("stepToFirst", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const stepToFirstSpy = jest.spyOn(handlers, "stepToFirst");

    afterAll(() => {
      stepToFirstSpy.mockReset();
    });

    handlers.setTotalSteps(5);
    handlers.setCurrentStep(3);
    handlers.stepToFirst();

    it("should be callable", () => {
      expect(stepToFirstSpy).toHaveBeenCalled();
      expect(stepToFirstSpy).toHaveBeenCalledWith();
    });

    it("should set current step to 1 in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(1);
          expect(next.steps.canNext).toBe(true);
          expect(next.steps.canPrevious).toBe(false);
        })
        .unsubscribe();
    });
  });

  describe("stepToLast", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const stepToLastSpy = jest.spyOn(handlers, "stepToLast");

    afterAll(() => {
      stepToLastSpy.mockReset();
    });

    handlers.setTotalSteps(5);
    handlers.setCurrentStep(3);
    handlers.stepToLast();

    it("should be callable", () => {
      expect(stepToLastSpy).toHaveBeenCalled();
      expect(stepToLastSpy).toHaveBeenCalledWith();
    });

    it("should set current step to last in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.steps.current).toBe(5);
          expect(next.steps.canNext).toBe(false);
          expect(next.steps.canPrevious).toBe(true);
        })
        .unsubscribe();
    });
  });

  describe("validate", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const validateSpy = jest.spyOn(handlers, "validate");

    afterAll(() => {
      validateSpy.mockReset();
    });

    const validate = jest.fn(async (values, _metaProps) => {
      if (values["name"] === "John Doe") {
        return {
          name: "This is a validation error.",
        };
      }
      return {};
    });

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });
    handlers.setHandlers({ validate });
    handlers.validate();

    it("should be callable", () => {
      expect(validateSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveBeenCalledWith();
    });

    it("should set validation errors in Store", () => {
      store
        .subscribe("foo", (next) => {
          expect(next.fields["name"]).toHaveProperty("error");
          expect(next.fields["name"].error).toBe("This is a validation error.");
          expect(next.fields["name"].meta.hasError).toBe(true);
        })
        .unsubscribe();
    });

    it('should call "validate" callback with values and metaProps', () => {
      expect(validate).toHaveBeenCalled();
      expect(validate.mock.calls[0][0]).toStrictEqual({ name: "John Doe" });
      expect(JSON.stringify(validate.mock.calls[0][1])).toBe(
        JSON.stringify({
          fields: {
            name: {
              meta: {
                pristine: true,
                hasError: false,
                isTouched: false,
              },
            },
          },
          steps: mockState.steps,
          form: {
            ...mockState.form,
            hasDefaultValues: true,
            handlers: {
              ...mockState.form.handlers,
              validate,
            },
          },
        })
      );
    });
  });

  describe("validate - if attemptedSubmit: true", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const validateSpy = jest.spyOn(handlers, "validate");

    afterAll(() => {
      validateSpy.mockReset();
    });

    const validate = jest.fn(async (values) => {
      return {};
    });

    handlers.setHandlers({ validate });
    handlers.validate({ attemptedSubmit: true });

    it('should not call the "validate" callback if Store.form.attemptedSubmit = false', () => {
      expect(validate).toHaveBeenCalledTimes(0);
    });
  });

  describe("handleChangeCallback", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const handleChangeCallbackSpy = jest.spyOn(
      handlers,
      "handleChangeCallback"
    );

    afterAll(() => {
      handleChangeCallbackSpy.mockReset();
    });

    const change = jest.fn((_values, _metaProps) => {});

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });
    handlers.setHandlers({ change });
    handlers.handleChangeCallback("name", "John Doe");

    it("should be callable", () => {
      expect(handleChangeCallbackSpy).toHaveBeenCalled();
      expect(handleChangeCallbackSpy).toHaveBeenCalledWith("name", "John Doe");
    });

    it('should call the "change" callback with value and metaProps', () => {
      expect(change).toHaveBeenCalled();
      expect(change.mock.calls[0][0]).toStrictEqual({ name: "John Doe" });
      expect(JSON.stringify((change.mock.calls[0] as any)[1])).toBe(
        JSON.stringify({
          fields: {
            name: {
              meta: {
                pristine: true,
                hasError: false,
                isTouched: false,
              },
            },
          },
          steps: mockState.steps,
          form: {
            ...mockState.form,
            hasDefaultValues: true,
            handlers: {
              ...mockState.form.handlers,
              change,
            },
          },
        })
      );
    });
  });

  describe("handleFieldChange", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const handleFieldChangeSpy = jest.spyOn(handlers, "handleFieldChange");

    afterAll(() => {
      handleFieldChangeSpy.mockReset();
    });

    const change = jest.fn((_values, _metaProps) => {});

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });
    handlers.setHandlers({ change });
    handlers.handleFieldChange("name")("changed");

    it("should be callable", () => {
      expect(handleFieldChangeSpy).toHaveBeenCalled();
      expect(handleFieldChangeSpy).toHaveBeenCalledWith("name");
    });

    it("should change the value in Store", () => {
      store.subscribe("foo", (next) => {
        expect(next.values["name"]).toBe("changed");
        expect(next.fields["name"].meta.pristine).toBe(false);
      });
    });
  });

  describe("asyncDispatch", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const asyncDispatchSpy = jest.spyOn(handlers, "asyncDispatch");
    const asyncCallback = jest.fn().mockResolvedValue({
      name: "name",
      value: "John Doe",
    });

    afterAll(() => {
      asyncDispatchSpy.mockReset();
    });

    handlers.registerField("name");
    handlers.setDefaultValues({ name: "" });
    handlers.asyncDispatch("FIELD_CHANGE", asyncCallback);

    it("should be callable", () => {
      expect(asyncDispatchSpy).toHaveBeenCalled();
      expect(asyncCallback).toHaveBeenCalled();
    });

    it.todo("should change the value in Store");
  });

  describe("asyncDispatch in other form", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    store.init("baz");

    const fooHandlers = getStoreHandlers("foo", store);
    const bazHandlers = getStoreHandlers("baz", store);

    const asyncDispatchSpy = jest.spyOn(fooHandlers, "asyncDispatch");
    const asyncCallback = jest.fn().mockResolvedValue({
      name: "name",
      value: "John Doe",
    });

    afterAll(() => {
      asyncDispatchSpy.mockReset();
    });

    bazHandlers.registerField("name");
    bazHandlers.setDefaultValues({ name: "" });
    fooHandlers.asyncDispatch("FIELD_CHANGE", asyncCallback, { formId: "baz" });

    it("should be callable", () => {
      expect(asyncDispatchSpy).toHaveBeenCalled();
      expect(asyncCallback).toHaveBeenCalled();
    });

    it.todo("should change the value in Store");
  });

  describe("snapshotState", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const snapshotStateSpy = jest.spyOn(handlers, "snapshotState");

    afterAll(() => {
      snapshotStateSpy.mockReset();
    });

    handlers.snapshotState();

    it("should be callable", () => {
      expect(snapshotStateSpy).toHaveBeenCalled();
    });

    it("should change the value in Store", () => {
      store.subscribe("foo", (next) => {
        const { values, fields, form, steps } = mockState;
        expect(JSON.stringify(next.form.snapshot)).toBe(
          JSON.stringify({
            values,
            fields,
            steps,
            form: { ...form, snapshot: null },
          })
        );
      });
    });
  });

  describe("reset", () => {
    const store = new Store<FormState<any>>();
    store.init("foo");
    const handlers = getStoreHandlers("foo", store);
    const resetSpy = jest.spyOn(handlers, "reset");

    afterAll(() => {
      resetSpy.mockReset();
    });

    handlers.snapshotState();
    handlers.registerField("name");
    handlers.setDefaultValues({ name: "John Doe" });
    handlers.reset();

    it("should be callable", () => {
      expect(resetSpy).toHaveBeenCalled();
    });

    it("state should be reset and should match the initial mockState", () => {
      store.subscribe("foo", (next) => {
        expect(JSON.stringify(next)).toBe(JSON.stringify(mockState));
      });
    });
  });
});
