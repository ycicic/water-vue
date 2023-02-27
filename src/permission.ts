import router from './router';
import NProgress from 'nprogress'
import useUserStore from '@/store/modules/user';
import { isRelogin } from '@/utils/request';
import usePermissionStore from '@/store/modules/permission';
import { isHttp } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import { getToken } from '@/utils/cookies';

NProgress.configure({ showSpinner: false })

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
    NProgress.start()

    if (getToken()) {
        to.meta.title && useDynamicTitle(to.meta.title)

        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done
        } else {
            if (useUserStore().roles.length === 0) {
                isRelogin.show = true
                useUserStore().getInfo().then(() => {
                    isRelogin.show = false
                    usePermissionStore().generateRoutes().then((accessRoutes: any) => {
                        accessRoutes.forEach((route: any) => {
                            if (!isHttp(route.path)) {
                                router.addRoute(route)
                            }
                        })
                        next({ ...to, replace: true })
                    })
                }).catch(err => {
                    useUserStore().logout().then(() => {
                        ElMessage.error(err)
                        next({ path: '/' })
                    })
                })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }

})

router.afterEach(() => {
    NProgress.done()
})


function useDynamicTitle(title: any) {
    document.title = title;
}