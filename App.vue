<script setup lang="ts">
import { ref } from 'vue'

import { useRefHistory } from './starter/useRefHistory'

function format(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

const count = ref(0)
const { history, canUndo, canRedo, undo, redo } = useRefHistory(count)
</script>

<template>
  <div>Count: {{ count }}</div>
  <button @click="count++">
    Increment
  </button>
  <button @click="count--">
    Decrement
  </button>
  <span>/</span>
  <button :disabled="!canUndo" @click="undo()">
    Undo
  </button>
  <button :disabled="!canRedo" @click="redo()">
    Redo
  </button>
  <br>
  <br>
  <p>History (limited to 10 records for demo)</p>
  <div>
    <div v-for="i in history" :key="i.timestamp">
      <span>{{ format(i.timestamp) }}</span>
      <span>{ value: {{ i.snapshot }} }</span>
    </div>
  </div>
</template>
