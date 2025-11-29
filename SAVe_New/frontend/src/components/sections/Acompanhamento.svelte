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
    let saveStatus = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            data = { acompanhamentos: response.data.acompanhamentos || [] };
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

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/acompanhamentos`, data);
            saveStatus = "Salvo com sucesso! ✅";
            lastSavedData = JSON.stringify(data);
            setTimeout(() => (saveStatus = ""), 3000);
        } catch (err) {
            console.error("Error saving data:", err);
            saveStatus = "Erro ao salvar ❌";
        } finally {
            saving = false;
        }
    }

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            if (saving) return; // Double check
            saving = true;
            saveStatus = "Salvando...";
            try {
                await api.put(`/cases/${caseId}/acompanhamentos`, data);
                console.log("Autosaving Acompanhamento...", data);
                saveStatus = "Salvo! ✅";
                lastSavedData = currentData;
                setTimeout(() => (saveStatus = ""), 2000);
            } catch (err) {
                console.error("Error autosaving", err);
                saveStatus = "Erro ao salvar ❌";
            } finally {
                saving = false;
            }
        }, 2000);
    }

    $: if (data) autosave();

    function addAcompanhamento() {
        data.acompanhamentos = [
            ...data.acompanhamentos,
            {
                Data: new Date().toISOString().split("T")[0],
                Tipo_Atendimento: "Presencial",
                Sintese: "",
                Encaminhamento: "",
                Responsaveis: "",
            },
        ];
        autosave();
    }

    function removeAcompanhamento(index: number) {
        data.acompanhamentos = data.acompanhamentos.filter(
            (_: any, i: number) => i !== index,
        );
        autosave();
    }
</script>

<!-- Autosave Indicator -->
<div class="relative p-4 space-y-4">
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
        <span
            class="flex items-center {saveStatus.includes('Erro')
                ? 'text-red-600'
                : 'text-green-600'}"
        >
            {#if saveStatus.includes("Erro")}
                <span class="material-icons text-sm mr-1">error</span>
            {:else if saveStatus.includes("Salvo")}
                <span class="material-icons text-sm mr-1">check</span>
            {/if}
            {saveStatus || "Salvo"}
        </span>
    </div>

    <h2 class="text-xl font-bold text-gray-800 mb-4">Acompanhamentos</h2>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Lista de Acompanhamentos -->
            {#each data.acompanhamentos as acomp, i}
                <div class="border p-4 rounded bg-gray-50 relative">
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        on:click={() => removeAcompanhamento(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Data</span>
                            <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Data}
                            />
                        </label>

                        <label class="block">
                            <span class="text-gray-700"
                                >Tipo de Atendimento</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Tipo_Atendimento}
                            >
                                <option value="">Selecione...</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Telefônico">Telefônico</option>
                                <option value="Visita Domiciliar"
                                    >Visita Domiciliar</option
                                >
                                <option value="Outros">Outros</option>
                            </select>
                        </label>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700">Síntese</span>
                                <textarea
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    rows="3"
                                    bind:value={acomp.Sintese}
                                ></textarea>
                            </label>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700"
                                    >Encaminhamentos</span
                                >
                                <textarea
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    rows="2"
                                    bind:value={acomp.Encaminhamento}
                                ></textarea>
                            </label>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700">Responsáveis</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={acomp.Responsaveis}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            {/each}

            <button
                class="text-save-primary hover:underline font-medium"
                on:click={addAcompanhamento}
            >
                + Adicionar Acompanhamento
            </button>

            <!-- Manual Save Button -->
            <div class="flex justify-end mt-4">
                <button
                    class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                    on:click={manualSave}
                    disabled={saving || loading}
                >
                    {saving ? "Salvando..." : "Salvar Dados"}
                </button>
            </div>
        </div>
    {/if}
</div>
