import { type Ref } from "vue";
import { useManualRefHistory, type UseManualRefHistoryReturn } from "../useManualRefHistory";

export interface UseRefHistoryReturn<Raw, Serialized> extends UseManualRefHistoryReturn<Raw, Serialized> {
}

// TODO: Serialized って何?
export function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>
) {

  const manualHistory = useManualRefHistory(source);

  return {
    ...manualHistory
  };
}