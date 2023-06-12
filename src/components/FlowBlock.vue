<script setup lang="ts">
import { Aim, FullScreen } from '@element-plus/icons-vue'
import { ControlButton, Controls } from '@vue-flow/controls'
import { type Edge, type Node as FlowNode, useVueFlow, VueFlow } from '@vue-flow/core'
import { MiniMap } from '@vue-flow/minimap'
import ELK, { type ElkNode } from 'elkjs'
import { markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import CommandNode from '@/components/FlowNodes/CommandNode.vue'
import EndpointNode from '@/components/FlowNodes/EndpointNode.vue'
import EventNode from '@/components/FlowNodes/EventNode.vue'
import PayloadNode from '@/components/FlowNodes/PayloadNode.vue'
import SubscriptionNode from '@/components/FlowNodes/SubscriptionNode.vue'
import { logger } from '@/logger'

const props = defineProps<{ elements: { nodes: FlowNode[]; edges: Edge[] } }>()

const flowDiagram = ref<HTMLElement | null>(null)

const nodeTypes = {
  payload: markRaw(PayloadNode),
  event: markRaw(EventNode),
  command: markRaw(CommandNode),
  endpoint: markRaw(EndpointNode),
  subscription: markRaw(SubscriptionNode),
}

const depNodes = ref<FlowNode[]>(props.elements.nodes)
const depEdges = ref<Edge[]>(props.elements.edges)

const { fitView, nodes } = useVueFlow({
  fitViewOnInit: true,
  nodeTypes,
  // nodes: depNodes.value,
  // edges: depEdges.value,
})

const isGeneratingGraph = ref(true)

const computeGraph = () => {
  const elk = new ELK({})
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.nodeLabels.placement': 'INSIDE V_CENTER H_CENTER',
      'elk.direction': 'DOWN',
      nodeLayering: 'INTERACTIVE',
      'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.unnecessaryBendpoints': 'true',
      'elk.layered.spacing.edgeNodeBetweenLayers': '50',
      'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'org.eclipse.elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
      'org.eclipse.elk.insideSelfLoops.activate': 'true',
      'spacing.componentComponent': '20',
      'spacing.nodeNodeBetweenLayers': '20',

      /*

    algorithm: 'layered',
    // 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.nodePlacement.strategy': 'SIMPLE',
    'spacing.nodeNodeBetweenLayers': '40',
    'elk.direction': 'DOWN',
    */
    }, // { 'elk.algorithm': 'mrtree', 'spacing.nodeNodeBetweenLayers': 100 },
    children: depNodes.value.map((node) => ({
      id: node.id,
      width: (node.data.width * 10 || 300) + 100,
      height: node.data.eventName ? 150 : 100,
    })),
    edges: depEdges.value.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  elk
    .layout(graph as any)
    .then((graph) => {
      graph.children?.forEach((node) => {
        const nodeToUpdate = nodes.value.find((n) => node.id === n.id)
        if (nodeToUpdate) {
          nodeToUpdate.position = { x: node.x as number, y: node.y as number }
        }
      })
      fitView()
      isGeneratingGraph.value = false
    })
    .catch(logger.error)
}

onMounted(computeGraph)

watch(
  () => props.elements,
  () => {
    depNodes.value = props.elements.nodes
    depEdges.value = props.elements.edges
    computeGraph()
  },
  { deep: true },
)

let isInFullscreen = false
const fullscreenHandler = function () {
  isInFullscreen = !isInFullscreen

  const el = flowDiagram.value
  if (!el) {
    return
  }
  if (isInFullscreen) {
    el.classList.add('flow-block-wrapper-fullscreen')
    fitView()
  } else {
    el.classList.remove('flow-block-wrapper-fullscreen')
  }
}

document.addEventListener('fullscreenchange', fullscreenHandler)

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', fullscreenHandler)
})

const openFullscreen = () => {
  const el = flowDiagram.value
  if (!el) {
    return
  }
  if (!isInFullscreen) {
    el.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const centerFlow = () => fitView()
</script>

<template>
  <div ref="flowDiagram" class="flow-block-wrapper">
    <VueFlow
      v-loading="isGeneratingGraph"
      fit-view-on-init
      :prevent-scrolling="false"
      :nodes-draggable="false"
      :nodes-connectable="false"
      class="flow-block"
      :nodes="depNodes"
      :edges="depEdges"
      ><MiniMap />

      <Controls>
        <template #control-fit-view>
          <ControlButton @click="centerFlow"
            ><el-icon><Aim /></el-icon
          ></ControlButton>
        </template>
        <ControlButton @click="openFullscreen"
          ><el-icon><FullScreen /></el-icon></ControlButton></Controls
    ></VueFlow>
  </div>
</template>

<style lang="scss">
.flow-block-wrapper {
  background: #fff;
  margin-top: var(--default-space);
  margin-bottom: var(--default-space);

  .flow-block {
    border: 1px solid var(--el-border-color-light);
    height: 500px;
  }
}

.flow-block-wrapper-fullscreen {
  .flow-block {
    border: 1px solid var(--el-border-color-light);
    height: 100vh;
    width: 100vw;
  }
}
</style>
