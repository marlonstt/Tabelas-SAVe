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
                `/cases/${caseId}/protecao-seguranca`,
            );
            data = response.data || {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for ProtecaoSeguranca",
            );
            data = {
                Natureza_Ameaca: "Morte",
                Meio_Ameaca: "Presencial",
                Tempo_Ameaca: "6 meses",
                Relacao_Autor_Vitima: "Ex-companheiro",
                Ameacas_Anteriores: "Sim",
                Agente_Publico: "Não",
                Acesso_Armas: "Sim",
                Perseguicao: "Sim",
                Ameaca_Crianca: "Não",
                Impactos_Emocionais: "Medo constante",
                Rede_Apoio: "Familiares",
                Equipamentos_Seguranca: "Câmera",
                Programa_Protecao: "Não",
                Violencia_Domestica: "Sim",
                Protocolo_FF: "Alto Risco",
                Avaliacao_Risco: "Alto",
                Plano_Seguranca: "Mudança de endereço",
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
                // await api.put(`/cases/${caseId}/protecao-seguranca`, data);
                console.log("Autosaving ProtecaoSeguranca...", data);
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
            <!-- Detalhes da Ameaça -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Detalhes da Ameaça
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Natureza da Ameaça</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Natureza_Ameaca}
                            placeholder="Morte, Agressão Física..."
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Como a ameaça é feita?</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Meio_Ameaca}
                            placeholder="Presencial, Telefone, Redes Sociais..."
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Tempo de Ameaça</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tempo_Ameaca}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Relação Autor-Vítima</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Relacao_Autor_Vitima}
                        />
                    </label>
                </div>

                <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            checked={data.Ameacas_Anteriores === "Sim"}
                            on:change={(e) =>
                                (data.Ameacas_Anteriores = e.currentTarget
                                    .checked
                                    ? "Sim"
                                    : "Não")}
                        />
                        <span class="ml-2">Ameaças Anteriores</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            checked={data.Agente_Publico === "Sim"}
                            on:change={(e) =>
                                (data.Agente_Publico = e.currentTarget.checked
                                    ? "Sim"
                                    : "Não")}
                        />
                        <span class="ml-2">Agente Público?</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            checked={data.Acesso_Armas === "Sim"}
                            on:change={(e) =>
                                (data.Acesso_Armas = e.currentTarget.checked
                                    ? "Sim"
                                    : "Não")}
                        />
                        <span class="ml-2">Acesso a Armas</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            checked={data.Perseguicao === "Sim"}
                            on:change={(e) =>
                                (data.Perseguicao = e.currentTarget.checked
                                    ? "Sim"
                                    : "Não")}
                        />
                        <span class="ml-2">Perseguição (Stalking)</span>
                    </label>
                </div>
            </div>

            <!-- Impactos e Riscos -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Impactos e Riscos
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Ameaça estendida a crianças/adolescentes?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Ameaca_Crianca}
                        >
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Violência Doméstica?</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Violencia_Domestica}
                        >
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block md:col-span-2">
                        <span class="text-gray-700"
                            >Impactos Emocionais / Financeiros</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Impactos_Emocionais}
                        ></textarea>
                    </label>
                </div>
            </div>

            <!-- Proteção -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Medidas de Proteção
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Rede de Apoio Ativada</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Rede_Apoio}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Equipamentos de Segurança</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Equipamentos_Seguranca}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Inserido em Programa de Proteção?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Programa_Protecao}
                        >
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Protocolo de Risco (Formulário Frída)</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Protocolo_FF}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Avaliação de Risco</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Avaliacao_Risco}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Plano de Segurança</span>
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Plano_Seguranca}
                        ></textarea>
                    </label>
                </div>
            </div>
        </div>
    {/if}
</div>
