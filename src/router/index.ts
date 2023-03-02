import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
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

export const dynamicRoutes = [
    {
        path: '/system/user/auth',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole.vue'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/system/user' }
            }
        ]
    },
    {
        path: '/system/role/auth',
        component: Layout,
        hidden: true,
        children: [
            {
                path: 'user//:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser.vue'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/system/role' }
            }
        ]
    }
]

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