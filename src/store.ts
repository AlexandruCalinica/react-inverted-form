import {
  map,
  pluck,
  Subject,
  Observable,
  Subscription,
  BehaviorSubject,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  takeUntil,
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
