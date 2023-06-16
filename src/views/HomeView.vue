<script setup lang="ts">
import { computed } from 'vue'

import { useProjects } from '@/stores'

const store = useProjects()

const projects = computed(() => store.projects)
</script>

<template>
  <div class="bg">
    <div class="content">
      <img
        src="/purista_voyage.png"
        alt="PURISTA -Voyage"
        style="display: block; margin: auto; margin-bottom: 20px; margin-top: 20px"
      />
      <h1>Get the big picture of your distributed system</h1>
      <p>
        Gain a comprehensive understanding of your services and events, while visualizing the flow with event swimlanes!
      </p>

      <h3 style="margin-top: 50px">Select your project</h3>
      <div class="card-list">
        <RouterLink
          v-for="(project, index) of projects"
          :key="index"
          :to="{ name: 'projectInfo', params: { projectId: project.id } }"
          class="flex-item"
        >
          <el-card shadow="hover" class="border-top-service" style="background-color: var(--el-fill-color-lighter)">
            <template #header>
              <div>
                <strong style="margin-left: 5px; font-size: 1.2rem">{{ project.name }}</strong>
              </div>
            </template>
            {{ project.description }}
          </el-card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-position: fixed;
  background: linear-gradient(-60deg, #e3ffe7 0%, #d9e7ff 100%);
  min-height: 100vh;
}

.content {
  text-align: center;
  padding-top: 30px;
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
