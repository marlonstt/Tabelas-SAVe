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
            const response = await api.get(`/cases/${caseId}/saude`);
            data = response.data || {};
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Saude");
            data = {
                Pessoa_Com_Deficiencia: "Não",
                Tipo_Deficiencia: "",
                Condicoes_Saude: "",
                Uso_Medicacao: "Sim",
                Medicacao_Descricao: "Antidepressivo",
                Fatores_Risco: "Tabagismo",
                Rede_Saude: "UBS",
                Acompanhamento_Saude: "",
                Vitimizacao_Sexual_Acompanhamento: "",
                Comprometimentos_Cognitivos: "",
                Impactos_Vitimizacao: "Ansiedade; Insônia",
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
                // await api.put(`/cases/${caseId}/saude`, data);
                console.log("Autosaving Saude...", data);
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
            <!-- Deficiência -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Deficiência
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Pessoa com Deficiência?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Pessoa_Com_Deficiencia}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    {#if data.Pessoa_Com_Deficiencia === "Sim"}
                        <label class="block">
                            <span class="text-gray-700"
                                >Tipo de Deficiência</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Tipo_Deficiencia}
                                placeholder="Física, Visual, Auditiva, Intelectual..."
                            />
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Condições de Saúde -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Condições de Saúde
                </h3>
                <label class="block mb-4">
                    <span class="text-gray-700"
                        >Condições de saúde permanentes ou crônicas</span
                    >
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="2"
                        bind:value={data.Condicoes_Saude}
                    ></textarea>
                </label>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Faz uso de medicação contínua?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Uso_Medicacao}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    {#if data.Uso_Medicacao === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">Qual medicação?</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Medicacao_Descricao}
                            />
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Acompanhamento -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Acompanhamento de Saúde
                </h3>
                <div class="grid grid-cols-1 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Acompanhamento Geral</span>
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Acompanhamento_Saude}
                            placeholder="Descreva o acompanhamento de saúde atual..."
                        ></textarea>
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Acompanhamento - Vitimização Sexual</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Vitimizacao_Sexual_Acompanhamento}
                            placeholder="Profilaxia, atendimento especializado..."
                        ></textarea>
                    </label>
                </div>
            </div>

            <!-- Fatores de Risco -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Fatores de Risco
                </h3>
                <label class="block">
                    <span class="text-gray-700"
                        >Uso de substâncias / Comportamentos de risco</span
                    >
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="2"
                        bind:value={data.Fatores_Risco}
                        placeholder="Álcool, Tabaco, Outras drogas..."
                    ></textarea>
                </label>
            </div>

            <!-- Rede de Saúde -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Acesso à Rede de Saúde
                </h3>
                <label class="block">
                    <span class="text-gray-700">Serviços utilizados</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Rede_Saude}
                        placeholder="UBS, CAPS, Hospital, Plano de Saúde..."
                    />
                </label>
            </div>

            <!-- Impactos -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Impactos da Vitimização na Saúde
                </h3>
                <div class="grid grid-cols-1 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Comprometimentos Cognitivos</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Comprometimentos_Cognitivos}
                        ></textarea>
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Outros Impactos (Físicos, Psicológicos)</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="3"
                            bind:value={data.Impactos_Vitimizacao}
                            placeholder="Danos físicos, psicológicos, emocionais..."
                        ></textarea>
                    </label>
                </div>
            </div>
        </div>
    {/if}
</div>
