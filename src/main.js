import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-TW';

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
