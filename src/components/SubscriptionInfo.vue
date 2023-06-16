<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getSubscriptionId } from '@/helper'
import { useStore } from '@/stores'

const props = defineProps<{
  serviceName: string
  serviceVersion: string
  subscriptionName: string
  projectId: string
}>()

const store = useStore()
const router = useRouter()

const backToService = () =>
  router.push({ name: 'serviceInfo', params: { serviceName: props.serviceName, serviceVersion: props.serviceVersion } })

const subscription = computed(() =>
  store.getSubscriptionByServiceAndName(props.serviceName, props.serviceVersion, props.subscriptionName),
)

const graphId = computed(() => getSubscriptionId(props.serviceName, props.serviceVersion, props.subscriptionName))

const inputSchema = computed(() => subscription.value?.inputSchema)
const parameterSchema = computed(() => subscription.value?.parameterSchema)

const outputSchema = computed(() => subscription.value?.outputSchema)

const activeInputTab = ref('tsTypes')
const activeOutputTab = ref('tsTypes')

const depsInvokes = computed(() => {
  return store.getCommandsInvokedBy(graphId.value)
})
const depsInvokedBy = computed(() => {
  return store.getInputNodes(graphId.value)
})

const depsSubscriptions = computed(() => {
  return store.getConsumingSubscriptions(graphId.value)
})
</script>

