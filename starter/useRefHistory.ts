import { type Ref, ref, watch, markRaw, computed } from 'vue'

interface UseRefHistoryRecord<T> {
  snapshot: T
  timestamp: number
}
interface UseRefHistoryReturn<Raw> {
  history: Ref<UseRefHistoryRecord<Raw>[]>
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  undo: () => void
  redo: () => void
}

export const timestamp = () => +Date.now()

export function useRefHistory<Raw>(source: Ref<Raw>): UseRefHistoryReturn<Raw> {

  function _createHistoryRecord(): UseRefHistoryRecord<Raw> {
    return markRaw({
      snapshot: source.value,
      timestamp: timestamp()
    })
  }

  const _setSource = (record: UseRefHistoryRecord<Raw>) => {
    ignore.value = true
    source.value = record.snapshot
    last.value = record
    ignore.value = false
  }

  const ignore = ref(false)

  const last: Ref<UseRefHistoryRecord<Raw>> = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Raw>>

  const undoStack: Ref<UseRefHistoryRecord<Raw>[]> = ref([]);
  const redoStack: Ref<UseRefHistoryRecord<Raw>[]> = ref([])

  const undo = () => {
    const state = undoStack.value.shift()
    if(state) {
      redoStack.value.unshift(last.value)
      _setSource(state)
    }
  }
  const redo = () => {
    const state = redoStack.value.shift();

    if (state) {
      undoStack.value.unshift(last.value);
      _setSource(state);
    }
  }

  watch(source, () => {
    if(ignore.value) return
    undoStack.value.unshift(last.value)
    last.value = _createHistoryRecord()
    if(redoStack.value.length) 
      redoStack.value.splice(0, redoStack.value.length)
  }, { flush: 'sync'} )

  const history = computed(() => [last.value, ...undoStack.value])
  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  return {
    history,
    canUndo,
    canRedo,
    undo,
    redo,
  }
}
