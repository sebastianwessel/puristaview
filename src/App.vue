<script setup lang="ts">
import en from 'element-plus/dist/locale/en'
import { computed } from 'vue'
import { RouterView } from 'vue-router'

const locale = computed(() => en)
</script>

<template>
  <el-config-provider :locale="locale"> <RouterView /> </el-config-provider>
</template>
