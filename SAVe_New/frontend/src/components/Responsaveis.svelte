<script lang="ts">
    import { onMount } from "svelte";
    import api from "../lib/api";

    let responsaveis: any[] = [];
    let loading = true;
    let showModal = false;
    let editingId: number | null = null;

    // Form data
    let nome = "";
    let cargo = "";
    let area = "";
    let customCargo = "";
    let customArea = "";

    // Options
    const cargoOptions = [
        "Promotora(o)",
        "Técnica(o)",
        "Estagiária(o)",
        "Assessora(or)",
        "Outro",
    ];
    const areaOptions = ["Direito", "Psicossocial", "Outro"];

    onMount(async () => {
        await loadResponsaveis();
    });

    async function loadResponsaveis() {
        loading = true;
        try {
            const response = await api.get("/admin/responsaveis");
            responsaveis = response.data;
        } catch (error) {
            console.error("Error loading responsaveis:", error);
            alert("Erro ao carregar responsáveis.");
        } finally {
            loading = false;
        }
    }

    function openModal(responsavel: any = null) {
        if (responsavel) {
            editingId = responsavel.ID;
            nome = responsavel.Nome;

            if (cargoOptions.includes(responsavel.Cargo)) {
                cargo = responsavel.Cargo;
                customCargo = "";
            } else {
                cargo = "Outro";
                customCargo = responsavel.Cargo;
            }

            if (areaOptions.includes(responsavel.Area)) {
                area = responsavel.Area;
                customArea = "";
            } else {
                area = "Outro";
                customArea = responsavel.Area;
            }
        } else {
            editingId = null;
            nome = "";
            cargo = "";
            area = "";
            customCargo = "";
            customArea = "";
        }
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    async function saveResponsavel() {
        const finalCargo = cargo === "Outro" ? customCargo : cargo;
        const finalArea = area === "Outro" ? customArea : area;

        if (!nome || !finalCargo || !finalArea) {
            alert("Preencha todos os campos.");
            return;
        }

        const payload = {
            Nome: nome,
            Cargo: finalCargo,
            Area: finalArea,
        };

        try {
            if (editingId) {
                await api.put(`/admin/responsaveis/${editingId}`, payload);
            } else {
                await api.post("/admin/responsaveis", payload);
            }
            closeModal();
            loadResponsaveis();
        } catch (error) {
            console.error("Error saving responsavel:", error);
            alert("Erro ao salvar responsável.");
        }
    }

    async function deleteResponsavel(id: number) {
        if (!confirm("Tem certeza que deseja excluir este responsável?"))
            return;

        try {
            await api.delete(`/admin/responsaveis/${id}`);
            loadResponsaveis();
        } catch (error) {
            console.error("Error deleting responsavel:", error);
            alert("Erro ao excluir responsável.");
        }
    }
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestão de Responsáveis</h1>
        <button
            class="bg-save-primary text-white px-4 py-2 rounded hover:bg-save-secondary transition-colors"
            on:click={() => openModal()}
        >
            Adicionar Responsável
        </button>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >ID</th
                        >
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >Nome</th
                        >
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >Cargo</th
                        >
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >Área</th
                        >
                        <th
                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >Ações</th
                        >
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each responsaveis as resp}
                        <tr>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >{resp.ID}</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                >{resp.Nome}</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >{resp.Cargo}</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >{resp.Area}</td
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                            >
                                <button
                                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                                    on:click={() => openModal(resp)}
                                >
                                    Editar
                                </button>
                                <button
                                    class="text-red-600 hover:text-red-900"
                                    on:click={() => deleteResponsavel(resp.ID)}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    {#if showModal}
        <div
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
        >
            <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 class="text-xl font-bold mb-4">
                    {editingId ? "Editar" : "Adicionar"} Responsável
                </h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Nome</label
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary"
                            bind:value={nome}
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Cargo</label
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary"
                            bind:value={cargo}
                        >
                            <option value="">Selecione...</option>
                            {#each cargoOptions as opt}
                                <option value={opt}>{opt}</option>
                            {/each}
                        </select>
                        {#if cargo === "Outro"}
                            <input
                                type="text"
                                placeholder="Digite o cargo"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary"
                                bind:value={customCargo}
                            />
                        {/if}
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700"
                            >Área</label
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary"
                            bind:value={area}
                        >
                            <option value="">Selecione...</option>
                            {#each areaOptions as opt}
                                <option value={opt}>{opt}</option>
                            {/each}
                        </select>
                        {#if area === "Outro"}
                            <input
                                type="text"
                                placeholder="Digite a área"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary"
                                bind:value={customArea}
                            />
                        {/if}
                    </div>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                    <button
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        on:click={closeModal}
                    >
                        Cancelar
                    </button>
                    <button
                        class="px-4 py-2 bg-save-primary text-white rounded-md hover:bg-save-secondary"
                        on:click={saveResponsavel}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
