<script setup lang="ts">
import en from 'element-plus/dist/locale/en.mjs'
import { computed, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'

import { useStore } from '@/stores'

import TopNav from './components/TopNav.vue'

const { init } = useStore()
const locale = computed(() => en)
onBeforeMount(init)
</script>

<template>
  <el-config-provider :locale="locale">
    <el-container width="100%">
      <el-header><TopNav /></el-header>
      <el-main><RouterView /></el-main>
    </el-container>
  </el-config-provider>
</template>
