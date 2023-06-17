<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import ServiceCard from '@/components/ServiceCard.vue'
import { useStore } from '@/stores'

const _props = defineProps<{ projectId?: string }>()

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
  <div>
    <h2 style="margin-right: 5px; flex-grow: 1; margin-top: 0px">Services</h2>
  </div>

  <div style="color: var(--el-text-color-secondary)">
    <el-input v-model="search" :prefix-icon="Search" placeholder="Search for servie name" clearable />
  </div>
  <el-divider />

  <div class="card-list">
    <ServiceCard v-for="(service, index) of services" :key="index" :services="service" />
  </div>
</template>

<style scoped lang="scss">
.content {
  text-align: center;
  margin-top: var(--top-bar-height);
}

.el-statistic {
  --el-statistic-content-font-size: 38px;
  font-weight: bold;
}

.card-list {
  padding: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: left;
  align-content: left;
  justify-content: left;
  text-align: center;
  gap: 10px;

  .flex-item {
    text-decoration: none;
    width: 280px;
    flex-grow: 1;
    flex-shrink: 1;
    list-style: none;
    padding: 0px;
    display: block;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;

    .el-card {
      height: 100%;
    }
  }
}
</style>
