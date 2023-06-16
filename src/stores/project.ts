import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Project } from '@/types'

import { exampleData } from './exampleData'

const demoProject: Project = {
  id: 'demo',
  name: 'Example demo',
  description: 'A simple example for Voyage',
  markdown: `
This is an example project which demonstrates the basic features of PURISTA Voyage.
`,
  services: exampleData,
}

export const useProjects = defineStore('projects', () => {
  const projects = ref<Project[]>([demoProject])
  const activeProject = ref<Project | undefined>()

  const isProjectSelected = computed(() => !!activeProject.value)

  const setProjectActive = function (id: string) {
    const activeRes = projects.value.find((project) => project.id === id)
    if (activeRes) {
      activeProject.value = activeRes
      return true
    }

    return false
  }

  return {
    isProjectSelected,
    activeProject,
    setProjectActive,
    projects,
  }
})
