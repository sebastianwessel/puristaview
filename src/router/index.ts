import { createRouter, createWebHistory } from 'vue-router'

import { useLoading } from '@/composeables/useLoading'

const CommandInfo = () => import('@/components/CommandInfo.vue')
const ServiceInfo = () => import('@/components/ServiceInfo.vue')
const SubscriptionInfo = () => import('@/components/SubscriptionInfo.vue')
const DiscoverView = () => import('@/views/DiscoverView.vue')
const EventsView = () => import('@/views/EventsView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const LanesView = () => import('@/views/LanesView.vue')
const ProjectInfoView = () => import('@/views/ProjectInfoView.vue')
const ProjectsView = () => import('@/views/ProjectsView.vue')
const ProjectView = () => import('@/views/ProjectView.vue')
const RestApiView = () => import('@/views/RestApiView.vue')
const ServicesView = () => import('@/views/ServicesView.vue')
const ServiceVersionView = () => import('@/views/ServiceVersionView.vue')
const OpenApiView = () => import('@/views/OpenApiView.vue')

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
      children: [
        {
          path: '',
          name: 'projects',
          component: ProjectsView,
        },
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
              path: 'open-api',
              name: 'openApi',
              component: OpenApiView,
            },
          ],
        },
      ],
    },
  ],
})

router.beforeEach(() => {
  const { isLoading } = useLoading()
  isLoading.value = true
})

router.afterEach(() => {
  const { isLoading } = useLoading()
  isLoading.value = false
})

export default router
