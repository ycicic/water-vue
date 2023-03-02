import request from "@/utils/request"

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