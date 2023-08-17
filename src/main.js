import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'normalize.css'
import Axios from 'axios'
import Elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-default/index.css'
import moment from 'moment'
import echarts from 'echarts'
import {
  Button,
  Select,
  Row,
  Col,
  Pagination,
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Dialog,
  Option
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'


Vue.use(Elementui);
Vue.use(moment);
Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
Vue.prototype.$echarts = echarts

// more grace import third package !


import axios from 'axios'
import curvejs from 'curvejs'

Object.defineProperty(Vue.prototype, '$axios', { value: axios });
Object.defineProperty(Vue.prototype, '$curvejs', { value: curvejs });

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('lz_userName');
  const pass = localStorage.getItem('lz_passNumber');
   if (!user && !pass && to.path !== '/login') { // 检查路径用户是否即将进入我们的 chart 路径
     next('/login');
  }else{
       localStorage.setItem('lz_userName', user);
       localStorage.setItem('lz_passNumber', pass);
       next()
   }
})

Vue.use(Button);
Vue.use(Select);
Vue.use(Row);
Vue.use(Col);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Dialog);
Vue.use(Option);

locale.use(lang);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//使用store
  components: { App },
  template: '<App/>'
})
