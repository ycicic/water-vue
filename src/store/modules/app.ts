import Cookies from 'js-cookie'

const useAppStore = defineStore('app', {
    state: () => ({
        sidebar: {
            opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus')! : true,
            withoutAnimation: false,
            hide: false
        },
        device: 'desktop',
        size: Cookies.get('size') || 'default'
    }),
    actions: {
        toggleSideBar(withoutAnimation?: any) {
            if (this.sidebar.hide) {
                return false;
            }
            this.sidebar.opened = !this.sidebar.opened
            this.sidebar.withoutAnimation = withoutAnimation
            if (this.sidebar.opened) {
                Cookies.set('sidebarStatus', '1')
            } else {
                Cookies.set('sidebarStatus', '0')
            }
        },
        closeSideBar(withoutAnimation: boolean) {
            Cookies.set('sidebarStatus', '0')
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
        },
        toggleDevice(device: string) {
            this.device = device
        },
        setSize(size: any) {
            this.size = size;
            Cookies.set('size', size)
        },
        toggleSideBarHide(status: boolean) {
            this.sidebar.hide = status
        }
    }
})

export default useAppStore