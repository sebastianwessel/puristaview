<script setup lang="ts">
import { Bell, InfoFilled, Link, Share } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ContentWithLeftSidebar from '@/components/ContentWithLeftSidebar.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import { useProjects, useStore } from '@/stores'

const _props = defineProps<{ projectId?: string }>()

const store = useStore()
const projects = useProjects()
const route = useRoute()

const serviceCount = computed(() => store.servicesGroupedByName.length)
const eventCount = computed(() => store.allEvents.length)
const endpointCount = computed(() => store.allEndpoints.length)

const project = computed(() => projects.activeProject)

const active = computed(() => {
  const part = route.path.split('/')

  if (part.length < 4) {
    return 'projectInfo'
  }
  if (part[3].includes('services')) {
    return 'services'
  }
  if (part[3].includes('events')) {
    return 'events'
  }
  if (part[3].includes('rest-api')) {
    return 'restApi'
  }
  return 'projectInfo'
})
</script>

<template>
  <template v-if="project">
    <ContentWithLeftSidebar>
      <template #sidebar>
        <div style="position: fixed; margin-top: 100px">
          <el-menu
            :default-active="active"
            style="border-right: none !important; width: 240px; --el-menu-bg-color: none"
            :router="true"
          >
            <el-menu-item index="projectInfo" :route="{ name: 'projectInfo', params: { projectId } }"
              ><template #title>
                <el-icon><InfoFilled /></el-icon>
                <strong>Project Info</strong>
              </template></el-menu-item
            >
            <el-menu-item index="services" :route="{ name: 'services', params: { projectId } }"
              ><template #title>
                <el-icon><Share /></el-icon>
                <strong>Services</strong><small>&nbsp;({{ serviceCount }})</small>
              </template></el-menu-item
            >

            <el-menu-item index="events" :route="{ name: 'events', params: { projectId } }"
              ><template #title>
                <el-icon><Bell /></el-icon>
                <strong>Events</strong><small>&nbsp;({{ eventCount }})</small>
              </template></el-menu-item
            >
            <el-menu-item index="restApi" :route="{ name: 'restApi', params: { projectId } }"
              ><template #title>
                <el-icon><Link /></el-icon>
                <strong>Rest-API</strong><small>&nbsp;({{ endpointCount }})</small>
              </template></el-menu-item
            >
          </el-menu>
        </div>
      </template>
      <template #content>
        <RouterView />
      </template>
    </ContentWithLeftSidebar>
  </template>
  <template v-else>no project</template>
</template>

<style scoped lang="scss">
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.content {
  text-align: center;
  margin-top: var(--top-bar-height);
}

.el-statistic {
  --el-statistic-content-font-size: 38px;
  font-weight: bold;
}
.card-list {
  max-width: 80%;
  margin: auto;
  padding: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: normal;
  align-content: normal;
  justify-content: center;
  text-align: left;

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
}
</style>
