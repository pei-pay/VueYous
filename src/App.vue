<script setup lang="ts">
import { ref } from 'vue';

import { useRefHistory } from './packages';

const counter = ref(0);
const { history, undo, redo } = useRefHistory();
</script>

<template>
  app.vue
</template>./packages