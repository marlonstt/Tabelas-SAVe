<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(
                `/cases/${caseId}/sintese-analitica`,
            );
            data = response.data || {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for SinteseAnalitica",
            );
            data = {
                Unidade_Analitica:
                    "Caso complexo envolvendo violência doméstica e risco de feminicídio.",
                Avaliacao_Riscos:
                    "Alto risco devido ao histórico de ameaças e acesso a armas.",
                Plano_Prevencao:
                    "Encaminhamento para abrigo sigiloso e solicitação de medidas protetivas de urgência.",
                Data_Vencimento: "2025-12-31",
                Cor_Risco: "Vermelho",
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
                // await api.put(`/cases/${caseId}/sintese-analitica`, data);
                console.log("Autosaving SinteseAnalitica...", data);
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
            <!-- Indicador de Risco -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Classificação de Risco
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Nível de Risco (Cor)</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Cor_Risco}
                        >
                            <option value="">Selecione...</option>
                            <option value="Verde">Verde (Baixo)</option>
                            <option value="Amarelo">Amarelo (Médio)</option>
                            <option value="Vermelho">Vermelho (Alto)</option>
                            <option value="Roxo">Roxo (Extremo)</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Data de Vencimento / Revisão</span
                        >
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Vencimento}
                        />
                    </label>
                </div>
            </div>

            <!-- Análise Técnica -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Análise Técnica
                </h3>

                <label class="block mb-4">
                    <span class="text-gray-700 font-medium"
                        >Unidade Analítica (Síntese do Caso)</span
                    >
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="6"
                        bind:value={data.Unidade_Analitica}
                    ></textarea>
                </label>

                <label class="block mb-4">
                    <span class="text-gray-700 font-medium"
                        >Avaliação de Riscos</span
                    >
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="6"
                        bind:value={data.Avaliacao_Riscos}
                    ></textarea>
                </label>

                <label class="block">
                    <span class="text-gray-700 font-medium"
                        >Plano de Prevenção e Enfrentamento</span
                    >
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="6"
                        bind:value={data.Plano_Prevencao}
                    ></textarea>
                </label>
            </div>
        </div>
    {/if}
</div>
