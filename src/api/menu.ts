import request from "@/utils/request"

export const queryMenu = (query?: any) => {
    return request({
        url: '/system/menu/query',
        method: 'get',
        params: query
    })
}

export const getMenu = (id: string) => {
    return request({
        url: '/system/menu/' + id,
        method: 'get'
    })
}

export const saveMenu = (data: any) => {
    return request({
        url: '/system/menu/save',
        method: 'post',
        data: data
    })
}

export const delMenu = (menuId: string) => {
    return request({
        url: '/system/menu/remove/' + menuId,
        method: 'post'
    })
}

export const getRouters = () => {
    return request({
        url: '/system/routers',
        method: 'get'
    })
}

export const treeMyMenu = () => {
    return request({
        url: '/system/menu/treeMyMenu',
        method: 'get'
    })
}

export const queryIdByRoleId = (roleId: string) => {
    return request({
        url: '/system/menu/queryIdByRoleId/' + roleId,
        method: 'get'
    })
}