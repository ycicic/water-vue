const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'theme-light'
    }),
    actions: {
        dark() {
            this.theme = 'theme-dark'
        },
        light() {
            this.theme = 'theme-light'
        }
    }
})

export default useThemeStore