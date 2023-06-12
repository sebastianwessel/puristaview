<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const active = computed(() => {
  if (route.path.startsWith('/services')) {
    return '2'
  }
  if (route.path.startsWith('/events')) {
    return '3'
  }
  if (route.path.startsWith('/rest-api')) {
    return '4'
  }
  return '1'
})
</script>

<template>
  <el-menu :default-active="active" mode="horizontal" :router="true" style="display: flex; justify-content: center">
    <el-menu-item index="1" :route="{ name: 'home' }"
      ><el-icon><House /></el-icon>Home</el-menu-item
    >
    <el-menu-item index="2" :route="{ name: 'services' }"
      ><el-icon><Grid /></el-icon>Services</el-menu-item
    >
    <el-menu-item index="3" :route="{ name: 'events' }"
      ><el-icon><Bell /></el-icon>Events</el-menu-item
    >
    <el-menu-item index="4" :route="{ name: 'restApi' }"
      ><el-icon><Link /></el-icon>REST-API</el-menu-item
    >
    <el-menu-item index="5"
      ><el-link href="https://purista.dev" type="info" target="_blank"
        ><el-icon><Help /></el-icon>Help</el-link
      ></el-menu-item
    >
  </el-menu>
</template>
