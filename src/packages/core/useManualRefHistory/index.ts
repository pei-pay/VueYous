// NOTE: 実際は 'vue-demi' からimportされてる
import { computed, markRaw, ref, type Ref } from "vue";
// TODO: make timestamp
import { timestamp } from "@vueuse/shared";
import { type CloneFn, cloneFnJSON } from "@vueuse/core";

export interface UseRefHistoryRecord<T> {
  snapshot: T;
  timestamp: number;
}

export interface UseManualHistoryOptions<Raw, Serialized = Raw> {
  setSource?: (source: Ref<Raw>, v: Raw) => void;
}

export interface UseManualRefHistoryReturn<Raw, Serialized> {
  // TODO: もらう source をなぜ返す必要があるのか?
  // /** Bypassed tracking ref from the argument s*/
  // source: Ref<Raw>;

  /** An array of history records for undo, newest comes to first */
  history: Ref<UseRefHistoryRecord<Serialized>[]>;

  /** Last history point, source can be different if paused */
  last: Ref<UseRefHistoryRecord<Serialized>>;

  /** Same as {@link UseManualRefHistoryReturn.history | history} */
  undoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

  /** Records array for redo */
  redoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

  /** A ref representing if undo is possible (non empty undoStack) */
  canUndo: Ref<boolean>;

  /** A ref representing if redo is possible (non empty redoStack) */
  canRedo: Ref<boolean>;

  /** Undo changes */
  undo: () => void;

  /** Redo changes */
  redo: () => void;

  /** Clear all the history */
  clear: () => void;

  /** Create a new history record */
  commit: () => void;

  /** Reset ref's value with latest history */
  reset: () => void;
}

function fnBypass<F, T>(v: F) {
  return v as unknown as T;
}
function fnSetSource<F>(source: Ref<F>, value: F) {
  return source.value = value;
}

type FnCloneOrBypass<F, T> = (v: F) => T;

function defaultDump<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<R, S>;
}

function defaultParse<R, S>(clone?: boolean | CloneFn<R>) {
  return (clone
    ? typeof clone === 'function'
      ? clone
      : cloneFnJSON
    : fnBypass
  ) as unknown as FnCloneOrBypass<S, R>;
}

// TODO: optionsは指定なしで実装してみる
export function useManualRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseManualHistoryOptions<Raw, Serialized> = {},
): UseManualRefHistoryReturn<Raw, Serialized> {

  const {
    setSource = fnSetSource
  } = options;

  /*
   * NOTE: optionで指定できるやつら。一旦デフォ値だけ使うようにする
   * If you are going to mutate the source, you need to pass a custom clone function or use clone true as a param, 
   * that is a shortcut for a minimal clone * * function x => JSON.parse(JSON.stringify(x)) that will be used in both dump and parse.
   * 
   */
  const clone = false;
  const dump = defaultDump<Raw, Serialized>(clone);
  const parse = defaultParse<Raw, Serialized>(clone);

  function _createHistoryRecord(): UseRefHistoryRecord<Serialized> {
    return markRaw({
      snapshot: dump(source.value),
      timestamp: timestamp(),
    });
  }

  const last: Ref<UseRefHistoryRecord<Serialized>> = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Serialized>>;

  const undoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([]);
  const redoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([]);

  const _setSource = (record: UseRefHistoryRecord<Serialized>) => {
    setSource(source, parse(record.snapshot));
    last.value = record;
  };


  const commit = () => {
    undoStack.value.unshift(last.value);
    last.value = _createHistoryRecord();
  };

  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length);
    redoStack.value.splice(0, redoStack.value.length);
  };

  const undo = () => {
    const state = undoStack.value.shift();

    if (state) {
      redoStack.value.unshift(last.value);
      _setSource(state);
    }
  };

  const redo = () => {
    const state = redoStack.value.shift();

    if (state) {
      undoStack.value.unshift(last.value);
      _setSource(state);
    }
  };

  const reset = () => {
    _setSource(last.value);
  };

  const history = computed(() => [last.value, ...undoStack.value]);

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);



  return {
    // source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,

    clear,
    commit,
    reset,
    undo,
    redo,
  };
}