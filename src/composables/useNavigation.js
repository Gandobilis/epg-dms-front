import {useRouter} from "vue-router";
import {useAuthStore} from "/src/stores/auth.js";
import {useFilterStore} from "/src/stores/filter.js";

export default function useNavigation() {
    const router = useRouter();
    const authStore = useAuthStore();
    const {filter} = useFilterStore();

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
    const showFileExport = () => authStore.isAuthenticated && authStore.fileExportRoles.includes(authStore.user?.role) && checkCurrentRoute('/');

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
        const params = {};

        const dates = [
            'clarificationDateStart',
            'clarificationDateEnd',
            'changeDateStart',
            'changeDateEnd',
            'transferDateStart',
            'transferDateEnd',
            'extractionDateStart',
            'extractionDateEnd'
        ]
        const undefinedValues = [
            "აირჩიეთ რეგიონი",
            "აირჩიეთ მ/ც",
            "აირჩიეთ სტატუსი"
        ]
        Object.entries(filter)
            .filter(([_, value]) => value && !undefinedValues.includes(value))
            .reduce((_, [key, value]) => {
                if (dates.includes(key)) {
                    params[key] = value
                    if (key.indexOf('extraction') === -1) {
                        params[key] += ` ${key.indexOf('Start') !== -1 ? '00' : '24'}:00:00.000000`
                    }
                } else {
                    params[key] = value;
                }
            }, {});

        if (params['withdrawType']?.length === 0) {
            delete params['withdrawType'];
        }

        const urlSearchParams = new URLSearchParams(params);

        const baseUrl = `${import.meta.env.VITE_BASE_URL}connection-fees/download`;
        const accessToken = authStore.token;
        return `${baseUrl}?accessToken=${accessToken}&${urlSearchParams.toString()}`;
    };

    const generateFileDownloadLink = (fileName) => {
        const baseUrl = `${import.meta.env.VITE_BASE_URL}connection-fees/download-ext`;
        const accessToken = authStore.token;

        return `${baseUrl}?accessToken=${accessToken}&fileName=${fileName}`;
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
        generateFileDownloadLink,
        getUserName,
        logout,
    };
}
