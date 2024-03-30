// NOTE: 実際は 'vue-demi' からimportされてる
import { ref, type Ref } from "vue";

export interface UseRefHistoryRecord<T> {
  snapshot: T;
  timestamp: number;
}

export interface UseManualRefHistoryReturn<Raw, Serialized> {
  // TODO: もらう source をなぜ返す必要があるのか?
  // /** Bypassed tracking ref from the argument s*/
  // source: Ref<Raw>;

  /** An array of history records for undo, newest comes to first */
  history: Ref<UseRefHistoryRecord<Serialized>[]>;

  // /** Last history point, source can be different if paused */
  // last: Ref<UseRefHistoryRecord<Serialized>>;

  // /** Same as {@link UseManualRefHistoryReturn.history | history} */
  // undoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

  // /** Records array for redo */
  // redoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

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

export function useManualRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>
): UseManualRefHistoryReturn<Raw, Serialized> {


  const history = ref([]);

  const commit = () => { };
  const clear = () => { };
  const undo = () => { };
  const redo = () => { };
  const reset = () => { };

  const canUndo = ref(false);
  const canRedo = ref(false);

  return {
    // source,
    // undoStack,
    // redoStack,
    // last,
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