import { createRouter, createWebHistory } from 'vue-router'

import CommandInfo from '@/components/CommandInfo.vue'
import ServiceInfo from '@/components/ServiceInfo.vue'
import SubscriptionInfo from '@/components/SubscriptionInfo.vue'
import DiscoverView from '@/views/DiscoverView.vue'
import EventsView from '@/views/EventsView.vue'
import HomeView from '@/views/HomeView.vue'
import LanesView from '@/views/LanesView.vue'
import ProjectInfoView from '@/views/ProjectInfoView.vue'
import ProjectView from '@/views/ProjectView.vue'
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
      path: '/projects',
      name: 'projects',
      children: [
        {
          path: ':projectId',
          name: 'project',
          props: true,
          component: ProjectView,
          children: [
            {
              path: '',
              name: 'discoverProject',
              props: true,
              component: DiscoverView,
              children: [
                {
                  path: '',
                  name: 'projectInfo',
                  props: true,
                  component: ProjectInfoView,
                },
                {
                  path: 'services',
                  name: 'services',
                  props: true,
                  component: ServicesView,
                },
                {
                  path: 'lanes',
                  name: 'lanes',
                  props: true,
                  component: LanesView,
                },
              ],
            },
            {
              path: 'services/:serviceName/:serviceVersion',
              name: 'serviceVersionDetail',
              component: ServiceVersionView,
              props: true,
              children: [
                {
                  path: 'service',
                  name: 'serviceInfo',
                  props: true,
                  component: ServiceInfo,
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
              path: 'events',
              name: 'events',
              props: true,
              component: EventsView,
            },
            {
              path: 'rest-api',
              name: 'restApi',
              component: RestApiView,
              children: [
                {
                  name: 'endpointInfo',
                  path: 'endpointName',
                  props: true,
                  component: SubscriptionInfo,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export default router
