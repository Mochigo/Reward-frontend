import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import setAxios from './utils/setAxios'

import 'ant-design-vue/dist/antd.css'
import './assets/main.css'
import axios from 'axios'

import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.config.globalProperties.$http = axios
app.use(VueViewer)

setAxios()

app.mount('#app')
