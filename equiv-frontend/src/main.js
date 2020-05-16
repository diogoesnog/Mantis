import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import VueSweetAlert2 from 'vue-sweetalert2';

import library from '@fortawesome/fontawesome-svg-core';
import faUserSecret from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

Vue.use(VueCookies);
Vue.use(VueSweetAlert2);
Vue.use(require('vue-moment'));

library.add(faUserSecret);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app');
