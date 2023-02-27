import request from "@/utils/request";

// 登录
export const login = (username: string, password: string, code: string, uuid: string) => {
    const data = {
        username,
        password,
        code,
        uuid,
    }
    return request({
        url: '/system/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export const getInfo = () => {
    return request({
        url: '/system/userInfo',
        method: 'get'
    })
}

export const logout = () => {
    return request({
        url: '/system/logout',
        method: 'post'
    })
}

// 获取验证码
export const getCodeImg = () => {
    return request({
        url: '/common/validate/captchaImage',
        headers: {
            isToken: false
        },
        method: 'get',
        timeout: 20000
    })
}
