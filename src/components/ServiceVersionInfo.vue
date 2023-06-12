<script setup lang="ts">
import { sort } from 'fast-sort'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import MarkdownContent from '@/components/MarkdownContent.vue'
import { useServicesStore } from '@/stores/services'

const serviceStore = useServicesStore()

const router = useRouter()

const props = defineProps<{ serviceName: string; serviceVersion: string }>()

const service = serviceStore.getServiceByNameAndVersion(props.serviceName, props.serviceVersion)

const backToOverview = () => router.push({ name: 'services' })

const markdownText = computed(() => service?.markdown)

const commands = computed(() => {
  if (!service) {
    return []
  }
  return sort(service.commands).by({
    asc: (u) => u.name,
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
  })
})

const subscriptions = computed(() => {
  if (!service) {
    return []
  }
  return sort(service.subscriptions).by({
    asc: (u) => u.name,
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
  })
})

const events = computed(() => [])

const endpoints = computed(() => [])
</script>

<template>
  <template v-if="service">
    <el-container>
      <el-aside class="sidebar">
        <div style="position: fixed">
          <el-page-header title="Service overview" style="margin-left: 25px; margin-top: 60px" @back="backToOverview">
          </el-page-header>

          <div
            style="text-align: center; color: var(--service-color); font-size: 1.2rem; margin-top: var(--default-space)"
          >
            <strong>{{ serviceName }} v{{ serviceVersion }}</strong>
          </div>
          <el-menu style="border-right: none !important; width: 290px; --el-menu-bg-color: none" :router="true">
            <el-menu-item index="#general"
              ><template #title>
                <el-icon><InfoFilled /></el-icon>
                <strong>Service Information</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#commands">
              <template #title>
                <el-icon><Switch /></el-icon>
                <strong>Commands</strong><small> ({{ commands.length }})</small>
              </template>
            </el-menu-item>
            <el-menu-item index="#subscriptions">
              <template #title>
                <el-icon><Notification /></el-icon>
                <strong>Subscriptions</strong><small> ({{ subscriptions.length }})</small>
              </template>
            </el-menu-item>
            <el-menu-item index="#events">
              <template #title>
                <el-icon><Bell /></el-icon>
                <strong>Events</strong><small> ({{ events.length }})</small>
              </template>
            </el-menu-item>
            <el-menu-item index="#rest-api">
              <template #title>
                <el-icon><Link /></el-icon>
                <strong>REST-API</strong>
              </template>
            </el-menu-item>
            <el-menu-item index="#dependencies">
              <template #title>
                <el-icon><Share /></el-icon>
                <strong>Service Dependencies</strong>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <el-main style="margin-top: var(--default-space); margin-bottom: 60px">
        <div id="general" class="anchor"></div>
        <div>
          <h2 style="margin-right: 5px">
            {{ props.serviceName }}
            <small style="color: var(--el-text-color-secondary)">(v{{ props.serviceVersion }})</small>
            <el-tag
              v-if="service.deprecated"
              effect="dark"
              type="danger"
              size="large"
              style="margin-left: var(--default-space)"
              >deprecated</el-tag
            >
          </h2>
        </div>

        <div style="color: var(--el-text-color-secondary); margin-top: 5px">{{ service?.description || '' }}</div>
        <el-divider />

        <template v-if="markdownText">
          <MarkdownContent :markdown="markdownText" />
        </template>

        <div id="commands" class="anchor"></div>
        <h2>Commands</h2>
        <el-table
          :data="commands"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no commands'"
          stripe
          :default-sort="{ prop: 'name', order: 'ascending' }"
        >
          <el-table-column prop="name" label="Name" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: 'commandInfo',
                  params: {
                    serviceName: service.name,
                    serviceVersion: service.version,
                    commandName: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="eventName" label="Emits" width="300" sortable />
        </el-table>
        <el-divider />

        <div id="subscriptions" class="anchor"></div>
        <h2>Subscriptions</h2>
        <el-table
          :data="subscriptions"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no subscriptions'"
          stripe
          :default-sort="{ prop: 'name', order: 'ascending' }"
        >
          <el-table-column prop="name" label="Name" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: 'subscriptionInfo',
                  params: {
                    serviceName: service.name,
                    serviceVersion: service.version,
                    subscriptionName: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="eventName" label="Emits" width="300" sortable />
        </el-table>
        <el-divider />

        <div id="events" class="anchor"></div>
        <h2>Events</h2>
        <el-table
          :data="events"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no events'"
          stripe
          :default-sort="{ prop: 'name', order: 'ascending' }"
        >
          <el-table-column prop="kind" sortable />
          <el-table-column prop="name" label="Name" sortable />
          <el-table-column prop="eventName" label="Emits" width="300" sortable />
        </el-table>
        <el-divider />

        <div id="rest-api" class="anchor"></div>
        <h2>REST-API endpoints</h2>
        <el-table
          :data="endpoints"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no REST-API endpoints'"
          stripe
          :default-sort="{ prop: 'path', order: 'descending' }"
        >
          <el-table-column prop="method" label="Name" sortable />
          <el-table-column prop="path" label="Emits" width="300" sortable />
        </el-table>
        <el-divider />

        <div id="dependencies" class="anchor"></div>
        <h2>Dependencies</h2>
        <el-divider />

        <el-backtop :right="100" :bottom="100" />
      </el-main>
    </el-container>
  </template>
  <template v-else> Service not found </template>
</template>

<style>
:root {
  --bg-color: #000000;
}
</style>
