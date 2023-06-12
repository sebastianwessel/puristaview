<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import ServiceCard from '@/components/ServiceCard.vue'
import { useStore } from '@/stores'

const store = useStore()

const search = ref('')

const services = computed(() => {
  if (!search.value.trim().length) {
    return store.servicesGroupedByName
  }
  return store.servicesGroupedByName.filter((service) =>
    service[0].name.toLowerCase().includes(search.value.toLowerCase()),
  )
})
</script>

<template>
  <div style="text-align: center; margin-top: 60px">
    <h1>Services</h1>
  </div>
  <div class="search-bar">
    <el-input v-model="search" :prefix-icon="Search" placeholder="Search for servie name" clearable />
  </div>
  <div class="card-list">
    <ServiceCard v-for="(service, index) of services" :key="index" :services="service" />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  margin: auto;
  margin-top: var(--default-space);
  margin-bottom: var(--default-space);
  max-width: 400px;
}
.card-list {
  padding: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: normal;
  align-content: normal;
  justify-content: center;
  text-align: left;
}
</style>
