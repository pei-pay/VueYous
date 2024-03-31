<script setup lang="ts">
import { ref } from 'vue';
// TODO: make formatDate
import { formatDate } from '@vueuse/core';

import { useRefHistory } from './packages';

function format(ts: number) {
  return formatDate(new Date(ts), 'YYYY-MM-DD HH:mm:ss');
};

const count = ref(0);
const inc = () => count.value++;
const dec = () => count.value--;
const { history, undo, redo, canUndo, canRedo } = useRefHistory(count);
</script>

<template>
  <div class="container">
    <div class="count">Count: {{ count }}</div>
    <div class="buttons">
      <button @click="inc()" class="button">
        Increment
      </button>
      <button @click="dec()" class="button">
        Decrement
      </button>
      <span class="divider">/</span>
      <button :disabled="!canUndo" @click="undo()" class="button">
        Undo
      </button>
      <button :disabled="!canRedo" @click="redo()" class="button">
        Redo
      </button>
    </div>
    <br>
    <br>
    <div class="history">
      <note>History</note>
      <div v-for="i in history" :key="i.timestamp" class="history-item">
        <span>{{ format(i.timestamp) }}</span>
        <span>{ value: {{ i.snapshot }} }</span>
      </div>
    </div>
  </div>
</template>

<style>
/* REFACTOR: 一時的なスタイル */
body {
  background-color: #1a1a1a;
  color: white
}

.container {
  padding: 20px;
}

.count {
  font-size: 24px;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  align-items: center;
}

.button {
  background-color: #44bd87;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #267;
}

.button:disabled {
  background-color: #333;
}

.divider {
  margin: 0 5px;
}

.history {
  margin-top: 20px;
}

.history-item {
  margin-top: 5px;
}

.note {
  color: #ccc;
  font-size: 14px;
  font-style: italic;
}
</style>
