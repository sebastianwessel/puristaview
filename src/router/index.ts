import { createRouter, createWebHistory } from 'vue-router'

import CommandInfo from '@/components/CommandInfo.vue'
import ServieVersionInfo from '@/components/ServiceVersionInfo.vue'
import SubscriptionInfo from '@/components/SubscriptionInfo.vue'
import EventsView from '@/views/EventsView.vue'
import HomeView from '@/views/HomeView.vue'
import RestApiView from '@/views/RestApiView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ServiceVersionView from '@/views/ServiceVersionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        }
      }
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
    },
    {
      path: '/services:serviceName/:serviceVersion',
      name: 'serviceVersionDetail',
      component: ServiceVersionView,
      props: true,
      children: [
        {
          path: 'service',
          name: 'serviceInfo',
          props: true,
          component: ServieVersionInfo,
        },
        {
          name: 'commandInfo',
          path: 'commands/:commandName',
          props: true,
          component: CommandInfo,
        },
        {
          name: 'subscriptionInfo',
          path: 'subscriptions/:subscriptionName',
          props: true,
          component: SubscriptionInfo,
        },
      ],
    },
    {
      path: '/events',
      name: 'events',
      component: EventsView,
    },
    {
      path: '/rest-api',
      name: 'restApi',
      component: RestApiView,
    },
  ],
})

export default router