<template>
  <template v-if="subscription">
    <el-container>
      <el-aside class="sidebar">
        <div style="position: fixed">
          <el-page-header
            :title="props.serviceName + ' v' + props.serviceVersion"
            style="margin-left: 25px; margin-top: 60px"
            @back="backToService"
          >
          </el-page-header>

          <div
            style="
              text-align: center;
              color: var(--subscription-color);
              font-size: 1.2rem;
              margin-top: var(--default-space);
            "
          >
            <strong>{{ subscriptionName }}</strong>
          </div>
          <el-menu style="border-right: none !important; width: 290px; --el-menu-bg-color: none" :router="true">
            <el-menu-item index="#general"
              ><template #title>
                <el-icon><InfoFilled /></el-icon>
                <strong>General</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#dependency-graph"
              ><template #title>
                <el-icon><Share /></el-icon>
                <strong>Dependency Graph</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#it-invokes"
              ><template #title>
                <el-icon><Switch /></el-icon>
                <strong>Invokes</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#invoked-by"
              ><template #title>
                <el-icon><Switch /></el-icon>
                <strong>Get Invoked By</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#subscribed-by"
              ><template #title>
                <el-icon><Notification /></el-icon>
                <strong>Subscribed By</strong>
              </template></el-menu-item
            >
            <el-menu-item index="#schema"
              ><template #title>
                <el-icon><Share /></el-icon>
                <strong>In-/Output Schema</strong>
              </template></el-menu-item
            >
          </el-menu>
        </div>
      </el-aside>

      <el-main style="margin-top: var(--default-space);!important; margin-bottom: 60px;scroll-margin-top: 300px;">
        <div id="general" class="anchor"></div>
        <div>
          <h2 style="margin-right: 5px; flex-grow: 1">
            Subscription {{ props.subscriptionName }}
            <el-tag
              v-if="subscription.deprecated"
              effect="dark"
              type="danger"
              size="large"
              style="margin-left: var(--default-space)"
              >deprecated</el-tag
            >
          </h2>
        </div>

        <div style="color: var(--el-text-color-secondary); margin-top: 5px">{{ subscription?.description || '' }}</div>
        <el-divider />

        <div style="margin-bottom: var(--default-space); margin-top: var(--default-space)">
          <el-descriptions :column="4" direction="vertical">
            <el-descriptions-item label="Publishes">
              <el-tag v-if="subscription.eventName" size="large" type="success" effect="dark">{{
                subscription.eventName
              }}</el-tag>
              <span v-else>regular message without event name</span>
            </el-descriptions-item>
            <el-descriptions-item label="Durable">
              {{ subscription.eventBridgeConfig?.durable ? 'yes' : 'no' }}
            </el-descriptions-item>
            <el-descriptions-item label="Acknowledge">
              {{ subscription.eventBridgeConfig?.autoacknowledge ? 'on start' : 'after success' }}
            </el-descriptions-item>
            <el-descriptions-item label="Shared">
              {{ subscription.eventBridgeConfig?.shared ? 'yes' : 'no' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="">
          <div>Subscription definition</div>
          <el-descriptions :column="3" direction="horizontal" style="margin-top: var(--default-space)">
            <el-descriptions-item label="Event name">
              {{ subscription.subscribesTo.eventname }}
            </el-descriptions-item>
            <el-descriptions-item label="Message type">
              {{ subscription.subscribesTo.messageType || 'any' }}
            </el-descriptions-item>
            <el-descriptions-item label=""> </el-descriptions-item>

            <el-descriptions-item label="Producer service">
              {{ subscription.subscribesTo.sender?.name || 'any' }}
            </el-descriptions-item>
            <el-descriptions-item label="Producer version">
              {{ subscription.subscribesTo.sender?.version || 'any' }}
            </el-descriptions-item>
            <el-descriptions-item label="Producer name">
              {{ subscription.subscribesTo.sender?.target || 'any' }}
            </el-descriptions-item>

            <el-descriptions-item label="Receiver service">
              {{ subscription.subscribesTo.receiver?.name || 'any' }}
            </el-descriptions-item>
            <el-descriptions-item label="Receiver version">
              {{ subscription.subscribesTo.receiver?.version || 'any' }}
            </el-descriptions-item>
            <el-descriptions-item label="Receiver name">
              {{ subscription.subscribesTo.receiver?.target || 'any' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <template v-if="subscription.markdown?.trim().length">
          <el-divider />
          <MarkdownContent :markdown="subscription.markdown" />
        </template>
        <el-divider />

        <div id="dependency-graph" class="anchor"></div>
        <h4>
          Dependency graph of subscription <i>{{ subscription.name }}</i>
        </h4>
        <FlowBlock :id="graphId" />
        <div id="it-invokes" class="anchor"></div>
        <h4>Invokes</h4>
        <el-table
          :data="depsInvokes"
          style="width: 100%"
          :empty-text="'Subscription ' + subscriptionName + ' does not invoke other known subscriptions'"
          stripe
        >
          <el-table-column prop="serviceName" label="Service" width="320" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="100" sortable>
            <template #default="scope"
              ><RouterLink
                :to="{
                  name: 'serviceInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.serviceVersion }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: 'commandInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                    commandName: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
        </el-table>

        <div id="invoked-by" class="anchor"></div>
        <h4>Triggered by</h4>
        <el-table
          :data="depsInvokedBy"
          style="width: 100%"
          :empty-text="'Subscription ' + subscriptionName + ' is not invoked by known subscriptions or subscriptions'"
          stripe
        >
          <el-table-column prop="graphNodeType" label="Type" width="120" style="border-left: 5px solid" />
          <el-table-column prop="serviceName" label="Service" width="200" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="100" sortable>
            <template #default="scope"
              ><RouterLink
                :to="{
                  name: 'serviceInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.serviceVersion }}</strong></RouterLink
              >
            </template>
          </el-table-column>

          <el-table-column prop="name" label="Name" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: scope.row.graphNodeType + 'Info',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                    [scope.row.graphNodeType + 'Name']: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Event" sortable>
            <template #default="scope">
              <RouterLink
                :to="{
                  name: scope.row.graphNodeType + 'Info',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                    [scope.row.graphNodeType + 'Name']: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><el-tag
                  v-if="scope.row.eventName && scope.row.eventName === subscription.subscribesTo.eventname"
                  size="large"
                  type="success"
                  effect="dark"
                  >{{ scope.row.eventName }}</el-tag
                ></RouterLink
              >
            </template>
          </el-table-column>
        </el-table>

        <div id="subscribed-by" class="anchor"></div>
        <h4>Result subscribed by</h4>
        <el-table
          :data="depsSubscriptions"
          style="width: 100%"
          :empty-text="
            'Success result of subscription ' + subscriptionName + ' is not consumed by any known subscription'
          "
          stripe
        >
          <el-table-column prop="graphNodeType" label="Type" width="120" />
          <el-table-column prop="serviceName" label="Service" width="200"></el-table-column>
          <el-table-column prop="serviceVersion" label="Version" width="100">
            <template #default="scope"
              ><RouterLink
                :to="{
                  name: 'serviceInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.serviceVersion }}</strong></RouterLink
              >
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name">
            <template #default="scope">
              <RouterLink
                :to="{
                  name: scope.row.graphNodeType + 'Info',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                    [scope.row.graphNodeType + 'Name']: scope.row.name,
                  },
                }"
                style="text-decoration: none"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
        </el-table>
        <el-divider />

        <div id="schema" class="anchor"></div>
        <h4>In-/Output Schema</h4>
        <template v-if="inputSchema">
          <h4>Input</h4>
          <el-tabs v-model="activeInputTab">
            <el-tab-pane label="Typescript" name="tsTypes">
              <TypeDisplay :schema="inputSchema" :parameter="parameterSchema" />
            </el-tab-pane>
            <el-tab-pane label="OpenAPI-Schema" name="openApiSchema">
              <YamlDisplay :schema="inputSchema" />
            </el-tab-pane>
            <el-tab-pane label="JSON-Schema" name="jsonSchema">
              <JsonSchemaDisplay :schema="inputSchema" />
            </el-tab-pane>
            <el-tab-pane label="Example-Json" name="example">
              <ExampleDisplay :schema="inputSchema" :parameter="parameterSchema" />
            </el-tab-pane>
          </el-tabs>
          <el-divider />
        </template>

        <template v-if="outputSchema">
          <h4>Output</h4>
          <el-tabs v-model="activeOutputTab">
            <el-tab-pane label="Typescript" name="tsTypes">
              <TypeDisplay :schema="outputSchema" />
            </el-tab-pane>
            <el-tab-pane label="OpenAPI-Schema" name="openApiSchema">
              <YamlDisplay :schema="outputSchema" />
            </el-tab-pane>
            <el-tab-pane label="JSON-Schema" name="jsonSchema">
              <JsonSchemaDisplay :schema="outputSchema" />
            </el-tab-pane>
            <el-tab-pane label="Example-Json" name="example">
              <ExampleDisplay :schema="outputSchema" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-main>
    </el-container>
  </template>
  <template v-else> Subscription not found </template>
</template>
