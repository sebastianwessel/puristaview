<script setup lang="ts">
import { Bell, Grid, Link } from '@element-plus/icons-vue'
import { computed } from 'vue'

import MarkdownContent from '@/components/MarkdownContent.vue'
import { useProjects, useStore } from '@/stores'

const _props = defineProps<{ projectId?: string }>()

const store = useStore()
const projects = useProjects()

const serviceCount = computed(() => store.servicesGroupedByName.length)
const eventCount = computed(() => store.allEvents.length)
const endpointCount = computed(() => store.allEndpoints.length)

const project = computed(() => projects.activeProject)
</script>

<template>
  <template v-if="project">
    <div>
      <h2 style="margin-right: 5px; flex-grow: 1">Command {{ project.name }}</h2>
    </div>

    <div style="color: var(--el-text-color-secondary)">{{ project.description || '' }}</div>
    <el-divider />

    <h3 style="margin-top: 50px">Select your entry point</h3>
    <div class="card-list">
      <RouterLink :to="{ name: 'services' }" class="flex-item">
        <el-card shadow="hover" class="border-top-service" style="background-color: var(--el-fill-color-lighter)">
          <template #header>
            <el-icon>
              <Grid />
            </el-icon>
            <strong style="margin-left: 5px; font-size: 1.2rem">Services</strong>
          </template>
          <el-statistic :value="serviceCount" title="Available services"></el-statistic>
          <p>
            <small>Get an overview of all your services and the commands and subscriptions of every service.</small>
          </p>
        </el-card>
      </RouterLink>
      <RouterLink :to="{ name: 'events' }" class="flex-item">
        <el-card
          header="Events"
          shadow="hover"
          class="border-top-event"
          style="background-color: var(--el-fill-color-lighter)"
        >
          <template #header>
            <el-icon>
              <Bell />
            </el-icon>
            <strong style="margin-left: 5px; font-size: 1.2rem">Events</strong>
          </template>
          <el-statistic :value="eventCount" title="Available events"></el-statistic>
          <p>
            <small>See the shape of events and discover who is publishing and who is consuming events</small>
          </p>
        </el-card>
      </RouterLink>
      <RouterLink :to="{ name: 'restApi' }" class="flex-item">
        <el-card
          header="Rest-API"
          shadow="hover"
          class="border-top-rest-api"
          style="background-color: var(--el-fill-color-lighter)"
        >
          <template #header>
            <el-icon>
              <Link />
            </el-icon>
            <strong style="margin-left: 5px; font-size: 1.2rem">Rest-API</strong>
          </template>
          <el-statistic :value="endpointCount" title="Available endpoints"></el-statistic>
          <p>
            <small>Follow the flow when some endpoint gets called</small>
          </p>
        </el-card>
      </RouterLink>
    </div>

    <template v-if="project.markdown">
      <el-divider />
      <MarkdownContent :markdown="project.markdown"></MarkdownContent>
    </template>
  </template>
  <template v-else>no project</template>
</template>

<style scoped lang="scss">
.content {
  text-align: center;
  margin-top: 60px;
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
