<script setup lang="ts">
import type { Link } from '@element-plus/icons-vue'
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

type Data = {
  serviceName: string
  serviceVersion: string
  commandName: string
  eventName?: string
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  path: string
}

const props = defineProps<NodeProps<Data>>()
defineEmits(['updateNodeInternals'])

const url = computed(() => `v${props.data.serviceVersion}/${props.data.path}`)
</script>

<template>
  <Handle id="top" type="target" :position="props.targetPosition || Position.Top" />
  <div class="wrapper">
    <div class="icon">
      <el-icon><Link /></el-icon><strong>{{ data.method }}</strong>
    </div>
    <div class="label">
      <strong>{{ url }}</strong>
    </div>
  </div>
  <Handle id="bottom" type="source" :position="props.sourcePosition || Position.Bottom" />
</template>

<style lang="scss">
.vue-flow__node-endpoint {
  border: 1px solid var(--rest-api-color);
  border-radius: var(--el-border-radius-base);

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: start;
    align-items: auto;
    align-content: start;
    background-color: var(--el-fill-color-blank);

    .icon {
      background: var(--rest-api-color);
      flex: 0 0 auto;
      margin: 0px;
      padding: 10px;
      color: #fff;

      .el-icon {
        display: inline-block;
        margin-right: 5px;
        font-size: 1.2em;
        vertical-align: middle;
      }
    }

    .label {
      flex: 0 0 auto;
      margin: 0px;
      padding: 10px;
    }
  }
}
</style>
