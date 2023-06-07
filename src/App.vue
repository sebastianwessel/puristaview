<script setup lang="ts">
import {  RouterView } from 'vue-router'
import TopNav from './components/TopNav.vue';
import { computed } from 'vue'
import en from 'element-plus/dist/locale/en.mjs'

const locale = computed(() =>  en)

</script>

<template>
  <el-config-provider :locale="locale">
    <el-container width="100%">
      <el-header><TopNav/></el-header>
      <el-main><RouterView /></el-main>
    </el-container>

  </el-config-provider>
</template>

