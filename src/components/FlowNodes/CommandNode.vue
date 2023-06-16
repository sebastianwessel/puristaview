<script setup lang="ts">
import type { Bell, Switch } from '@element-plus/icons-vue'
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'

type Data = {
  label: string
  serviceName?: string
  serviceVersion?: string
  eventName?: string
}

const props = defineProps<NodeProps<Data>>()
defineEmits(['updateNodeInternals'])
</script>

<template>
  <Handle type="target" :position="props.targetPosition || Position.Top" />
  <div style="position: relative">
    <div class="wrapper">
      <div class="icon" style="background: var(--command-color); color: #fff">
        <el-icon><Switch /></el-icon>
      </div>
      <div class="label">
        <div>
          <strong style="font-size: 0.8rem; line-height: 0.8rem">{{ label }}</strong>
        </div>
        <div>
          <small style="font-size: 0.7rem; line-height: 0.7rem"
            >{{ data.serviceName }} v{{ data.serviceVersion }}</small
          >
        </div>
      </div>
    </div>
    <template v-if="data.eventName">
      <div class="wrapper">
        <div class="icon">
          <el-icon style="visibility: hidden"><Bell /></el-icon>
        </div>
        <div class="label" style="visibility: hidden">{{ data.eventName }}</div>
      </div>
      <div
        class="wrapper"
        style="
          position: absolute;
          border: 2px solid var(--event-color);
          border-bottom-left-radius: var(--el-border-radius-base);
          border-bottom-right-radius: var(--el-border-radius-base);
          bottom: -1px;
          left: -1px;
          right: -1px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: bold;
          background: var(--event-color);
        "
      >
        <div class="icon">
          <el-icon><Bell /></el-icon>
        </div>
        <div class="label" style="text-align: center">
          <strong style="font-size: 0.8rem; line-height: 0.8rem">{{ data.eventName }}</strong>
        </div>
      </div>
    </template>
  </div>
  <Handle id="bottom" type="source" :position="props.sourcePosition || Position.Bottom" />
  <Handle id="right" type="source" :position="props.sourcePosition || Position.Right" />
  <Handle id="left" type="target" :position="props.sourcePosition || Position.Left" />
</template>

<style lang="scss">
.vue-flow__node-command {
  border: 1px solid var(--command-color);
  border-radius: var(--el-border-radius-base);

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: start;
    align-items: auto;
    align-content: start;
    background-color: var(--el-fill-color-blank);
    font-family: var(--font-family-code);

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
      padding: 5px;
    }
  }
}
</style>
