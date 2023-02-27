import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes = [
    {
        path: "/login",
        component: () => import('@/views/login.vue'),
        hidden: true
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import('@/views/error/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/index',
                component: () => import('@/views/index.vue'),
                name: 'Index',
                meta: { title: '首页', icon: 'HomeFilled', affix: true }
            }
        ]
    }
]

export const dynamicRoutes = []

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
});

export default router;