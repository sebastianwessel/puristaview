<script lang="ts" setup>
import { CaretLeft, Compass, Link, ScaleToOriginal, TopRight } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useLoading } from '@/composeables/useLoading'

const _props = defineProps<{ projectId?: string }>()

const route = useRoute()
const { isLoading } = useLoading()

const active = computed(() => {
  const part = route.path.split('/')
  if (part.length < 4) {
    return '1'
  }
  if (part[3].includes('services')) {
    return '1'
  }
  if (part[3].includes('events')) {
    return '3'
  }
  if (part[3].includes('rest-api')) {
    return '4'
  }
  return '1'
})
</script>

<template>
  <div class="loading-bar" :class="isLoading ? 'is-loading' : ''" />
  <div style="display: flex">
    <el-menu :default-active="active" mode="horizontal" :router="true" :ellipsis="false">
      <el-menu-item index="0" :route="{ name: 'projects' }"
        ><el-icon><CaretLeft /></el-icon><strong>Projects</strong></el-menu-item
      >
    </el-menu>
    <el-menu
      :default-active="active"
      mode="horizontal"
      :router="true"
      style="display: flex; justify-content: center; flex-grow: 1"
    >
      <el-menu-item index="1" :route="{ name: 'projectInfo', params: { projectId } }"
        ><el-icon><Compass /></el-icon>Discover</el-menu-item
      >
      <el-menu-item index="2" :route="{ name: 'lanes', params: { projectId } }"
        ><el-icon><ScaleToOriginal /></el-icon>Lanes</el-menu-item
      >
      <el-menu-item index="4" :route="{ name: 'openApi', params: { projectId } }"
        ><el-icon><Link /></el-icon>OpenAPI</el-menu-item
      >
    </el-menu>
    <el-menu :default-active="active" mode="horizontal" :router="true" :ellipsis="false">
      <el-menu-item index="5"
        ><el-link href="https://purista.dev" type="info" target="_blank"
          ><strong style="">PURISTA.dev</strong><el-icon><TopRight /></el-icon></el-link
      ></el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss">
.loading-bar {
  height: 5px;
  width: 100%;
  background-color: var(--el-menu-bg-color);

  .is-loading {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: linear-gradient(to right, #e6a23c 0%, #409eff 50%, #e6a23c 100%);
  }
}

@keyframes placeHolderShimmer {
  0% {
    background-position: 0px 0;
  }
  100% {
    background-position: 100vw 0;
  }
}
</style>
