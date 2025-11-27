<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        acompanhamentos: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/acompanhamentos`);
            data = response.data || { acompanhamentos: [] };
            if (!data.acompanhamentos) data.acompanhamentos = [];
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Acompanhamento",
            );
            data = {
                acompanhamentos: [
                    {
                        Data: "2025-11-20",
                        Tipo_Atendimento: "Presencial",
                        Sintese:
                            "Atendimento inicial realizado. Vítima relata medo.",
                        Encaminhamento: "Psicologia",
                        Responsaveis: "Assistente Social Ana",
                    },
                ],
            };
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    });

    function autosave() {
        if (loading) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                // await api.put(`/cases/${caseId}/acompanhamentos`, data);
                console.log("Autosaving Acompanhamento...", data);
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

    function addAcompanhamento() {
        data.acompanhamentos = [
            {
                Data: new Date().toISOString().split("T")[0],
                Tipo_Atendimento: "Presencial",
                Sintese: "",
                Encaminhamento: "",
                Responsaveis: "",
            },
            ...data.acompanhamentos,
        ];
        autosave();
    }

    function removeAcompanhamento(index: number) {
        data.acompanhamentos = data.acompanhamentos.filter(
            (_, i) => i !== index,
        );
        autosave();
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
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-700">
                    Histórico de Acompanhamentos
                </h3>
                <button
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm flex items-center"
                    on:click={addAcompanhamento}
                >
                    <span class="material-icons mr-1">add</span> Novo Acompanhamento
                </button>
            </div>

            {#each data.acompanhamentos as acomp, i}
                <div class="bg-gray-50 p-4 rounded border mb-4 relative">
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        on:click={() => removeAcompanhamento(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <label class="block">
                            <span class="text-xs text-gray-500">Data</span>
                            <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Data}
                            />
                        </label>
                        <label class="block">
                            <span class="text-xs text-gray-500"
                                >Tipo de Atendimento</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Tipo_Atendimento}
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Remoto/Telefone"
                                    >Remoto/Telefone</option
                                >
                                <option value="Visita Domiciliar"
                                    >Visita Domiciliar</option
                                >
                                <option value="Reunião de Rede"
                                    >Reunião de Rede</option
                                >
                            </select>
                        </label>
                    </div>

                    <label class="block mb-4">
                        <span class="text-xs text-gray-500"
                            >Síntese do Atendimento</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="3"
                            bind:value={acomp.Sintese}
                        ></textarea>
                    </label>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-xs text-gray-500"
                                >Encaminhamentos</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Encaminhamento}
                            />
                        </label>
                        <label class="block">
                            <span class="text-xs text-gray-500"
                                >Responsáveis Técnicos</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Responsaveis}
                            />
                        </label>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
