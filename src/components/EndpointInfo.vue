<script setup lang="ts">
import { computed } from 'vue'

import { useStore } from '@/stores'

const props = defineProps<{ serviceName: string; serviceVersion: string; endpointName: string }>()

const store = useStore()

const endpoint = computed(() => undefined)
</script>

<template>
  <template v-if="endpoint">
    <h3>{{ endpoint }}</h3>
  </template>
  <template v-else> Endpoint not found </template>
</template>
