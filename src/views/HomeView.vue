<script setup lang="ts">
import { Bell, Grid, Link } from '@element-plus/icons-vue'
import { ref } from 'vue'

import { useStore } from '@/stores'

const store = useStore()

const serviceCount = ref(store.servicesGroupedByName.length)
const eventCount = ref(store.allEvents.length)
const endpointCount = ref(store.allEndpoints.length)
</script>

<template>
  <div class="content">
    <img
      src="/purista_voyage.svg"
      alt="PURISTA -Voyage"
      style="display: block; margin: auto; margin-bottom: 50px; margin-top: 50px"
    />
    <h1>Get the big picture of your distributed system</h1>
    <p>
      Gain a comprehensive understanding of your services and events, while visualizing the flow with event swimlanes!
    </p>

    <h3 style="margin-top: 50px">Select your entry point</h3>
    <div class="card-list">
      <RouterLink :to="{ name: 'services' }" class="flex-item">
        <el-card shadow="hover" class="border-top-service">
          <template #header>
            <el-icon><Grid /></el-icon> Services
          </template>
          <el-statistic :value="serviceCount" title="Available services"></el-statistic>
          <p>
            <small>Get an overview of all your services and the commands and subscriptions of every service.</small>
          </p>
        </el-card>
      </RouterLink>
      <RouterLink :to="{ name: 'events' }" class="flex-item">
        <el-card header="Events" shadow="hover" class="border-top-event">
          <template #header>
            <el-icon><Bell /></el-icon> Events
          </template>
          <el-statistic :value="eventCount" title="Available events"></el-statistic>
          <p>
            <small>See the shape of events and discover who is publishing and who is consuming events</small>
          </p>
        </el-card>
      </RouterLink>
      <RouterLink :to="{ name: 'restApi' }" class="flex-item">
        <el-card header="Rest-API" shadow="hover" class="border-top-rest-api">
          <template #header>
            <el-icon><Link /></el-icon> Rest-API
          </template>
          <el-statistic :value="endpointCount" title="Available endpoints"></el-statistic>
          <p>
            <small>Follow the flow when some endpoint gets called</small>
          </p>
        </el-card>
      </RouterLink>
    </div>
  </div>
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
  width: 1024px;
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
