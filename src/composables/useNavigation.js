import {useRouter} from "vue-router";
import {useAuthStore} from "/src/stores/auth.js";

export default function useNavigation() {
    const router = useRouter();
    const authStore = useAuthStore();

    /**
     * Check if the user can view files.
     * @returns {boolean}
     */
    const showFiles = () => authStore.isAuthenticated && authStore.filesRoles.includes(authStore.user?.role);

    /**
     * Check if the user can view transactions.
     * @returns {boolean}
     */
    const showTransactions = () => authStore.isAuthenticated && authStore.transactionsRoles.includes(authStore.user?.role);

    /**
     * Check if the user can view users.
     * @returns {boolean}
     */
    const showUsers = () => authStore.isAuthenticated && authStore.usersRoles.includes(authStore.user?.role);

    /**
     * Check if the user can export files.
     * @returns {boolean}
     */
    const showFileExport = () => authStore.isAuthenticated && authStore.fileExportRoles.includes(authStore.user?.role) && checkCurrentRoute('/transactions');

    /**
     * Check if the current route matches the given path.
     * @param {string} path
     * @returns {boolean}
     */
    const checkCurrentRoute = (path) => router.currentRoute.value.path === path;

    /**
     * Generate the download link for file export.
     * @returns {string}
     */
    const generateDownloadLink = () => {
        const baseUrl = 'https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download';
        const accessToken = authStore.token;
        return `${baseUrl}?accessToken=${accessToken}`;
    };

    /**
     * Get the user's display name.
     * @returns {string}
     */
    const getUserName = () => {
        return authStore.user?.firstName ? `${authStore.user.firstName[0]}. ${authStore.user.lastName}` : '';
    };

    /**
     * Log the user out and navigate to the login page.
     */
    const logout = async () => {
        try {
            await authStore.logout();
            await router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
