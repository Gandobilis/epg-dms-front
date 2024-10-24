import {useRouter} from "vue-router";
import {useAuthStore} from "/src/stores/auth.js";

export default function useNavigation() {
    const router = useRouter();
    const authStore = useAuthStore();

    const showFiles = () => authStore.isAuthenticated && authStore.filesRoles.includes(authStore.user?.role)
    const showTransactions = () => authStore.isAuthenticated && authStore.transactionsRoles.includes(authStore.user?.role)
    const showUsers = () => authStore.isAuthenticated && authStore.usersRoles.includes(authStore.user?.role)
    const showFileExport = () => authStore.isAuthenticated && authStore.fileExportRoles.includes(authStore.user?.role) && checkCurrentRoute('/transactions')

    const checkCurrentRoute = (path) => router.currentRoute.value.path === path;

    const generateDownloadLink = () => {
        const baseUrl = 'https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download';
        const accessToken = authStore.token;
        return `${baseUrl}?accessToken=${accessToken}`;
    };

    const getUserName = () => {
        return authStore.user?.firstName ? `${authStore.user.firstName[0]}. ${authStore.user.lastName}` : '';
    };

    const logout = async () => {
        await authStore.logout();
        await router.push('/login');
    };

    return {
        showFiles,
        showTransactions,
        showUsers,
        showFileExport,
        checkCurrentRoute,
        generateDownloadLink,
        getUserName,
        logout,
    };
}