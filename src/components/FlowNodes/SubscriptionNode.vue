<script setup lang="ts">
import type { Bell, Notification } from '@element-plus/icons-vue'
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'

type Data = {
  serviceName?: string
  serviceVersion?: string
  eventName?: string
}

const props = defineProps<NodeProps<Data>>()
defineEmits(['updateNodeInternals'])
</script>

<template>
  <Handle type="target" :position="props.targetPosition || Position.Top" />
  <div class="wrapper" :class="data.eventName ? 'halfborder' : 'fullborder'">
    <div class="icon" style="background: var(--subscription-color); color: #fff">
      <el-icon><Notification /></el-icon>
    </div>
    <div class="label">
      <div>
        <strong>{{ label }}</strong>
      </div>
      <div>
        <small>{{ data.serviceName }} v{{ data.serviceVersion }}</small>
      </div>
    </div>
  </div>
  <template v-if="data.eventName">
    <div
      class="wrapper"
      style="
        border: 1px solid var(--event-color);
        background-color: var(--event-color);
        border-bottom-left-radius: var(--el-border-radius-base);
        border-bottom-right-radius: var(--el-border-radius-base);
      "
    >
      <div class="icon">
        <el-icon><Bell /></el-icon>
      </div>
      <div class="label">{{ data.eventName }}</div>
    </div>
  </template>
  <Handle id="bottom" type="source" :position="props.sourcePosition || Position.Bottom" />
  <Handle id="right" type="source" :position="props.sourcePosition || Position.Right" />
</template>

<style lang="scss">
.vue-flow__node-subscription {
  .fullborder {
    border: 1px solid var(--subscription-color);
    border-radius: var(--el-border-radius-base);
  }

  .halfborder {
    border: 1px solid var(--subscription-color);
    border-top-left-radius: var(--el-border-radius-base);
    border-top-right-radius: var(--el-border-radius-base);
    border-bottom: none;
  }

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: start;
    align-items: auto;
    align-content: start;

    .icon {
      flex: 0 0 auto;
      margin: 0px;
      padding: 10px;

      .el-icon {
        display: block;
        margin: auto;
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
