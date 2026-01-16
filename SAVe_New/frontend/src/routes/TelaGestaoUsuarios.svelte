<script lang="ts">
    import { onMount } from "svelte";
    import api from "../lib/api";
    import { showToast } from "../lib/stores";
    import ConfirmModal from "../components/ConfirmModal.svelte";

    interface User {
        id: number;
        email: string;
        cargo: string;
        usuario: string;
        area: string;
        role: string;
        created_at: string;
    }

    let users: User[] = [];
    let loading = true;
    let showModal = false;
    let editingUser: User | null = null;

    // Confirm Modal State
    let showConfirmModal = false;
    let userToDeleteId: number | null = null;

    let formData = {
        email: "",
        cargo: "",
        usuario: "",
        area: "",
        role: "User",
    };

    onMount(() => {
        fetchUsers();
    });

    async function fetchUsers() {
        try {
            const response = await api.get("/admin/users");
            users = response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            console.error("Error fetching users:", error);
            showToast(
                "Erro ao carregar usuários. Verifique se você é administrador.",
                "error",
            );
        } finally {
            loading = false;
        }
    }

    function handleOpenModal(user?: User) {
        if (user) {
            editingUser = user;
            formData = {
                email: user.email,
                cargo: user.cargo || "",
                usuario: user.usuario || "",
                area: user.area || "",
                role: user.role,
            };
        } else {
            editingUser = null;
            formData = {
                email: "",
                cargo: "",
                usuario: "",
                area: "",
                role: "User",
            };
        }
        showModal = true;
    }

    async function handleSubmit() {
        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, formData);
            } else {
                await api.post("/admin/users", formData);
            }
            showModal = false;
            fetchUsers();
            showToast("Usuário salvo com sucesso!", "success");
        } catch (error: any) {
            showToast(
                error.response?.data?.error || "Erro ao salvar usuário",
                "error",
            );
        }
    }

    function handleDeleteUser(id: number) {
        userToDeleteId = id;
        showConfirmModal = true;
    }

    async function confirmDeleteUser() {
        if (userToDeleteId) {
            try {
                await api.delete(`/admin/users/${userToDeleteId}`);
                fetchUsers();
                showConfirmModal = false;
                userToDeleteId = null;
                showToast("Usuário excluído com sucesso!", "success");
            } catch (error) {
                showToast("Erro ao excluir usuário", "error");
            }
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
                Gestão de Usuários
            </h1>
            <p class="text-sm text-gray-500 mt-1">
                Gerenciar usuários do sistema
            </p>
        </div>
        <button
            on:click={() => handleOpenModal()}
            class="text-white px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity shadow-sm"
            style="background-color: #6264A7"
        >
            Novo Usuário
        </button>
    </div>

    <div
        class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
    >
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Email
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Nome
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Cargo
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Área
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Perfil
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#if loading}
                        <tr>
                            <td
                                colspan="6"
                                class="px-6 py-8 text-center text-gray-500"
                            >
                                <div class="flex justify-center">
                                    <div
                                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-save-primary"
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    {:else if users.length === 0}
                        <tr>
                            <td
                                colspan="6"
                                class="px-6 py-8 text-center text-gray-500"
                            >
                                Nenhum usuário encontrado
                            </td>
                        </tr>
                    {:else}
                        {#each users as user (user.id)}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                >
                                    {user.email}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                >
                                    {user.usuario}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {user.cargo}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {user.area}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {user.role ===
                                        'Admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'}"
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
                                >
                                    <button
                                        on:click={() => handleOpenModal(user)}
                                        class="text-save-primary hover:text-save-secondary font-semibold hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        on:click={() =>
                                            handleDeleteUser(user.id)}
                                        class="text-red-600 hover:text-red-800 font-semibold hover:underline ml-3"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 class="text-xl font-bold mb-4" style="color: #323130">
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium mb-2"
                        style="color: #323130"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        class="w-full px-3 py-2 border rounded"
                        style="border-color: #D2D0CE"
                        bind:value={formData.email}
                        placeholder="usuario@mpmg.mp.br"
                    />
                </div>
                <div>
                    <label
                        for="nome"
                        class="block text-sm font-medium mb-2"
                        style="color: #323130"
                    >
                        Nome
                    </label>
                    <input
                        id="nome"
                        type="text"
                        required
                        class="w-full px-3 py-2 border rounded"
                        style="border-color: #D2D0CE"
                        bind:value={formData.usuario}
                    />
                </div>
                <div>
                    <label
                        for="cargo"
                        class="block text-sm font-medium mb-2"
                        style="color: #323130"
                    >
                        Cargo
                    </label>
                    <select
                        id="cargo"
                        required
                        class="w-full px-3 py-2 border rounded"
                        style="border-color: #D2D0CE"
                        bind:value={formData.cargo}
                    >
                        <option value="">Selecione...</option>
                        <option value="Promotora(o)">Promotora(o)</option>
                        <option value="Assessora(o)">Assessora(o)</option>
                        <option value="Técnica(o)">Técnica(o)</option>
                        <option value="Estagiária(o)">Estagiária(o)</option>
                    </select>
                </div>
                <div>
                    <label
                        for="area"
                        class="block text-sm font-medium mb-2"
                        style="color: #323130"
                    >
                        Área
                    </label>
                    <select
                        id="area"
                        required
                        class="w-full px-3 py-2 border rounded"
                        style="border-color: #D2D0CE"
                        bind:value={formData.area}
                    >
                        <option value="">Selecione...</option>
                        <option value="Psicossocial">Psicossocial</option>
                        <option value="Direito">Direito</option>
                    </select>
                </div>
                <div>
                    <label
                        for="role"
                        class="block text-sm font-medium mb-2"
                        style="color: #323130"
                    >
                        Perfil
                    </label>
                    <select
                        id="role"
                        required
                        class="w-full px-3 py-2 border rounded"
                        style="border-color: #D2D0CE"
                        bind:value={formData.role}
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                {#if !editingUser}
                    <p class="text-sm" style="color: #605E5C">
                        Senha padrão: <strong>123456</strong> (o usuário deverá alterá-la
                        no primeiro login)
                    </p>
                {/if}
                <div class="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        on:click={() => (showModal = false)}
                        class="px-4 py-2 rounded border"
                        style="border-color: #D2D0CE; color: #323130"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 rounded text-white"
                        style="background-color: #6264A7"
                    >
                        {editingUser ? "Salvar Alterações" : "Criar Usuário"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<ConfirmModal
    isOpen={showConfirmModal}
    title="Excluir Usuário"
    message="Tem certeza que deseja excluir este usuário?"
    confirmText="Excluir"
    on:close={() => (showConfirmModal = false)}
    on:confirm={confirmDeleteUser}
/>
