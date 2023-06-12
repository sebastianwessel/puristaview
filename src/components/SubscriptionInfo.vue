<script setup lang="ts">
import { computed } from 'vue'

import { useServicesStore } from '@/stores/services'

const props = defineProps<{ serviceName: string; serviceVersion: string; subscriptionName: string }>()

const serviceStore = useServicesStore()

const subscription = computed(() =>
  serviceStore.getSubscriptionByServiceAndName(props.serviceName, props.serviceVersion, props.subscriptionName),
)
</script>

<template>
  <template v-if="subscription">
    <h3>{{ subscription.subscriptionName }}</h3>
  </template>
  <template v-else> Subscription not found </template>
</template>
