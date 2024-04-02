import type { WatchCallback, WatchSource, WatchStopHandle } from 'vue';
import { ref, watch } from 'vue';

import type { Fn } from '../utils';

export type IgnoredUpdater = (updater: () => void) => void;

export interface WatchIgnorableReturn {
  ignoreUpdates: IgnoredUpdater;
  stop: WatchStopHandle;
}

export function watchIgnorable<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T>
): WatchIgnorableReturn {
  let ignoreUpdates: IgnoredUpdater;
  let stop: () => void;

  const disposables: Fn[] = [];

  const ignoreCounter = ref(0);

  ignoreUpdates = (updater: () => void) => {
    updater();
    ignoreCounter.value++;
  };

  disposables.push(
    watch(source, (...args) => {
      const ignore = ignoreCounter.value > 0;
      ignoreCounter.value = 0;
      if (ignore) return;
      cb(...args);
    })
  );

  stop = () => {
    disposables.forEach((fn) => fn());
  };

  return { stop, ignoreUpdates };
}

// alias
export { watchIgnorable as ignorableWatch };
