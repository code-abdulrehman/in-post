import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import InputNumber from 'primevue/inputnumber';
import ToastService from 'primevue/toastservice';

// Import our Konva adapter and setup function
import Konva from './plugins/konva-adapter';
import setupVueKonva from './plugins/vue-konva-setup';

// Make Konva available globally to avoid module issues
if (typeof window !== 'undefined') {
  window.Konva = Konva;
}

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// Use our enhanced Vue Konva setup
setupVueKonva(app);

app.component('Button', Button);
app.component('InputNumber', InputNumber);
app.mount('#app');
