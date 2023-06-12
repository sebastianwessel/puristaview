<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark.css'

import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import mermaid from 'mermaid'
import { computed, onMounted, onUpdated } from 'vue'

const props = defineProps<{ markdown: string }>()

const renderer = new MarkdownIt({
  linkify: false,
  typographer: true,
  highlight: function (str, lang) {
    if (!lang) {
      return ''
    }
    if (hljs.getLanguage(lang)) {
      try {
        return (
          '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch (__) {}
    }
    if (lang.toLowerCase() === 'mermaid') {
      return '<pre class="mermaid">' + str + '</pre>'
    }

    return ''
  },
})

onMounted(() => mermaid.contentLoaded())

onUpdated(() => mermaid.contentLoaded())

const html = computed(() => {
  if (!props.markdown.trim().length) {
    return
  }
  return renderer.render(props.markdown.trim())
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-html="html" />
</template>
