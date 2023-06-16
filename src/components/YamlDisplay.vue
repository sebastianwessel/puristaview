<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus/lib/components/index.js'
import type { OpenAPIV3 } from 'openapi-types'
import { computed } from 'vue'
import { stringify } from 'yaml'

import { logger } from '@/logger'

import MarkdownContent from './MarkdownContent.vue'

const props = defineProps<{ schema: OpenAPIV3.SchemaObject }>()

const content = computed(() => stringify(props.schema))

const { copy, isSupported } = useClipboard({ source: content })

const copyToClipboard = () => {
  copy()
    .then(() => ElMessage.success({ message: 'copied to clipboard', offset: 80 }))
    .catch((err) => logger.error({ err }))
}

const markdown = computed(() => {
  return `\`\`\`yaml
${content.value}
\`\`\``
})
</script>

<template>
  <div class="copy-to-clipboard">
    <el-button v-if="isSupported" :icon="DocumentCopy" class="copy-to-clipboard-btn" @click="copyToClipboard" />
    <MarkdownContent :markdown="markdown" class="codeWindow" />
  </div>
</template>
