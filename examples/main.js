import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import { Select, Option, Tree } from 'element-ui';
import TreeSelect from '@/index'

Vue.config.productionTip = false

Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)

Vue.use(TreeSelect)


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
