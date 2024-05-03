# useRefHistory

<!-- WIP: 下書き -->

https://vueuse.org/core/useRefHistory/

## どういったコンポーザブルか

ref の変更履歴を自動で追跡し、値を戻したり、戻した値を復活させたりできる関数を提供します。

### Demo

[VueUseの公式サイト](https://vueuse.org/core/useRefHistory/#demo) で実際の動きを確認してみましょう。

#### ポイント
- Increment ボタンを押すと count の値が増え、History にその値と時刻が追加される
- Decrement ボタンを押すと count の値を減り、History にその値と時刻が追加される
- Undo ボタンを押すと、count の値が一つ前の値に戻り、History からもその履歴が消える
- Redo ボタンを押すと、Undo で戻した値に戻り、History にもその履歴が復活する
  - この時の時刻は redo で戻した時間ではなく、その履歴が最初に追加された時間になっていることに注意!

## 作り方

### ユーザーのインターフェースを考える

まずはユーザーがこのコンポーザブルをどのように使うか考えてみましょう。デモで確認した通り、カウントの値の変更履歴を管理したいとします。

- ユーザーが提供するもの
  - 履歴を管理したいref: count
- ユーザーに提供するもの
  - 履歴: history
    - 値と時刻(タイムスタンプ)がわかるといい
  - 履歴を戻す関数: undo
  - 戻した履歴を復活させる関数: redo
  - 履歴を戻せるかどうかフラグ: canUndo
  - 戻したい履歴があるかどうかフラグ: canRedo

以上のことから下記のような形になれば良さそうです。

```ts
const { history, undo, redo, canUndo, canRedo } = useRefHistory(count)
```

### 型定義してみる

ユーザーのインターフェースが決まったので、今度はコンポーザブルの型を考えます。

- 履歴(history)は値(snapshot)と時刻(timestamp)のオブジェクトの配列
- canUndo と canRedo は boolean
- undo と redo は関数

```ts
import type { Ref } from 'vue'

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
  // 中身はこれから実装する

  return {
    history,
    canUndo,
    canRedo,
    undo,
    redo,
  }
}
```

### 仕様をまとめてみる

`useRefHistory` がどういったことをするのか実装者の視点で考えてみましょう

- ユーザーから受け取った値 (引数のsource) を監視し、値が変わったら履歴にその時の値と時刻を追加する
- undo を発火したら、履歴から一番最新のものを削除し、source の値を次に最新の値にする
- redo を発火したら、undo で戻したものの中から一番最近のものを、sourceの値にし、履歴に戻す。
- canUndo は履歴あればtrue、ないならfalse
- canRedo は undoで戻したものがあれば true、ないなら false
