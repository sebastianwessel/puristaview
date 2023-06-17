<script setup lang="ts">
import { InfoFilled, Share } from '@element-plus/icons-vue'
import { computed } from 'vue'

import ContentWithLeftSidebar from '@/components/ContentWithLeftSidebar.vue'
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
    <ContentWithLeftSidebar>
      <template #sidebar>
        <div style="position: fixed; margin-top: 100px">
          <el-menu style="border-right: none !important; width: 240px; --el-menu-bg-color: none" :router="true">
            <el-menu-item index="projectInfo" :route="{ name: 'projectInfo', params: { projectId } }"
              ><template #title>
                <el-icon><InfoFilled /></el-icon>
                <strong>Project Info</strong>
              </template></el-menu-item
            >
            <el-menu-item index="services" :route="{ name: 'services', params: { projectId } }"
              ><template #title>
                <el-icon><Share /></el-icon>
                <strong>Services</strong>
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
.content {
  text-align: center;
  margin-top: 60px;
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
