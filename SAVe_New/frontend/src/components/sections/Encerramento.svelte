<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    // Reset data when caseId changes
    $: if (caseId) {
        data = {
            Data_Encerramento: "",
            Forma_Encerramento: "",
            Especifique_Outros: "",
            Observacao: "",
            Encaminhamento_Pos_Alta: "",
        };
        loading = true;
        loadData();
    }

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}/encerramento`);
            data = response.data || {};
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                console.log(
                    "No data found for Encerramento, initializing empty.",
                );
                data = {
                    Data_Encerramento: "",
                    Forma_Encerramento: "",
                    Especifique_Outros: "",
                    Observacao: "",
                    Encaminhamento_Pos_Alta: "",
                };
            } else {
                console.warn(
                    "Backend unavailable, using Mock Data for Encerramento",
                );
                data = {
                    Data_Encerramento: "",
                    Forma_Encerramento: "",
                    Especifique_Outros: "",
                    Observacao: "",
                    Encaminhamento_Pos_Alta: "",
                };
            }
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    onMount(() => {
        loadData();
    });

    function autosave() {
        if (loading) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                // await api.put(`/cases/${caseId}/encerramento`, data);
                console.log("Autosaving Encerramento...", data);
                await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    $: if (data) autosave();

    async function finalizeCase() {
        if (
            !confirm(
                "Tem certeza que deseja encerrar este caso? Esta ação arquivará o caso.",
            )
        ) {
            return;
        }
        try {
            await api.post(`/cases/${caseId}/archive`, data);
            alert("Caso encerrado com sucesso!");
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            alert("Erro ao encerrar caso");
        }
    }
</script>

<div class="bg-white rounded shadow p-6 relative">
    <!-- Autosave Indicator -->
    <div
        class="absolute top-4 right-4 text-sm font-medium transition-opacity duration-300"
        class:opacity-0={!saving}
        class:opacity-100={saving}
    >
        <span class="text-save-primary flex items-center">
            <span class="material-icons text-sm mr-1 animate-spin">sync</span>
            Salvando...
        </span>
    </div>
    <div
        class="absolute top-4 right-4 text-sm font-medium transition-opacity duration-300"
        class:opacity-0={saving || loading}
        class:opacity-100={!saving && !loading}
    >
        <span class="text-green-600 flex items-center">
            <span class="material-icons text-sm mr-1">check</span>
            Salvo
        </span>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <span class="material-icons text-yellow-400"
                            >warning</span
                        >
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            O encerramento do caso indica que não haverá mais
                            acompanhamentos ativos. Certifique-se de que todas
                            as etapas foram concluídas.
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="block">
                    <span class="text-gray-700">Data de Encerramento</span>
                    <input
                        type="date"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Data_Encerramento}
                    />
                </label>

                <label class="block">
                    <span class="text-gray-700">Motivo do Encerramento</span>
                    <select
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Forma_Encerramento}
                    >
                        <option value="">Selecione...</option>
                        <option value="Conclusão do Plano"
                            >Conclusão do Plano de Acompanhamento</option
                        >
                        <option value="Evasão">Evasão / Perda de Contato</option
                        >
                        <option value="Transferência"
                            >Transferência para outro serviço</option
                        >
                        <option value="Óbito">Óbito</option>
                        <option value="Outros">Outros</option>
                    </select>
                </label>
            </div>

            {#if data.Forma_Encerramento === "Outros"}
                <label class="block">
                    <span class="text-gray-700">Especifique</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Especifique_Outros}
                    />
                </label>
            {/if}

            <label class="block">
                <span class="text-gray-700">Encaminhamento Pós-Alta</span>
                <input
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    bind:value={data.Encaminhamento_Pos_Alta}
                />
            </label>

            <label class="block">
                <span class="text-gray-700">Observações Finais</span>
                <textarea
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    rows="4"
                    bind:value={data.Observacao}
                ></textarea>
            </label>
        </div>

        <div class="mt-6 flex justify-end">
            <button
                class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition shadow flex items-center"
                on:click={finalizeCase}
            >
                <span class="material-icons mr-2">lock</span> Encerrar Caso
            </button>
        </div>
    {/if}
</div>
