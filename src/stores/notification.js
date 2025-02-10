import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const message = ref('');
    const type = ref('');
    const visible = ref(false);

    const showSuccess = (msg) => {
        message.value = msg;
        type.value = 'success';
        visible.value = true;
        autoHide();
    };

    const showError = (msg) => {
        message.value = msg;
        type.value = 'error';
        visible.value = true;
        autoHide();
    };

    const autoHide = () => {
        setTimeout(() => {
            visible.value = false;
        }, 3000);
    };

    return {message, type, visible, showSuccess, showError};
});
