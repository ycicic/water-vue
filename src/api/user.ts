import request from "@/utils/request"

export const pageUser = (query: any) => {
    return request({
        url: '/system/user/page',
        method: 'get',
        params: query
    })
}

export const getUser = (id: string) => {
    return request({
        url: '/system/user/' + id,
        method: 'get'
    })
}

export const saveUser = (data: any) => {
    return request({
        url: '/system/user/save',
        method: 'post',
        data: data
    })
}

export const changeUserStatus = (userId: string, status: number) => {
    return request({
        url: '/system/user/changeStatus',
        method: 'post',
        data: {
            id: userId,
            status: status
        }
    })
}

export const resetUserPwd = (userId: string, password: string) => {
    return request({
        url: '/system/user/resetPwd',
        method: 'post',
        data: {
            id: userId,
            password: password
        }
    })
}

export const delUser = (userIds: any) => {
    return request({
        url: '/system/user/remove/' + userIds,
        method: 'post'
    })
}

// 查询授权角色
export function getAuthRole(userId: any) {
    return request({
        url: '/system/user/auth/role/' + userId,
        method: 'get'
    })
}

// 保存授权角色
export function updateAuthRole(data: any) {
    return request({
        url: '/system/user/auth/role',
        method: 'post',
        data: data
    })
}