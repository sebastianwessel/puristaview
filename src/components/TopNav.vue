<template>
  <el-menu :default-active="1"  mode="horizontal" :router="true">
    <el-menu-item index="1" :route="{ name: 'home' }"><el-icon><House /></el-icon>Home</el-menu-item>
    <el-menu-item index="2" :route="{ name: 'services' }"><el-icon><Grid /></el-icon>Services</el-menu-item>
    <el-menu-item index="3" :route="{ name: 'events' }"><el-icon><Bell /></el-icon>Events</el-menu-item>
    <el-menu-item index="4" :route="{ name: 'restApi' }"><el-icon><Link /></el-icon>REST-API</el-menu-item>
    <el-menu-item index="5"><el-link href="https://purista.dev"  type="info"><el-icon><Help /></el-icon>Help</el-link></el-menu-item>
  </el-menu>  
</template>

<script lang="ts" setup>

</script>
