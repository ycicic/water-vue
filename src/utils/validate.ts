/**
 * 判断url是否是http或https
 */
export function isHttp(url: string) {
    return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 */
export function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
}
