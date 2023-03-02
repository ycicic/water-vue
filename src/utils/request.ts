import axios, { AxiosInstance } from 'axios'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { getToken } from '@/utils/cookies'
import cache from '@/utils/cache'
import errorCode from '@/utils/errorCode'
import useUserStore from '@/store/modules/user'

export let isRelogin = { show: false };

export default (config: any) => {
    // 创建axios实例
    const service: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_APP_BASE_API as string,
        // 超时
        timeout: 10000
    })
    // 请求拦截器
    service.interceptors.request.use(
        (config: any) => {
            // 是否需要设置 token
            const isToken = (config.headers || {}).isToken === false
            // 是否需要防止数据重复提交
            const isRepeatSubmit = (config.headers || {}).repeatSubmit === false

            if (getToken() && !isToken) {
                config.headers['Authorization'] = 'Bearer ' + getToken() || ''
            }

            if (config.method === 'get' && config.params) {
                let url = config.url + '?' + tansParams(config.params);
                url = url.slice(0, -1);
                config.params = {};
                config.url = url;
            }

            if (!isRepeatSubmit && config.method === 'post' || config.method === 'put') {
                const requestObj = {
                    url: config.url,
                    data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
                    time: new Date().getTime()
                }
                const sessionObj = cache.session.getJSON('sessionObj')
                if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
                    cache.session.setJSON('sessionObj', requestObj)
                } else {
                    const s_url = sessionObj.url;                // 请求地址
                    const s_data = sessionObj.data;              // 请求数据
                    const s_time = sessionObj.time;              // 请求时间
                    const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
                    if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                        const message = '数据正在处理，请勿重复提交';
                        console.warn(`[${s_url}]: ` + message)
                        return Promise.reject(new Error(message))
                    } else {
                        cache.session.setJSON('sessionObj', requestObj)
                    }
                }
            }
            return config
        },
        (error: any) => {
            return Promise.reject(error)
        }
    )
    // 响应拦截器
    service.interceptors.response.use(
        (response: any) => {
            const code = response.data.code || 200

            const msg = errorCode[code as keyof typeof errorCode] || response.data.msg || errorCode['default']

            if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
                return response.data
            }

            if (code === 500) {
                ElMessage({
                    message: msg,
                    type: 'error'
                })
                return Promise.reject(new Error(msg))
            } else if (code !== 200) {
                ElNotification.error({
                    title: msg
                })
                return Promise.reject('error')
            } else {
                return Promise.resolve(response.data)
            }
        },
        (error: any) => {
            console.log('err' + error)
            let { message,response } = error;
            
            if (response.status == 401) {
                if (!isRelogin.show) {
                    isRelogin.show = true;
                    ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                    ).then(() => {
                        isRelogin.show = false;
                        useUserStore().logout().then(() => {
                            location.href = '/index';
                        })
                        console.log("用户登出");

                    }).catch(() => {
                        isRelogin.show = false;
                    });
                }
                return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
            }

            if (message == "Network Error") {
                message = "系统连接异常";
            } else if (message.includes("timeout")) {
                message = "系统响应超时";
            } else if (message.includes("Request failed with status code")) {
                message = "系统繁忙[" + message.substr(message.length - 3) + "]";
            }
            ElMessage({
                message: message,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(error)
        }
    )
    return service(config)
}

function tansParams(params: any) {
    let result = ''
    for (let propName of Object.keys(params)) {
        let value = params[propName]
        let part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}
