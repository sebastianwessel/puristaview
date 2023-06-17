<script setup lang="ts">
import { ArrowLeft, Bell, InfoFilled, Link, Notification, Setting, Share, Switch } from '@element-plus/icons-vue'
import { sort } from 'fast-sort'
import { computed, ref } from 'vue'

import MarkdownContent from '@/components/MarkdownContent.vue'
import { useStore } from '@/stores'
import type { Event } from '@/types'

import ContentWithLeftSidebar from './ContentWithLeftSidebar.vue'

const store = useStore()

const props = defineProps<{ serviceName: string; serviceVersion: string; projectId: string }>()

const service = computed(() => store.getServiceByNameAndVersion(props.serviceName, props.serviceVersion))

const markdownText = computed(() => service.value?.markdown)

const commands = computed(() => {
  if (!service.value) {
    return []
  }
  return sort(service.value.commands).by({
    asc: (u) => u.name,
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
  })
})

const subscriptions = computed(() => {
  if (!service.value) {
    return []
  }
  return sort(service.value.subscriptions).by({
    asc: (u) => u.name,
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
  })
})

const events = computed(() => {
  if (!service.value) {
    return []
  }

  const consumedEvents: Record<string, unknown>[] = []
  const publishedEvents: Record<string, unknown>[] = []

  service.value.commands.forEach((command) => {
    if (!command.eventName || !service.value) {
      return
    }

    const event = {
      name: command.eventName,
      producer: {
        name: command.name,
        kind: 'command',
      },
    }

    publishedEvents.push(event)
  })

  service.value.subscriptions.forEach((subscription) => {
    if (!subscription.eventName || !service.value) {
      return
    }

    const producer = {
      name: subscription.name,
      kind: 'subscription',
    }

    const event = {
      name: subscription.eventName,
      producer,
    }
    publishedEvents.push(event)

    if (subscription.subscribesTo.eventname) {
      const publishes = {
        name: subscription.subscribesTo.eventname,
        producer,
      }
      consumedEvents.push(publishes)
    }
  })

  return [
    ...publishedEvents.map((e) => ({ ...e, kind: 'publishes' })),
    ...consumedEvents.map((e) => ({ ...e, kind: 'consumes' })),
  ]
})

const endpoints = computed(() => {
  if (!service.value) {
    return []
  }
  const res = service.value.commands
    .filter((command) => !!command.restApi)
    .map((command) => {
      return {
        commandName: command.name,
        method: command.restApi?.method,
        path: `v${service.value?.version}/${command.restApi?.path}`.replace('//', '/'),
      }
    })

  return sort(res).by({
    asc: (u) => u.path,
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
  })
})

const activeConfigTab = ref('tsTypes')
</script>

