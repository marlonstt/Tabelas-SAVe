<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        Secundaria: {},
        Terciaria: {},
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            data = {
                Secundaria: response.data.vitimizacao?.Secundaria || {},
                Terciaria: response.data.vitimizacao?.Terciaria || {},
            };
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Vitimizacao",
            );
            data = {
                Secundaria: {
                    Depoimento_Repetitivo: true,
                    Espec_Depoimento: "Teve que repetir a história 3 vezes",
                    Falta_Atendimento: false,
                    Demora_Justica: true,
                    Discriminacao_Institucional: false,
                    Violencia_Institucional: false,
                    Ameaca_Institucional: false,
                },
                Terciaria: {
                    Culpabilizacao: true,
                    Espec_Culpabilizacao: "Família culpa a vítima",
                    Estigmatizacao: false,
                    Isolamento_Social: true,
                    Perda_Credibilidade: false,
                },
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
            await api.put(`/cases/${caseId}/vitimizacao`, data);
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
                await api.put(`/cases/${caseId}/vitimizacao`, data);
                console.log("Autosaving Vitimizacao...", data);
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

    <h2 class="text-xl font-bold text-gray-800 mb-4">Vitimização</h2>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Vitimização Secundária -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Vitimização Secundária (Sistema de Justiça/Estado)
                </h3>

                <div class="space-y-4">
                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Secundaria.Depoimento_Repetitivo
                                }
                            />
                            <span class="ml-2"
                                >Depoimento Repetitivo / Revitimização</span
                            >
                        </label>
                        {#if data.Secundaria.Depoimento_Repetitivo}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Secundaria.Espec_Depoimento}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={data.Secundaria.Falta_Atendimento}
                            />
                            <span class="ml-2"
                                >Falta de Atendimento Especializado</span
                            >
                        </label>
                        {#if data.Secundaria.Falta_Atendimento}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Secundaria.Espec_Falta_Atendimento
                                }
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={data.Secundaria.Demora_Justica}
                            />
                            <span class="ml-2"
                                >Demora do Sistema de Justiça</span
                            >
                        </label>
                        {#if data.Secundaria.Demora_Justica}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Secundaria.Espec_Demora}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Secundaria.Discriminacao_Institucional
                                }
                            />
                            <span class="ml-2">Discriminação Institucional</span
                            >
                        </label>
                        {#if data.Secundaria.Discriminacao_Institucional}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Secundaria.Espec_Discriminacao}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Secundaria.Violencia_Institucional
                                }
                            />
                            <span class="ml-2">Violência Institucional</span>
                        </label>
                        {#if data.Secundaria.Violencia_Institucional}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Secundaria.Espec_Violencia_Inst
                                }
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Secundaria.Ameaca_Institucional
                                }
                            />
                            <span class="ml-2">Ameaça Institucional</span>
                        </label>
                        {#if data.Secundaria.Ameaca_Institucional}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Secundaria.Espec_Ameaca_Inst}
                            />
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Vitimização Terciária -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Vitimização Terciária (Sociedade/Comunidade)
                </h3>

                <div class="space-y-4">
                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={data.Terciaria.Culpabilizacao}
                            />
                            <span class="ml-2">Culpabilização da Vítima</span>
                        </label>
                        {#if data.Terciaria.Culpabilizacao}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Terciaria.Espec_Culpabilizacao}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={data.Terciaria.Estigmatizacao}
                            />
                            <span class="ml-2">Estigmatização Social</span>
                        </label>
                        {#if data.Terciaria.Estigmatizacao}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Terciaria.Espec_Estigmatizacao}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Terciaria.Exploracao_Midiatica
                                }
                            />
                            <span class="ml-2">Exploração Midiática</span>
                        </label>
                        {#if data.Terciaria.Exploracao_Midiatica}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Terciaria.Espec_Midia}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={data.Terciaria.Isolamento_Social}
                            />
                            <span class="ml-2">Isolamento Social</span>
                        </label>
                        {#if data.Terciaria.Isolamento_Social}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={data.Terciaria.Espec_Isolamento}
                            />
                        {/if}
                    </div>

                    <div>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={
                                    data.Terciaria.Perda_Credibilidade
                                }
                            />
                            <span class="ml-2">Perda de Credibilidade</span>
                        </label>
                        {#if data.Terciaria.Perda_Credibilidade}
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Terciaria.Espec_Perda_Credibilidade
                                }
                            />
                        {/if}
                    </div>
                </div>
            </div>

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
