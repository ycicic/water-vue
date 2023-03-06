import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '@/assets/styles/index.scss' // global css
import 'element-plus/theme-chalk/index.css'

import * as components from '@element-plus/icons-vue'

import { parseTime, addDateRange, resetForm } from '@/utils/water'

import './permission'
import tab from './plugins/tab'

import Pagination from './components/Pagination/index.vue'

const app = createApp(App)

app.config.globalProperties.$tab = tab
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.$icons = []

app.component('Pagination',Pagination)

app.use(router)
app.use(pinia)
app.use({
    install: (app: any) => {
        for (const key in components) {
            const componentConfig = (components as any)[key];
            app.config.globalProperties.$icons.push(componentConfig.name)
            app.component(componentConfig.name, componentConfig);
        }
    },
}
)

app.use(ElementPlus, { locale })

app.mount('#app')
