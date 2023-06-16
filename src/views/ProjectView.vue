<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import TopNav from '@/components/TopNav.vue'
import { useProjects, useStore } from '@/stores'

const props = defineProps<{ projectId: string }>()

const graphStore = useStore()
const projectStore = useProjects()

const isProjectActive = ref(false || projectStore.isProjectSelected)

const project = computed(() => projectStore.activeProject)

const loadProject = () => {
  const success = projectStore.setProjectActive(props.projectId)
  if (success) {
    graphStore.init(project.value?.services || [])
    isProjectActive.value = true
  } else {
    isProjectActive.value = false
  }
}

onBeforeMount(() => loadProject())

watch(() => props, loadProject, { deep: true })
</script>

<template>
  <template v-if="project">
    <el-container width="100%">
      <el-header>
        <TopNav />
      </el-header>
      <RouterView />
    </el-container>
  </template>
  <template v-else>
    <h1>Project not found</h1>
  </template>
</template>
