import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/tools/polyfill';
import './style/index.scss';
import router from './router';
import App from './App.vue';
import { config } from '@/config/index.js';
import Perms from '@/directives/perms.js';
import Click from '@/directives/click.js';
import Place from '@/directives/place.js';
import Hover from '@/directives/hover.js';
import Trim from '@/directives/trim.js';
import LongPress from '@/directives/longpress.js';
import SafeHtml from '@/directives/safe-html.js';
import { $t } from '@/lang/i18n';
import { language } from '@/lang';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'virtual:svg-icons-register';
import { errorHandler } from '@/error';

const app = createApp(App);

app.directive('perms', Perms);
app.directive('click', Click);
app.directive('place', Place);
app.directive('hover', Hover);
app.directive('trim', Trim);
app.directive('press', LongPress);
app.directive('safe-html', SafeHtml);

errorHandler();

app.config.globalProperties.$t = $t;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus, { ...config.elementUI, locale: language.element_ui });
app.use(router);
app.mount('#app');
