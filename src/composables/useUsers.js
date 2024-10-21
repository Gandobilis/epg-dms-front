import {ref, onMounted} from 'vue';
import axios from '../interceptors/axios/index.js';

export function useUsers() {
    const users = ref([]);
    const showModal = ref(false);
    const selectedUser = ref({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'აირჩიეთ როლი'
    });
    const isEditing = ref(false);

    const roles = [
        {key: 'ROLE_ADMIN', text: 'ადმინი'},
        {key: 'ROLE_OPERATOR', text: 'ოპერატორი'},
        {key: 'ROLE_MANAGER', text: 'მენეჯერი'}
    ];

    const getUsers = async () => {
        const {data} = await axios.get('user', {requiresAuth: true});
        users.value = data;
    };

    const openCreateModal = () => {
        selectedUser.value = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: ''
        };
        isEditing.value = false;
        showModal.value = true;
    };

    const editUser = (user) => {
        selectedUser.value = {...user};
        isEditing.value = true;
        showModal.value = true;
    };

    const saveUser = async () => {
        if (isEditing.value) {
            const user = {
                firstName: selectedUser.value.firstName,
                lastName: selectedUser.value.lastName,
                email: selectedUser.value.email,
                password: selectedUser.value.password,
                role: selectedUser.value.role
            };
            await axios.put(`user/${selectedUser.value.id}`, user, {requiresAuth: true});
        } else {
            await axios.post('auth/signup', selectedUser.value, {requiresAuth: true});
        }
        showModal.value = false;
        await getUsers();
    };

    const deleteUser = async (userId) => {
        await axios.delete(`user/${userId}`, {requiresAuth: true});
        await getUsers();
    };

    onMounted(async () => {
        await getUsers();
    });

    return {
        users,
        showModal,
        selectedUser,
        isEditing,
        roles,
        getUsers,
        openCreateModal,
        editUser,
        saveUser,
        deleteUser
    };
}
