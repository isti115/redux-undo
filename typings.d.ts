declare module 'redux-undo' {
  import { Reducer, Action, AnyAction } from 'redux';

  export interface StateWithHistory<State, CapturedState = State> {
    past: CapturedState[];
    present: State;
    future: CapturedState[];
    _latestUnfiltered?: State;
    group?: any;
    index?: number;
    limit?: number;
  }

  export type FilterFunction<S = any, CS = S, A extends Action = AnyAction> = (action: A, currentState: S, previousHistory: StateWithHistory<S, CS>) => boolean;
  export type GroupByFunction<S = any, CS = S, A extends Action = AnyAction> = (action: A, currentState: S, previousHistory: StateWithHistory<S, CS>) => any;
  export type CombineFilters = <S = any, CS = S, A extends Action = AnyAction>(...filters: FilterFunction<S, A>[]) => FilterFunction<S, CS, A>;

  export class ActionCreators {
    static undo: () => Action;
    static redo: () => Action;
    static jump: (payload: number) => Action;
    static jumpToPast: (payload: number) => Action;
    static jumpToFuture: (payload: number) => Action;
    static clearHistory: () => Action;
  }

  export class ActionTypes {
    static UNDO: string;
    static REDO: string;
    static JUMP: string;
    static JUMP_TO_PAST: string;
    static JUMP_TO_FUTURE: string;
    static CLEAR_HISTORY: string;
  }

  export interface UndoableOptions<S = any, CS = S, A extends Action = AnyAction> {
    /* Set a limit for the history */
    limit?: number;

    /** If you don't want to include every action in the undo/redo history, you can add a filter function to undoable */
    filter?: FilterFunction<S, CS, A>;

    /** Groups actions together into one undo step */
    groupBy?: GroupByFunction<S, CS, A>;

    /** Extracts information from the current state to be retrieved later */
    capture: (state: S) => CS,

    /** Injects some previously extracted information back into the state */
    restore: (incoming: CS, current: S) => S,

    /** Define a custom action type for this undo action */
    undoType?: string;
    /** Define a custom action type for this redo action */
    redoType?: string;

    /** Define custom action type for this jump action */
    jumpType?: string;

    /** Define custom action type for this jumpToPast action */
    jumpToPastType?: string;
    /** Define custom action type for this jumpToFuture action */
    jumpToFutureType?: string;

    /** Define custom action type for this clearHistory action */
    clearHistoryType?: string | string[];

    /** History will be (re)set upon init action type */
    initTypes?: string[];

    /** Set to `true` to turn on debugging */
    debug?: boolean;

    /** Set to `true` to prevent undoable from skipping the reducer on undo/redo **/
    neverSkipReducer?: boolean;

    /** Set to `true` to prevent the user from undoing to the initial state  **/
    ignoreInitialState?: boolean;

    /** Set to `true` to synchronize the _latestUnfiltered state with present wen a excluded action is dispatched **/
    syncFilter?: boolean;
  }

  interface Undoable {
    <State, CapturedState = State, A extends Action = AnyAction>(
      reducer: Reducer<State, A>,
      options?: UndoableOptions<State, CapturedState, A>
    ): Reducer<StateWithHistory<State, CapturedState>>
  }

  type IncludeAction = <S = any, CS = S, A extends Action = AnyAction>(actions: A['type'] | A['type'][]) => FilterFunction<S, CS, A>;
  type ExcludeAction = IncludeAction;
  type GroupByActionTypes = <S = any, CS = S, A extends Action = AnyAction>(actions: A['type'] | A['type'][]) => GroupByFunction<S, CS, A>;
  type NewHistory = <State, CapturedState>(
    past: CapturedState[],
    present: State,
    future: CapturedState[],
    group?: any
  ) => StateWithHistory<State, CapturedState>

  const undoable: Undoable;

  export default undoable;

  /**
   * If you don't want to include every action in the undo/redo history, you can add a filter function to undoable.
   * redux-undo provides you with the includeAction and excludeAction helpers for basic filtering.
   */
  export const includeAction: IncludeAction;

  /**
   * If you don't want to include every action in the undo/redo history, you can add a filter function to undoable.
   * redux-undo provides you with the includeAction and excludeAction helpers for basic filtering.
   */
  export const excludeAction: ExcludeAction;

  export const combineFilters: CombineFilters;

  export const groupByActionTypes: GroupByActionTypes;

  export const newHistory: NewHistory;
}
