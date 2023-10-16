import { createApp } from 'vue'
import App from './App.vue'
import VueModal from 'vue3-modal';

createApp(App).mount('#app')

App.use(VueModal);