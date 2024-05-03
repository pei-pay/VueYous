import { ref, watch, type Ref } from 'vue'

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

export function useRefHistory<Raw>(source: Ref<Raw>): UseRefHistoryReturn<Raw> {

  const history: Ref<UseRefHistoryRecord<Raw>[]> = ref([])
  const canUndo = ref(false)
  const canRedo = ref(false)
  const undo = () => {}
  const redo = () => {}


  watch(source, () => {
    
  })

  return {
    history,
    canUndo,
    canRedo,
    undo,
    redo,
  }
}