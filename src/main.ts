import { createApp, watch } from 'vue';
import { Quasar, Dark, Ripple, QBanner, QBreadcrumbs, QBreadcrumbsEl, QBtn, QBtnToggle, QCard, QCardActions, QCardSection, QCheckbox, QDrawer, QForm, QHeader, QIcon, QInput, QItem, QItemLabel, QItemSection, QLayout, QList, QPage, QPageContainer, QSeparator, QToggle, QToolbar, QToolbarTitle } from 'quasar';
import 'quasar/dist/quasar.css';
import '@quasar/extras/material-icons/material-icons.css';
import App from './App.vue';
import router from './router';
import { useUiStore } from './stores/uiStore';
import { setupStores } from './stores';
import { registerGlobalErrorHandler } from './composables/useErrorHandler';
import { initMonitoring, recordPerformanceMetric } from './utils/monitoring';

const startMark = performance.now();
initMonitoring(import.meta.env.VITE_SENTRY_DSN);

const app = createApp(App);
const pinia = setupStores();

app.use(pinia);
app.use(router);
app.use(Quasar, { directives: { Ripple }, components: { QBanner, QBreadcrumbs, QBreadcrumbsEl, QBtn, QBtnToggle, QCard, QCardActions, QCardSection, QCheckbox, QDrawer, QForm, QHeader, QIcon, QInput, QItem, QItemLabel, QItemSection, QLayout, QList, QPage, QPageContainer, QSeparator, QToggle, QToolbar, QToolbarTitle }, plugins: {} });
const uiStore = useUiStore(pinia);
watch(() => uiStore.isDarkTheme, (value) => Dark.set(value), { immediate: true });
registerGlobalErrorHandler(app);

app.mount('#app');
recordPerformanceMetric('app_mount_time_ms', Math.round(performance.now() - startMark));
