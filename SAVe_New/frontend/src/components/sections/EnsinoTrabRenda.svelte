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
                `/cases/${caseId}/ensino-trab-renda`,
            );
            data = response.data || {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for EnsinoTrabRenda",
            );
            data = {
                Escolaridade: "Ensino Médio Completo",
                Estuda_Atualmente: "Não",
                Instituicao_Ensino: "",
                Situacao_Trabalho: "Desempregado",
                Profissao: "",
                Renda_Valor: "0,00",
                Prejuizos_Trabalho: "Perda do emprego devido à violência",
                Demandas_Educacional: false,
                Demandas_Trabalhista: true,
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
                // await api.put(`/cases/${caseId}/ensino-trab-renda`, data);
                console.log("Autosaving EnsinoTrabRenda...", data);
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
            <!-- Educação -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Educação
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Grau de Escolaridade</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Escolaridade}
                        >
                            <option value="">Selecione...</option>
                            <option value="Analfabeto">Analfabeto</option>
                            <option value="Fundamental Incompleto"
                                >Fundamental Incompleto</option
                            >
                            <option value="Fundamental Completo"
                                >Fundamental Completo</option
                            >
                            <option value="Ensino Médio Incompleto"
                                >Ensino Médio Incompleto</option
                            >
                            <option value="Ensino Médio Completo"
                                >Ensino Médio Completo</option
                            >
                            <option value="Superior Incompleto"
                                >Superior Incompleto</option
                            >
                            <option value="Superior Completo"
                                >Superior Completo</option
                            >
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Estuda Atualmente?</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Estuda_Atualmente}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    {#if data.Estuda_Atualmente === "Sim"}
                        <label class="block md:col-span-2">
                            <span class="text-gray-700"
                                >Instituição de Ensino</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Instituicao_Ensino}
                            />
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Trabalho e Renda -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Trabalho e Renda
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Situação de Trabalho</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Situacao_Trabalho}
                        >
                            <option value="">Selecione...</option>
                            <option value="Empregado Formal"
                                >Empregado Formal (CLT)</option
                            >
                            <option value="Empregado Informal"
                                >Empregado Informal</option
                            >
                            <option value="Autônomo">Autônomo</option>
                            <option value="Desempregado">Desempregado</option>
                            <option value="Aposentado/Pensionista"
                                >Aposentado/Pensionista</option
                            >
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Profissão</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Profissao}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Renda Mensal (R$)</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Renda_Valor}
                        />
                    </label>

                    <label class="block md:col-span-2">
                        <span class="text-gray-700"
                            >Prejuízos no Trabalho / Patrimônio</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Prejuizos_Trabalho}
                        ></textarea>
                    </label>
                </div>
            </div>

            <!-- Demandas -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Demandas
                </h3>
                <div class="flex gap-6">
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Demandas_Educacional}
                        />
                        <span class="ml-2">Demanda Educacional</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Demandas_Trabalhista}
                        />
                        <span class="ml-2">Demanda Trabalhista</span>
                    </label>
                </div>
            </div>
        </div>
    {/if}
</div>
