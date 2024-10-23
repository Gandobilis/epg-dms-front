import {useRouter} from "vue-router";
import {useAuthStore} from "/src/stores/auth.js";

export default function useNavigation() {
    const router = useRouter();
    const authStore = useAuthStore();

    const checkCurrentRoute = (path) => router.currentRoute.value.path === path;

    const generateDownloadLink = () => {
        const baseUrl = 'https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download';
        const accessToken = authStore.token;
        return `${baseUrl}?access_token=${accessToken}`;
    }

    const getUserName = () => `${authStore.user?.firstName[0]}. ${authStore.user?.lastName}`;

    const logout = async () => {
        authStore.logout();
        await router.push('/');
    }

    return {checkCurrentRoute, generateDownloadLink, getUserName, logout};
}