import { ref } from "vue";

export function useRefHistory() {
  const history = ref([]);

  const undo = () => {

  };

  const redo = () => {

  };

  return {
    history,
    undo,
    redo
  };
}