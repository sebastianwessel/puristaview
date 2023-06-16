<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { Pane, Splitpanes } from 'splitpanes'
import { onMounted, ref } from 'vue'

const DEFAULT_WIDTH = 240
const leftPaneSize = ref(20)
const splitpanesRef = ref()

const setLeftPaneSize = () => {
  const width = splitpanesRef.value.$el.clientWidth
  leftPaneSize.value = (DEFAULT_WIDTH / width) * 100
}

onMounted(() => {
  setLeftPaneSize()

  useResizeObserver(splitpanesRef, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    leftPaneSize.value = (DEFAULT_WIDTH / width) * 100
  })
})
</script>

<template>
  <el-container style="background: var(--el-fill-color-extra-light)">
    <splitpanes ref="splitpanesRef" class="default-theme">
      <pane :size="leftPaneSize" style="height: 100vh">
        <slot name="sidebar"> </slot>
      </pane>
      <pane class="right" :size="100 - leftPaneSize">
        <el-main
          style="
            margin-top: 30px;
            min-height: 100vh;
            padding-bottom: 60px;
            scroll-margin-top: 300px;
            background: var(--el-fill-color-blank);
          "
        >
          <slot name="content"> </slot>
        </el-main>
      </pane>
    </splitpanes>
  </el-container>
</template>
