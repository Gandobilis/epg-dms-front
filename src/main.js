import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import {createPinia} from 'pinia';
import {useAuthStore} from "./stores/auth.js";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore();

authStore.restoreSession().then(() => {
    app.use(router);
    app.mount('#app');
});
