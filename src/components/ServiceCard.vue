<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { Service } from '@/types'

const router = useRouter()

const props = defineProps<{ services: Service[] }>()

const serviceName = computed(() => props.services[0].name)
const serviceDescription = computed(() => props.services[props.services.length - 1].description)

const viewServiceVersion = (serviceName: string, serviceVersion: string) => {
  router.push({
    name: 'serviceInfo',
    params: {
      serviceName,
      serviceVersion,
    },
  })
}
</script>

<template>
  <el-card shadow="hover" class="border-left-service flex-item">
    <template #header>
      <div>{{ serviceName }}</div>
      <div class="subheadline">
        <small>{{ serviceDescription }}</small>
      </div>
    </template>
    <ul class="version-button-list">
      <li v-for="(service, index) of services" :key="index">
        <el-button
          plain
          :type="index > 0 ? 'default' : 'primary'"
          @click="viewServiceVersion(service.name, service.version)"
        >
          version {{ service.version }}
        </el-button>
      </li>
    </ul>
  </el-card>
</template>

<style scoped lang="scss">
.subheadline {
  color: var(--el-text-color-secondary);
  height: 2.2rem;
}
.version-button-list {
  margin: 0px;
  padding: 0px;

  li {
    list-style: none;
    margin: 0px;
    padding: 0px;
    margin-bottom: var(--default-space);

    .el-button {
      width: 100%;
    }
  }
}
.flex-item {
  text-decoration: none;
  width: 280px;
  flex-grow: 1;
  flex-shrink: 1;
  list-style: none;
  margin: 10px;
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
</style>
