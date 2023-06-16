<script setup lang="ts">
// import 'swagger-ui/dist/swagger-ui.css'
import '../assets/swagger.css'

import { OpenAPIV3 } from 'openapi-types'
import SwaggerUI from 'swagger-ui'
import { computed, onMounted, watch } from 'vue'

import { generate } from '@/helper/openapi/generate'
import { useProjects, useStore } from '@/stores'

const store = useStore()
const projctStore = useProjects()

const spec = computed<OpenAPIV3.Document>(() =>
  generate({
    info: {
      name: projctStore.activeProject?.name,
      description: projctStore.activeProject?.description,
    },
    endpoints: store.allEndpoints,
  }),
)

const doSwagger = () =>
  SwaggerUI({
    spec: spec.value,
    dom_id: '#open-api-browser',
  })

onMounted(() => {
  doSwagger()
})

watch(spec, doSwagger)
</script>

<template>
  <div style="margin-top: 60px">
    <div id="open-api-browser"></div>
    {{ spec }}
  </div>
</template>