<template>
  <template v-if="service">
    <ContentWithLeftSidebar>
      <template #sidebar>
        <div style="position: fixed; margin-top: 50px">
          <div
            style="
              text-align: left;
              color: var(--command-color);
              font-size: 1.2rem;
              margin-left: var(--default-space);
              margin-top: var(--default-space);
              margin-bottom: var(--default-space);
            "
          >
            <strong>{{ service.name }}</strong>
          </div>
          <el-menu style="border-right: none !important; width: 240px; --el-menu-bg-color: none" :router="true">
            <el-menu-item index="#general"
              ><template #title>
                <el-icon><InfoFilled /></el-icon>
                <strong>Service Information</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#commands">
              <template #title>
                <el-icon><Switch /></el-icon>
                <strong>Commands</strong><small>&nbsp;({{ commands.length }})</small>
              </template>
            </el-menu-item>
            <el-menu-item index="#subscriptions">
              <template #title>
                <el-icon><Notification /></el-icon>
                <strong>Subscriptions</strong><small>&nbsp;({{ subscriptions.length }})</small>
              </template>
            </el-menu-item>
            <el-menu-item index="#events">
              <template #title>
                <el-icon><Bell /></el-icon>
                <strong>Events</strong><small>&nbsp;({{ events.length }})</small>
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
            <el-menu-item index="#configuration">
              <template #title>
                <el-icon><Setting /></el-icon>
                <strong>Custom Configuration</strong>
              </template>
            </el-menu-item>
            <el-menu-item
              index="#schema"
              style="margin-top: 60px"
              :route="{
                name: 'services',
                params: {
                  projectId: projectId,
                },
              }"
              ><template #title>
                <el-icon><ArrowLeft /></el-icon>
                <strong>Services</strong>
              </template></el-menu-item
            >
          </el-menu>
        </div>
      </template>
      <template #content>
        <div id="general" class="anchor"></div>
        <div>
          <h2 style="margin-right: 5px">
            Service {{ props.serviceName }}
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
          :default-sort="{ prop: 'name', order: 'descending' }"
          border
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
                style="text-decoration: none; display: block"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="eventName" label="Emits" width="300" sortable>
            <template #default="scope">
              <el-tag v-if="scope.row.eventName" size="large" type="success" effect="dark">{{
                scope.row.eventName
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-divider />

        <div id="subscriptions" class="anchor"></div>
        <h2>Subscriptions</h2>
        <el-table
          :data="subscriptions"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no subscriptions'"
          stripe
          :default-sort="{ prop: 'name', order: 'descending' }"
          border
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
                style="text-decoration: none; display: block"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="subscribesTo.eventName" label="Subscribes" width="300" sortable>
            <template #default="scope">
              <el-tag v-if="scope.row.subscribesTo.eventName" size="large" type="success" effect="dark">{{
                scope.row.subscribesTo.eventName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="eventName" label="Emits" width="300" sortable>
            <template #default="scope">
              <el-tag v-if="scope.row.eventName" size="large" type="success" effect="dark">{{
                scope.row.eventName
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-divider />

        <div id="events" class="anchor"></div>
        <h2>Events</h2>
        <el-table
          :data="events"
          style="width: 100%"
          :empty-text="'Service ' + service.name + ' has no events'"
          stripe
          :default-sort="{ prop: 'name', order: 'descending' }"
          border
        >
          <el-table-column prop="kind" sortable width="120" />
          <el-table-column prop="name" width="300" sortable>
            <template #default="scope">
              <el-tag
                v-if="scope.row.name"
                size="large"
                :type="scope.row.kind === 'publishes' ? 'success' : ''"
                effect="dark"
                >{{ scope.row.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="producer.kind" sortable width="140" />
          <el-table-column prop="producer.name" sortable>
            <template #default="scope">
              <RouterLink
                :to="
                  scope.row.producer.kind === 'subscription'
                    ? {
                        name: 'subscriptionInfo',
                        params: {
                          serviceName: service.name,
                          serviceVersion: service.version,
                          subscriptionName: scope.row.producer.name,
                        },
                      }
                    : {
                        name: 'commandInfo',
                        params: {
                          serviceName: service.name,
                          serviceVersion: service.version,
                          commandName: scope.row.producer.name,
                        },
                      }
                "
                style="text-decoration: none; display: block"
                ><strong>{{ scope.row.producer.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
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
          border
        >
          <el-table-column prop="method" label="Name" width="120" sortable />
          <el-table-column prop="path" label="Path" sortable />
          <el-table-column prop="commandName" label="Invokes" width="300" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: 'commandInfo',
                  params: {
                    serviceName: service.name,
                    serviceVersion: service.version,
                    commandName: scope.row.commandName,
                  },
                }"
                style="text-decoration: none; display: block"
                ><strong>{{ scope.row.commandName }}</strong></RouterLink
              >
            </template>
          </el-table-column>
        </el-table>
        <el-divider />

        <div id="dependencies" class="anchor"></div>
        <h2>Dependencies</h2>
        <p>SOON 🤫</p>
        <el-divider />

        <div id="configuration" class="anchor"></div>
        <h2>Custom Configuration</h2>
        <template v-if="service.configSchema">
          <el-tabs v-model="activeConfigTab">
            <el-tab-pane label="Typescript" name="tsTypes">
              <TypeDisplay :schema="service.configSchema" />
            </el-tab-pane>

            <el-tab-pane label="OpenAPI-Schema" name="openApiSchema">
              <YamlDisplay :schema="service.configSchema" />
            </el-tab-pane>

            <el-tab-pane label="Example-Json" name="example">
              <ExampleDisplay :schema="service.configSchema" />
            </el-tab-pane>
          </el-tabs>
        </template>
        <p v-else>This service has not custom configuration.</p>

        <el-backtop :right="100" :bottom="100" />
      </template>
    </ContentWithLeftSidebar>
  </template>
  <template v-else> Service not found </template>
</template>

<style>
:root {
  --bg-color: #000000;
}
</style>
