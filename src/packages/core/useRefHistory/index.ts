import { type Ref } from "vue";
import { watchIgnorable } from "@/packages/shared";

import { useManualRefHistory, type UseManualRefHistoryReturn } from "../useManualRefHistory";

export interface UseRefHistoryReturn<Raw, Serialized> extends UseManualRefHistoryReturn<Raw, Serialized> {
}

// TODO: Serialized は最低限だと必要ないかも
export function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>
) {

  const {
    ignoreUpdates,
  } = watchIgnorable(
    source,
    commit,
  );



  function setSource(source: Ref<Raw>, value: Raw) {
    ignoreUpdates(() => {
      source.value = value;
    });
  }

  const manualHistory = useManualRefHistory(source, { setSource });
  const { commit: manualCommit } = manualHistory;

  function commit() {
    manualCommit();
  }

  return {
    ...manualHistory
  };
}