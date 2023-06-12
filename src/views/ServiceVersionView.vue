<script setup lang="ts">
import { RouterView } from 'vue-router'

const _props = defineProps<{ serviceName: string; serviceVersion: string }>()
</script>
<template>
  <router-view> </router-view>
</template>
