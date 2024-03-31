import type { WatchCallback, WatchSource, WatchStopHandle } from 'vue';
import { ref, watch } from 'vue';

import type { Fn } from "../utils";


export type IgnoredUpdater = (updater: () => void) => void;

export interface WatchIgnorableReturn {
  ignoreUpdates: IgnoredUpdater;
  stop: WatchStopHandle;
}

// export function watchIgnorable<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>): WatchIgnorableReturn;

export function watchIgnorable<T>(
  source: WatchSource<T>,
  cb: WatchCallback<T>
  // TODO: implement options
): WatchIgnorableReturn {


  let ignoreUpdates: IgnoredUpdater;
  let stop: () => void;


  const disposables: Fn[] = [];

  const ignoreCounter = ref(0);
  // const syncCounter = ref(0);


  // disposables.push(
  //   watch(
  //     source,
  //     () => {
  //       syncCounter.value++;
  //     },
  //   )
  // );

  ignoreUpdates = (updater: () => void) => {
    // const syncCounterPrev = syncCounter.value;
    updater();
    ignoreCounter.value++;
  };

  disposables.push(
    watch(
      source,
      (...args) => {
        // If a history operation was performed (ignoreCounter > 0)
        const ignore = ignoreCounter.value > 0;
        ignoreCounter.value = 0;
        // syncCounter.value = 0;
        if (ignore)
          return;
        cb(...args);
      },
    ),
  );

  stop = () => {
    disposables.forEach(fn => fn());
  };

  return { stop, ignoreUpdates };
}

// alias
export { watchIgnorable as ignorableWatch };