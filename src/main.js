import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import { message} from 'ant-design-vue'
import base from "./api/base"
import router from "./router/index"
import index from "./api/index"

Vue.config.productionTip = false

Vue.use(Antd);

const globalConstant={
  curHeight: document.body.clientHeight,
  curwidth:document.body.clientWidth
}

Vue.prototype.$api=index
Vue.prototype.$axios=axios
Vue.prototype.$message= message
Vue.prototype.$base=base
Vue.prototype.$globalConstant=globalConstant



message.config({
  duration: 2,// 持续时间
  top:`100px`, // 到页面顶部距离
  maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
