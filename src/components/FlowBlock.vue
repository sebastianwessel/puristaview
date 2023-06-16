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
import { useDependencyGraph } from '@/composeables/useDependencyGraph'
import { logger } from '@/logger'

const props = defineProps<{ id: string }>()

const flowDiagram = ref<HTMLElement | null>(null)

const nodeTypes = {
  payload: markRaw(PayloadNode),
  event: markRaw(EventNode),
  command: markRaw(CommandNode),
  endpoint: markRaw(EndpointNode),
  subscription: markRaw(SubscriptionNode),
}

const depNodes = ref<FlowNode[]>([])
const depEdges = ref<Edge[]>([])

const { fitView, nodes } = useVueFlow({
  fitViewOnInit: true,
  nodeTypes,
  nodes: depNodes.value,
  edges: depEdges.value,
})

const { getDependencies } = useDependencyGraph()

const isGeneratingGraph = ref(true)

const maxDepth = ref(1)

const computeGraph = () => {
  isGeneratingGraph.value = true
  depNodes.value = []
  depEdges.value = []
  const elkInstance = new ELK()
  const { elk } = getDependencies({
    nodes: depNodes.value,
    edges: depEdges.value,
    id: props.id,
    maxDepth: maxDepth.value,
  })

  elkInstance
    .layout(elk)
    .then((graph) => {
      const update = (n: ElkNode, offX = 0, offY = 0, i = 0) => {
        const x = (n.x || 0) + offX
        const y = (n.y || 0) + offY
        const nodeToUpdate = nodes.value.find((n2) => n2.id === n.id)
        if (nodeToUpdate) {
          nodeToUpdate.position = { x, y }
        }
        n.children?.forEach((c) => update(c, x, y, i + 1))
      }

      update(graph)

      fitView()
      isGeneratingGraph.value = false
    })
    .catch((err) => logger.error({ err }))
}

onMounted(computeGraph)

watch(maxDepth, computeGraph)

watch(
  () => props.id,
  () => {
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
      :nodes-draggable="true"
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
    <div class="slider-block">
      <div style="color: var(--el-text-color-secondary)"><small>Depth</small></div>
      <el-slider v-model="maxDepth" show-input :min="1" :max="10" show-stops />
    </div>
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
    height: calc(100vh - 60px);
    width: 100vw;
  }
  .slider-block {
    margin: 10px;
  }
}
</style>

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
