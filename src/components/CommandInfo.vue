<script setup lang="ts">
import { ArrowLeft, InfoFilled, Notification, Share, Switch } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

import { getCommandId } from '@/helper'
import { useStore } from '@/stores'

import ExampleDisplay from './ExampleDisplay.vue'
import JsonSchemaDisplay from './JsonSchemaDisplay.vue'
import MarkdownContent from './MarkdownContent.vue'
import TypeDisplay from './TypeDisplay.vue'
import YamlDisplay from './YamlDisplay.vue'

const props = defineProps<{ serviceName: string; serviceVersion: string; commandName: string; projectId: string }>()

const store = useStore()

const command = computed(() =>
  store.getCommandByServiceAndName(props.serviceName, props.serviceVersion, props.commandName),
)

const graphId = computed(() => getCommandId(props.serviceName, props.serviceVersion, props.commandName))

const inputSchema = computed(() => command.value?.inputSchema)
const parameterSchema = computed(() => command.value?.parameterSchema)

const outputSchema = computed(() => command.value?.outputSchema)

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
  <template v-if="command">
    <ContentWithLeftSidebar>
      <template #sidebar>
        <div style="position: fixed; margin-top: 50px">
          <div
            style="
              color: var(--command-color);
              font-size: 1.2rem;
              margin-top: var(--default-space);
              margin-left: var(--default-space);
              margin-bottom: var(--default-space);
            "
          >
            <strong>{{ commandName }}</strong>
          </div>
          <el-menu style="border-right: none !important; width: 240px; --el-menu-bg-color: none" :router="true">
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
            <el-menu-item
              index="#schema"
              style="margin-top: 60px"
              :route="{
                name: 'serviceInfo',
                params: {
                  serviceName: serviceName,
                  serviceVersion: serviceVersion,
                  projectId: projectId,
                },
              }"
              ><template #title>
                <el-icon><ArrowLeft /></el-icon>
                <strong>{{ props.serviceName + ' v' + props.serviceVersion }}</strong>
              </template></el-menu-item
            >
          </el-menu>
        </div>
      </template>
      <template #content>
        <div id="general" class="anchor"></div>
        <div>
          <h2 style="margin-right: 5px; flex-grow: 1">
            Command {{ props.commandName }}
            <el-tag
              v-if="command.deprecated"
              effect="dark"
              type="danger"
              size="large"
              style="margin-left: var(--default-space)"
              >deprecated</el-tag
            >
          </h2>
        </div>

        <div style="color: var(--el-text-color-secondary)">{{ command?.description || '' }}</div>
        <el-divider />

        <div style="margin-bottom: var(--default-space); margin-top: var(--default-space)">
          <el-descriptions :column="2" direction="vertical">
            <el-descriptions-item label="Publishes">
              <el-tag v-if="command.eventName" size="large" type="success" effect="dark">{{
                command.eventName
              }}</el-tag>
              <span v-else>regular message without event name</span>
            </el-descriptions-item>
            <el-descriptions-item label="REST-endpoint">
              <template v-if="command.restApi">
                <strong>{{ command.restApi?.method }}:</strong> v{{
                  (serviceVersion + '/' + command.restApi?.path).replace('//', '/')
                }}
              </template>
              <span v-else>none</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <template v-if="command.markdown?.trim().length">
          <el-divider />
          <MarkdownContent :markdown="command.markdown" />
        </template>
        <el-divider />

        <div id="dependency-graph" class="anchor"></div>
        <h4>
          Dependency graph of command <i>{{ command.name }}</i>
        </h4>
        <FlowBlock :id="graphId" />
        <div id="it-invokes" class="anchor"></div>
        <h4>Invokes</h4>
        <el-table
          :data="depsInvokes"
          style="width: 100%"
          :empty-text="'Command ' + commandName + ' does not invoke other known commands'"
          stripe
          border
        >
          <el-table-column prop="serviceName" label="Service" width="320" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="120" sortable />
          <el-table-column prop="serviceTarget" label="Name" sortable />
        </el-table>

        <div id="invoked-by" class="anchor"></div>
        <h4>Invoked by</h4>
        <el-table
          :data="depsInvokedBy"
          style="width: 100%"
          :empty-text="'Command ' + commandName + ' is not invoked by known commands or subscriptions'"
          stripe
          border
        >
          <el-table-column prop="graphNodeType" label="Type" width="140" style="border-left: 5px solid" sortable />
          <el-table-column prop="serviceName" label="Service" width="200" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="120" sortable>
            <template #default="scope"
              ><RouterLink
                :to="{
                  name: 'serviceInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                  },
                }"
                style="text-decoration: none; display: block; text-align: right"
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
                style="text-decoration: none; display: block"
                ><strong>{{ scope.row.name }}</strong></RouterLink
              >
            </template>
          </el-table-column>
        </el-table>

        <div id="subscribed-by" class="anchor"></div>
        <h4>Result subscribed by</h4>
        <el-table
          :data="depsSubscriptions"
          style="width: 100%"
          :empty-text="'Success result of command ' + commandName + ' is not consumed by any known subscription'"
          stripe
          border
        >
          <el-table-column prop="graphNodeType" label="Type" width="140" sortable />
          <el-table-column prop="serviceName" label="Service" width="200" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="120" sortable>
            <template #default="scope"
              ><RouterLink
                :to="{
                  name: 'serviceInfo',
                  params: {
                    serviceName: scope.row.serviceName,
                    serviceVersion: scope.row.serviceVersion,
                  },
                }"
                style="text-decoration: none; display: block; text-align: right"
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
                style="text-decoration: none; display: block"
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
      </template>
    </ContentWithLeftSidebar>
  </template>
  <template v-else> Command not found </template>
</template>
