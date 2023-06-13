<script setup lang="ts">
import type { Bell } from '@element-plus/icons-vue'
import type { NodeProps } from '@vue-flow/core'
import { Handle, Position } from '@vue-flow/core'

type Data = {}

const props = defineProps<NodeProps<Data>>()
defineEmits(['updateNodeInternals'])
</script>

<template>
  <Handle type="target" :position="props.targetPosition || Position.Top" />
  <div class="wrapper">
    <div class="icon">
      <el-icon><Bell /></el-icon>
    </div>
    <div class="label">
      <strong>{{ label }}</strong>
    </div>
  </div>
  <Handle type="source" :position="props.sourcePosition || Position.Bottom" />
</template>

<style lang="scss">
.vue-flow__node-event {
  border: 1px solid var(--event-color);
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
      background: var(--event-color);
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
