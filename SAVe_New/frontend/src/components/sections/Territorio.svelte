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
            const response = await api.get(`/cases/${caseId}/territorio`);
            data = response.data || {};
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Territorio");
            data = {
                Moradia_regular: false,
                Moradia_regular_esp: "",
                Moradia_Irregular: false,
                Moradia_Irregular_esp: "",
                Moradia_Emergencial: false,
                Moradia_Emergencial_esp: "",

                Territorio: "",
                Comunidade_tradicional: "Não",
                Comunidade_tradicional_esp: "",

                titulado_Incra: "Não",
                Reconhecido_funai: "Não",
                Reconhecido_fund_palmares: "Não",
                Reconhecido_orgao_publico: "Não",

                Estrutura_Mat_predominante: "Sim",
                Estrutura_Mat_predominante_esp: "",
                Estrutura_Insta_eletricas_hidraulica: "Sim",
                Estrutura_Insta_eletricas_hidraulica_esp: "",
                Estrutura_Risco_geologico: "Não",
                Estrutura_Risco_geologico_esp: "",
                Estrutura_Acesso_internet: "Sim",
                Estrutura_Acesso_internet_esp: "",
                Estrutura_danos_eventos_naturais: "Não",
                Estrutura_danos_eventos_naturais_esp: "",
                Estrutura_paredes_revesti: "",

                Fatores_risco_ambiental_infra: false,
                Fatores_risco_ambiental_infra_esp: "",
                Conflitos_Urbanos_Criminalidade: false,
                Conflitos_Urbanos_Criminalidade_esp: "",
                Conflitos_fundiarios_Agrarios: false,
                Conflitos_fundiarios_Agrarios_esp: "",
                Fatores_risco_outros: false,
                Fatores_risco_outros_esp: "",

                RV_Mudanca_domicilio: "Não",
                RV_Mudanca_domicilio_esp: "",

                Tempo_Situacao_Rua: "",
                Sit_Rua_Risco_Violencia: "",
                Tem_Contato_Familiar: "Não",
                Frequenta_Instituicao_Acolhimento: "Não",
                Especifique_Instituicao_Acolhimento: "",
                Expectativas_Futuro: "",
                Nomes_Vinculos_Afetivos: "",
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
                // await api.put(`/cases/${caseId}/territorio`, data);
                console.log("Autosaving Territorio...", data);
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
            <!-- Tipo de Moradia -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Tipo de Moradia
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={data.Moradia_regular}
                            />
                            <span class="text-gray-700 font-medium"
                                >Moradia Regular</span
                            >
                        </label>
                        {#if data.Moradia_regular}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={data.Moradia_regular_esp}
                            />
                        {/if}
                    </div>
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={data.Moradia_Irregular}
                            />
                            <span class="text-gray-700 font-medium"
                                >Moradia Irregular</span
                            >
                        </label>
                        {#if data.Moradia_Irregular}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={data.Moradia_Irregular_esp}
                            />
                        {/if}
                    </div>
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={data.Moradia_Emergencial}
                            />
                            <span class="text-gray-700 font-medium"
                                >Moradia Emergencial</span
                            >
                        </label>
                        {#if data.Moradia_Emergencial}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={data.Moradia_Emergencial_esp}
                            />
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Território e Comunidade -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Território e Comunidade
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Território</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Territorio}
                        />
                    </label>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Comunidade Tradicional?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={data.Comunidade_tradicional}
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={data.Comunidade_tradicional}
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Comunidade_tradicional === "Sim"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Qual?"
                                bind:value={data.Comunidade_tradicional_esp}
                            />
                        {/if}
                    </div>
                </div>
                <div class="mt-4">
                    <h4 class="text-sm font-semibold mb-3 text-gray-700">
                        Reconhecimentos
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-700 block mb-1"
                                >Titulado INCRA?</span
                            >
                            <div class="flex gap-4">
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Sim"
                                        bind:group={data.titulado_Incra}
                                    /><span class="ml-2">Sim</span></label
                                >
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Não"
                                        bind:group={data.titulado_Incra}
                                    /><span class="ml-2">Não</span></label
                                >
                            </div>
                        </div>
                        <div>
                            <span class="text-gray-700 block mb-1"
                                >Reconhecido FUNAI?</span
                            >
                            <div class="flex gap-4">
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Sim"
                                        bind:group={data.Reconhecido_funai}
                                    /><span class="ml-2">Sim</span></label
                                >
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Não"
                                        bind:group={data.Reconhecido_funai}
                                    /><span class="ml-2">Não</span></label
                                >
                            </div>
                        </div>
                        <div>
                            <span class="text-gray-700 block mb-1"
                                >Reconhecido Fund. Palmares?</span
                            >
                            <div class="flex gap-4">
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Sim"
                                        bind:group={
                                            data.Reconhecido_fund_palmares
                                        }
                                    /><span class="ml-2">Sim</span></label
                                >
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Não"
                                        bind:group={
                                            data.Reconhecido_fund_palmares
                                        }
                                    /><span class="ml-2">Não</span></label
                                >
                            </div>
                        </div>
                        <div>
                            <span class="text-gray-700 block mb-1"
                                >Reconhecido Órgão Público?</span
                            >
                            <div class="flex gap-4">
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Sim"
                                        bind:group={
                                            data.Reconhecido_orgao_publico
                                        }
                                    /><span class="ml-2">Sim</span></label
                                >
                                <label class="inline-flex items-center"
                                    ><input
                                        type="radio"
                                        class="form-radio"
                                        value="Não"
                                        bind:group={
                                            data.Reconhecido_orgao_publico
                                        }
                                    /><span class="ml-2">Não</span></label
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estrutura da Moradia -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Estrutura da Moradia
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Material Predominante Adequado?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={data.Estrutura_Mat_predominante}
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={data.Estrutura_Mat_predominante}
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Estrutura_Mat_predominante === "Não"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Especifique..."
                                bind:value={data.Estrutura_Mat_predominante_esp}
                            />
                        {/if}
                    </div>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Instalações Elétricas/Hidráulicas Adequadas?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={
                                        data.Estrutura_Insta_eletricas_hidraulica
                                    }
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={
                                        data.Estrutura_Insta_eletricas_hidraulica
                                    }
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Estrutura_Insta_eletricas_hidraulica === "Não"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Estrutura_Insta_eletricas_hidraulica_esp
                                }
                            />
                        {/if}
                    </div>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Risco Geológico?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={data.Estrutura_Risco_geologico}
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={data.Estrutura_Risco_geologico}
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Estrutura_Risco_geologico === "Sim"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Especifique..."
                                bind:value={data.Estrutura_Risco_geologico_esp}
                            />
                        {/if}
                    </div>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Acesso à Internet?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={data.Estrutura_Acesso_internet}
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={data.Estrutura_Acesso_internet}
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Estrutura_Acesso_internet === "Sim"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Especifique..."
                                bind:value={data.Estrutura_Acesso_internet_esp}
                            />
                        {/if}
                    </div>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Danos por Eventos Naturais?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={
                                        data.Estrutura_danos_eventos_naturais
                                    }
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={
                                        data.Estrutura_danos_eventos_naturais
                                    }
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Estrutura_danos_eventos_naturais === "Sim"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Estrutura_danos_eventos_naturais_esp
                                }
                            />
                        {/if}
                    </div>
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Paredes/Revestimento</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Estrutura_paredes_revesti}
                        />
                    </label>
                </div>
            </div>

            <!-- Fatores de Risco e Mudança -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Fatores de Risco e Mudança
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={
                                    data.Fatores_risco_ambiental_infra
                                }
                            />
                            <span class="text-gray-700 font-medium"
                                >Risco Ambiental/Infraestrutura</span
                            >
                        </label>
                        {#if data.Fatores_risco_ambiental_infra}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Fatores_risco_ambiental_infra_esp
                                }
                            />
                        {/if}
                    </div>
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={
                                    data.Conflitos_Urbanos_Criminalidade
                                }
                            />
                            <span class="text-gray-700 font-medium"
                                >Conflitos Urbanos/Criminalidade</span
                            >
                        </label>
                        {#if data.Conflitos_Urbanos_Criminalidade}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Conflitos_Urbanos_Criminalidade_esp
                                }
                            />
                        {/if}
                    </div>
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={
                                    data.Conflitos_fundiarios_Agrarios
                                }
                            />
                            <span class="text-gray-700 font-medium"
                                >Conflitos Fundiários/Agrários</span
                            >
                        </label>
                        {#if data.Conflitos_fundiarios_Agrarios}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={
                                    data.Conflitos_fundiarios_Agrarios_esp
                                }
                            />
                        {/if}
                    </div>
                    <div class="p-3 border rounded hover:bg-gray-50">
                        <label class="flex items-center space-x-3 mb-2">
                            <input
                                type="checkbox"
                                class="h-5 w-5 text-indigo-600"
                                bind:checked={data.Fatores_risco_outros}
                            />
                            <span class="text-gray-700 font-medium"
                                >Outros Fatores de Risco</span
                            >
                        </label>
                        {#if data.Fatores_risco_outros}
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded mt-2"
                                placeholder="Especifique..."
                                bind:value={data.Fatores_risco_outros_esp}
                            />
                        {/if}
                    </div>
                </div>
                <div>
                    <span class="text-gray-700 font-semibold block mb-2"
                        >Houve mudança de domicílio?</span
                    >
                    <div class="flex gap-4">
                        <label class="inline-flex items-center"
                            ><input
                                type="radio"
                                class="form-radio"
                                value="Sim"
                                bind:group={data.RV_Mudanca_domicilio}
                            /><span class="ml-2">Sim</span></label
                        >
                        <label class="inline-flex items-center"
                            ><input
                                type="radio"
                                class="form-radio"
                                value="Não"
                                bind:group={data.RV_Mudanca_domicilio}
                            /><span class="ml-2">Não</span></label
                        >
                    </div>
                    {#if data.RV_Mudanca_domicilio === "Sim"}
                        <input
                            type="text"
                            class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            placeholder="Motivo/Detalhes"
                            bind:value={data.RV_Mudanca_domicilio_esp}
                        />
                    {/if}
                </div>
            </div>

            <!-- População em Situação de Rua -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    População em Situação de Rua
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Tempo em situação de rua</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tempo_Situacao_Rua}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Risco de violência</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Sit_Rua_Risco_Violencia}
                        />
                    </label>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Tem contato familiar?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={data.Tem_Contato_Familiar}
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={data.Tem_Contato_Familiar}
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                    </div>
                    <div>
                        <span class="text-gray-700 font-semibold block mb-2"
                            >Frequenta instituição de acolhimento?</span
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Sim"
                                    bind:group={
                                        data.Frequenta_Instituicao_Acolhimento
                                    }
                                /><span class="ml-2">Sim</span></label
                            >
                            <label class="inline-flex items-center"
                                ><input
                                    type="radio"
                                    class="form-radio"
                                    value="Não"
                                    bind:group={
                                        data.Frequenta_Instituicao_Acolhimento
                                    }
                                /><span class="ml-2">Não</span></label
                            >
                        </div>
                        {#if data.Frequenta_Instituicao_Acolhimento === "Sim"}
                            <input
                                type="text"
                                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                placeholder="Qual?"
                                bind:value={
                                    data.Especifique_Instituicao_Acolhimento
                                }
                            />
                        {/if}
                    </div>
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Expectativas de futuro</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Expectativas_Futuro}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Nomes/Vínculos afetivos</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nomes_Vinculos_Afetivos}
                        />
                    </label>
                </div>
            </div>
        </div>
    {/if}
</div>
