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
