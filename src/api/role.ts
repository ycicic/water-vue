import request from "@/utils/request"

export const pageRole = (query: any) => {
    return request({
        url: '/system/role/page',
        method: 'get',
        params: query
    })
}

export const getRole = (id: string) => {
    return request({
        url: '/system/role/' + id,
        method: 'get'
    })
}

export const delRole = (roleIds: any) => {
    return request({
        url: '/system/role/remove/' + roleIds,
        method: 'post'
    })
}

export const changeRoleStatus = (roleId: string, status: number) => {
    return request({
        url: '/system/role/changeStatus',
        method: 'post',
        data: {
            id: roleId,
            status: status
        }
    })
}

export const saveRole = (data: any) => {
    return request({
        url: '/system/role/save',
        method: 'post',
        data: data
    })
}

// 查询角色已分配用户
export const pageAllocatedUser = (query: any) => {
    return request({
        url: '/system/role/auth/allocated/page',
        method: 'get',
        params: query
    })
}

// 查询角色未分配用户
export const pageUnallocatedUser = (query: any) => {
    return request({
        url: '/system/role/auth/unallocated/page',
        method: 'get',
        params: query
    })
}

// 批量取消用户授权角色
export function cancelAuthUser(data: any) {
    return request({
        url: '/system/role/auth/cancel',
        method: 'post',
        data: data
    })
}

// 批量授权用户角色
export function updateAuthUser(data: any) {
    return request({
        url: '/system/role/auth/user',
        method: 'post',
        data: data
    })
}