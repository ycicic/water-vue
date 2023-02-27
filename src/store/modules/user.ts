import { getInfo, login, logout } from "@/api/login"
import { removeToken, setToken } from "@/utils/cookies"
import defAva from '@/assets/images/defAva.svg'

const useUserStore = defineStore('user', {
    state: () => ({
        userName: '',
        nickName: '',
        avatar: '',
        roles: [] as string[],
        permissions: [] as string[],
    }),
    actions: {
        login(userInfo: any) {
            const userName = userInfo.userName.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid

            return new Promise((resolve: any, reject: any) => {
                login(userName, password, code, uuid).then(res => {
                    setToken(res)
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        getInfo() {
            return new Promise((resolve: any, reject: any) => {
                getInfo().then(r => {
                    const res = r as any
                    const user = res.user
                    const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar

                    if (res.roles && res.roles.length > 0) {
                        this.roles = res.roles
                        this.permissions = res.permissions
                    } else {
                        this.roles = ['ROLE_DEFAULT']
                    }

                    this.userName = user.userName
                    this.nickName = user.nickName
                    this.avatar = avatar
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        logout() {
            return new Promise((resolve: any, reject: any) => {
                logout().then(() => {
                    this.roles = []
                    this.permissions = []
                    removeToken()
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
})

export default useUserStore