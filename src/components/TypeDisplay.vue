<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import type { OpenAPIV3 } from 'openapi-types'
import { computed } from 'vue'

import { logger } from '@/logger'

import { schemaObjectToTsType } from '../helper/schemaObjectToTsType/transform'
import MarkdownContent from './MarkdownContent.vue'

const props = defineProps<{ schema: OpenAPIV3.SchemaObject; parameter?: OpenAPIV3.SchemaObject }>()

const content = computed(() => {
  const header = (props.schema.title || '') + '\n' + (props.schema.description || '')
  let ret = ''

  if (header.trim().length > 1) {
    ret += `/**\n* ${header.replaceAll('\n', '\n* ')}\n**/\n`
  }

  ret += `type Payload = ${schemaObjectToTsType(props.schema)}`

  if (props.parameter) {
    const headerParam = (props.parameter.title || '') + '\n' + (props.parameter.description || '')
    ret += '\n\n'
    if (headerParam.trim().length > 1) {
      ret += `/**\n* ${headerParam.replaceAll('\n', '\n* ')}\n**/\n`
    }

    ret += `type Parameter = ${schemaObjectToTsType(props.parameter)}`
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
  return `\`\`\`typescript
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
