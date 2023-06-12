<script setup lang="ts">
import { getUniqueId } from '@purista/core'
import { type Edge, MarkerType, type Node as FlowNode } from '@vue-flow/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getCommandId, getEndpointId, getSubscriptionId } from '@/helper'
import { useStore } from '@/stores'
import { EdgeLabel, isCommand, isEndpoint, isSubscription, NodeType } from '@/types'

import ExampleDisplay from './ExampleDisplay.vue'
import JsonSchemaDisplay from './JsonSchemaDisplay.vue'
import MarkdownContent from './MarkdownContent.vue'
import TypeDisplay from './TypeDisplay.vue'
import YamlDisplay from './YamlDisplay.vue'

const props = defineProps<{ serviceName: string; serviceVersion: string; commandName: string }>()

const store = useStore()
const router = useRouter()

const backToService = () =>
  router.push({ name: 'serviceInfo', params: { serviceName: props.serviceName, serviceVersion: props.serviceVersion } })

const command = computed(() =>
  store.getCommandByServiceAndName(props.serviceName, props.serviceVersion, props.commandName),
)

const maxDepth = ref(1)

const elements = computed(() => {
  const nodes: FlowNode[] = []

  const edges: Edge[] = []

  const id = getCommandId(props.serviceName, props.serviceVersion, props.commandName)
  const commandNode = store.getCommandByServiceAndName(props.serviceName, props.serviceVersion, props.commandName)

  if (!commandNode) {
    return { edges, nodes }
  }

  const nodeIds = new Set<string>()

  const parentNode = {
    type: NodeType.Command,
    id,
    label: commandNode.name,
    position: { x: 0, y: 0 },
    data: {
      graphNodeType: NodeType.Command,
      serviceName: props.serviceName,
      serviceVersion: props.serviceVersion,
      width: commandNode.name.length,
      ...commandNode,
    },
  }

  nodes.push(parentNode)

  store.getInputNodes(id).forEach((node) => {
    const n = {
      id: '',
      type: node.graphNodeType,
      position: { x: 0, y: 0 },
      label: node.name,
      data: {
        width: node.name.length,
        ...node,
      },
    }
    const i: string = ''

    if (isCommand(node)) {
      n.id = getCommandId(node.serviceName, node.serviceVersion, node.name)
    }

    if (isSubscription(node)) {
      n.id = getSubscriptionId(node.serviceName, node.serviceVersion, node.name)
    }

    if (isEndpoint(node)) {
      n.id = getEndpointId(node.serviceVersion, node.method, node.path)
    }

    if (!nodeIds.has(i)) {
      nodes.push(n)
    }

    edges.push({
      id: getUniqueId(),
      target: parentNode.id,
      source: n.id,
      label: EdgeLabel.Invoke,
      markerEnd: MarkerType.ArrowClosed,
      sourceHandle: 'bottom',
      targetHandle: 'top',
    })
  })

  return { edges, nodes }
})

const inputSchema = computed(() => command.value?.inputSchema)
const parameterSchema = computed(() => command.value?.parameterSchema)

const outputSchema = computed(() => command.value?.outputSchema)

const activeInputTab = ref('tsTypes')
const activeOutputTab = ref('tsTypes')

const depsInvokes = computed(() => {
  if (!command.value) {
    return []
  }

  return command.value.invokes.map((entry) => ({ ...entry, kind: 'command' }))
})

const depsInvokedBy = computed(() => {
  return []
})

const depsSubscriptions = computed(() => {
  return []
})
</script>

<template>
  <template v-if="command">
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
            style="text-align: center; color: var(--command-color); font-size: 1.2rem; margin-top: var(--default-space)"
          >
            <strong>{{ commandName }}</strong>
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
                <strong>Invokes Others</strong>
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
            {{ props.commandName }}
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

        <div style="color: var(--el-text-color-secondary); margin-top: 5px">{{ command?.description || '' }}</div>
        <el-divider />

        <div style="margin-bottom: var(--default-space); margin-top: var(--default-space)">
          <strong style="margin-right: var(--default-space)">Publishes:</strong>
          <el-tag v-if="command.eventName" size="large" type="success" effect="dark">{{ command.eventName }}</el-tag>
          <span v-else>regular message without event name</span>
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
        <FlowBlock :elements="elements" />
        <div class="slider-block">
          <div style="color: var(--el-text-color-secondary)"><small>Depth</small></div>
          <el-slider v-model="maxDepth" show-input :min="1" :max="10" show-stops />
        </div>

        <div id="it-invokes" class="anchor"></div>
        <h4>Invokes commands</h4>
        <el-table
          :data="depsInvokes"
          style="width: 100%"
          :empty-text="'Command ' + commandName + ' does not invoke other known commands'"
          stripe
        >
          <el-table-column prop="kind" label="Type" width="180" sortable />
          <el-table-column prop="serviceName" label="Service" width="180" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="100" sortable />
          <el-table-column prop="serviceTarget" label="Name" sortable />
        </el-table>

        <div id="invoked-by" class="anchor"></div>
        <h4>Invoked by</h4>
        <el-table
          :data="depsInvokedBy"
          style="width: 100%"
          :empty-text="'Command ' + commandName + ' is not invoked by known commands or subscriptions'"
          stripe
        >
          <el-table-column prop="kind" label="Type" width="180" style="border-left: 5px solid">
            <template #default="scope">
              <div
                style="border-left: 5px solid; padding-left: 5px"
                :style="{
                  borderColor: scope.row.kind === 'command' ? 'var(--command-color)' : 'var(--subscription-color)',
                }"
              >
                {{ scope.row.kind }}
              </div>
            </template> </el-table-column
          >>
          <el-table-column prop="serviceName" label="Service" width="180" sortable />
          <el-table-column prop="serviceVersion" label="Version" width="100" sortable />
          <el-table-column prop="serviceTarget" label="Name" sortable />
        </el-table>

        <div id="subscribed-by" class="anchor"></div>
        <h4>Result subscribed by</h4>
        <el-table
          :data="depsSubscriptions"
          style="width: 100%"
          :empty-text="'Success result of command ' + commandName + ' is not consumed by any known subscription'"
          stripe
        >
          <el-table-column prop="kind" label="Type" width="180" />
          <el-table-column prop="serviceName" label="Service" width="180" />
          <el-table-column prop="serviceVersion" label="Version" width="100" />
          <el-table-column prop="serviceTarget" label="Name" />
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
  <template v-else> Command not found </template>
</template>

<style scoped>
.slider-block {
  display: flex;
  align-items: center;
}

.slider-block .el-slider {
  margin-top: 0;
  margin-left: var(--default-space);
}
</style>
