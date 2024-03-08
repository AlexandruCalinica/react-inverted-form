import {
  map,
  pluck,
  Subject,
  takeUntil,
  Observable,
  Subscription,
  BehaviorSubject,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from "rxjs";
import isEqual from "lodash/isEqual";

import { reducer, getInitialState } from "./core";
import { FormState, Action, ActionType } from "./types";

export class Store<T> {
  private _states: Record<string, BehaviorSubject<T>>;
  private _reducers: Record<string, (state: T, action: Action) => T>;

  constructor() {
    this._reducers = {};
    this._states = {};
  }

  init(key: string) {
    if (!!this._reducers[key]) return;
    Object.assign(this._reducers, { [key]: reducer });

    if (!!this._states[key]) return;
    Object.assign(this._states, {
      [key]: new BehaviorSubject(getInitialState()),
    });
  }

  destroy(key: string) {
    delete this._reducers[key];

    const destroy$ = new Subject();
    this._states[key].pipe(takeUntil(destroy$)).subscribe();
    destroy$.next(null);
    destroy$.complete();

    delete this._states[key];
  }

  setReducer(
    key: string,
    stateReducer: (
      initialReducer: (state: T, action: Action) => T
    ) => (state: T, action: Action) => T
  ) {
    this._checkPrerequisites(key);
    this._reducers[key] = stateReducer(reducer as any);
  }

  select<K extends keyof T>(stateKey: string, key: K): Observable<T[K]> {
    this._checkPrerequisites(stateKey);

    return this._states[stateKey].pipe(
      distinctUntilKeyChanged(key),
      pluck(key)
    );
  }

  selectValue(stateKey: string, key: string): Observable<any> {
    this._checkPrerequisites(stateKey);

    return this._states[stateKey].pipe(
      map((s) => (s as any)?.values?.[key]),
      distinctUntilChanged(isEqual)
    );
  }

  selectField(stateKey: string, key: string): Observable<any> {
    this._checkPrerequisites(stateKey);

    return this._states[stateKey].pipe(
      map((s) => {
        const value = (s as any)?.values?.[key];
        const meta = (s as any)?.fields?.[key];
        return { value, meta };
      }),
      distinctUntilChanged(isEqual)
    );
  }

  subscribe(stateKey: string, callback: (state: T) => void): Subscription {
    this._checkPrerequisites(stateKey);

    return this._states[stateKey]?.subscribe(callback);
  }

  getSubscribe = (stateKey: string) => (callback: (state: T) => void) => {
    const subscription = this._states[stateKey]?.subscribe(callback);

    return () => subscription.unsubscribe();
  };

  getFieldSubscribe =
    (stateKey: string, fieldName: string) => (callback: () => void) => {
      const subscription = this.selectField(stateKey, fieldName).subscribe(
        callback
      );

      return () => subscription.unsubscribe();
    };

  dispatch = (stateKey: string, action: Action): void => {
    this._checkPrerequisites(stateKey);

    const oldState = this._states[stateKey]?.getValue();
    const newState = this._reducers[stateKey]?.(oldState, action);
    this._states[stateKey]?.next(newState);
  };

  asyncDispatch = async <R>(
    stateKey: string,
    type: ActionType,
    runner: (state: T) => Promise<R>
  ): Promise<void> => {
    this._checkPrerequisites(stateKey);

    const payload = await runner(this._states[stateKey].getValue());
    this.dispatch(stateKey, { type, payload });
  };

  initState = (stateKey: string, options?: { debug?: boolean }) => {
    try {
      this._checkPrerequisites(stateKey);
    } catch (e) {
      this.init(stateKey);
      this.dispatch(stateKey, {
        type: "INIT",
        payload: options,
      });
    }
  };

  getSnapshot = (stateKey: string) => () => {
    return this._states[stateKey].getValue();
  };

  getFieldMetaSnapshot = (stateKey: string, fieldName: string) => () => {
    return (this._states[stateKey].getValue() as unknown as FormState<any>)
      ?.fields?.[fieldName];
  };

  getFieldValueSnapshot = (stateKey: string, fieldName: string) => () => {
    return (this._states[stateKey].getValue() as unknown as FormState<any>)
      ?.values?.[fieldName];
  };

  getFieldErrorSnapshot = (stateKey: string, fieldName: string) => () => {
    return (this._states[stateKey].getValue() as unknown as FormState<any>)
      ?.fields?.[fieldName]?.error;
  };

  private _checkPrerequisites(key: string) {
    if (!this._states[key])
      throw new Error(
        `Store does not contain "state" with key "${key}".\n
        Did you forgot to call Store.init("${key}")?\n`
      );

    if (!this._reducers[key])
      throw new Error(
        `Store does not contain "reducer" with key "${key}".\n
          Did you forgot to call Store.init("${key}")?\n`
      );
  }
}

export default new Store<FormState<any>>();
