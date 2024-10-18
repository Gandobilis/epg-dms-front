<script setup>
import axios from "../interceptors/axios/index.js";
import {onMounted, ref} from "vue";

const users = ref()
const getUsers = async () => {
  const {data} = await axios.get('user', {requiresAuth: true})
  users.value = data;
}

const showModal = ref(false);
const selectedUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: ''
});
const isEditing = ref(false);

function openCreateModal() {
  selectedUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  };
  isEditing.value = false;
  showModal.value = true;
}

function editUser(user) {
  selectedUser.value = {...user};
  isEditing.value = true;
  showModal.value = true;
}

async function saveUser() {
  if (isEditing.value) {
    await axios.put(`user/${selectedUser.value.id}`, selectedUser.value, {recuiresAuth: true})
  } else {
    await axios.post('auth/signup', selectedUser.value, {recuiresAuth: true})
  }
  showModal.value = false;
  await getUsers()
}

async function deleteUser(userId) {
  await axios.delete(`user/${userId}`, {recuiresAuth: true})
  await getUsers()
}

onMounted(async () => {
  await getUsers()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">მომხმარებელთა სამართავი პანელი</h1>

    <!-- Create User Button -->
    <button @click="openCreateModal"
            class="btn btn-success text-white mb-4">
      მომხმარებლის დამატება
    </button>

    <table class="min-w-full table-auto">
      <thead>
      <tr class="bg-gray-200">
        <th class="px-4 py-2">ID</th>
        <th class="px-4 py-2">სახელი</th>
        <th class="px-4 py-2">გვარი</th>
        <th class="px-4 py-2">ემაილი</th>
        <th class="px-4 py-2">როლი</th>
        <th class="px-4 py-2">შექმნის თარიღი</th>
        <th class="px-4 py-2">განახლების თარიღი</th>
        <th class="px-4 py-2">ქმედებები</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id" class="text-center">
        <td class="border px-4 py-2">{{ user.id }}</td>
        <td class="border px-4 py-2">{{ user.firstName }}</td>
        <td class="border px-4 py-2">{{ user.lastName }}</td>
        <td class="border px-4 py-2">{{ user.email }}</td>
        <td class="border px-4 py-2">{{ user.role }}</td>
        <td class="border px-4 py-2">{{ new Date(user.createdAt).toLocaleString() }}</td>
        <td class="border px-4 py-2">{{ new Date(user.updatedAt).toLocaleString() }}</td>
        <td class="border px-4 py-2">
          <button @click="editUser(user)" class="btn btn-sm btn-info text-white">
            შეცვლა
          </button>
          <button @click="deleteUser(user.id)"
                  class="btn btn-error text-white btn-sm ml-2.5">წაშლა
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Edit/Create Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-1/3">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'მომხმარებლის ცვლილება' : 'მომხმარებლის შექმნა' }}</h2>
        <div class="mb-4">
          <label class="block mb-1">სახელი</label>
          <input v-model="selectedUser.firstName" type="text" class="w-full border px-3 py-2 rounded-lg"/>
        </div>
        <div class="mb-4">
          <label class="block mb-1">გვარი</label>
          <input v-model="selectedUser.lastName" type="text" class="w-full border px-3 py-2 rounded-lg"/>
        </div>
        <div class="mb-4">
          <label class="block mb-1">ემაილი</label>
          <input v-model="selectedUser.email" type="email" class="w-full border px-3 py-2 rounded-lg"/>
        </div>
        <div class="mb-4">
          <label class="block mb-1">როლი</label>
          <input v-model="selectedUser.role" type="text" class="w-full border px-3 py-2 rounded-lg"/>
        </div>
        <div class="flex justify-end gap-x-5">
          <button @click="saveUser" class="btn btn-success text-white">
            {{ isEditing ? 'შენახვა' : 'შექმნა' }}
          </button>
          <button @click="showModal = false"
                  class="btn">გაუქმება
          </button>
        </div>
      </div>
    </div>
  </div>
</template>