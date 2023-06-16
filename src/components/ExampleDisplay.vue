<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus/lib/components/index.js'
import type { OpenAPIV3 } from 'openapi-types'
import { computed } from 'vue'

import { logger } from '@/logger'

import { getExample } from '../helper/schemaObjectToExample/getExample'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps<{ schema: unknown; parameter?: unknown }>()

const content = computed(() => {
  let ret = JSON.stringify(getExample(props.schema as OpenAPIV3.SchemaObject), null, 2)

  if (props.parameter) {
    ret =
      '// Payload:\n\n' +
      ret +
      '\n\n//Parameter:\n\n' +
      JSON.stringify(getExample(props.parameter as OpenAPIV3.SchemaObject), null, 2)
  }

  return ret
})

const { copy, isSupported } = useClipboard({ source: content })

const copyToClipboard = () => {
  copy()
    .then(() => ElMessage.success({ message: 'copied to clipboard', offset: 80 }))
    .catch((err) => logger.error({ err }))
}

const markdown = computed(() => {
  return `\`\`\`json
${content.value}
\`\`\``
})
</script>

<template>
  <div class="copy-to-clipboard">
    <el-button v-if="isSupported" :icon="DocumentCopy" class="copy-to-clipboard-btn" @click="copyToClipboard" />
    <MarkdownContent :markdown="markdown" class="codeWindow"> </MarkdownContent>
  </div>
</template>
