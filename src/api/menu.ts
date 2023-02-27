import request from "@/utils/request"

export const getRouters = () => {
    return request({
        url: '/system/routers',
        method: 'get'
    })
}