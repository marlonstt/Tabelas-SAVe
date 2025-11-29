<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    // Auxiliary data
    let ameacadores: any[] = [];
    let adolescentes: any[] = [];

    onMount(async () => {
        try {
            const response = await api.get(
                `/cases/${caseId}/protecao-seguranca`,
            );
            data = response.data.protecaoSeguranca || {};
            ameacadores = response.data.ameacadores || [];
            adolescentes = response.data.adolescentes || [];

            // Initialize Master Switch if null (optional, depending on requirements)
            // if (data.PS_Situacao_ameaca_relat === undefined) data.PS_Situacao_ameaca_relat = "Não";
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            loading = false;
            lastSavedData = JSON.stringify({ data, ameacadores, adolescentes });
        }
    });

    async function manualSave() {
        saving = true;
        const currentData = JSON.stringify({ data, ameacadores, adolescentes });
        try {
            await api.put(`/cases/${caseId}/protecao-seguranca`, {
                protecaoSeguranca: data,
                ameacadores: ameacadores,
                adolescentes: adolescentes,
            });
            console.log("Manual save ProtecaoSeguranca...", data);
            lastSavedData = currentData;
            // Show success message briefly (optional, since button handles loading state)
        } catch (err) {
            console.error("Error manual saving", err);
            alert("Erro ao salvar dados!");
        } finally {
            saving = false;
        }
    }

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify({ data, ameacadores, adolescentes });
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                await api.put(`/cases/${caseId}/protecao-seguranca`, {
                    protecaoSeguranca: data,
                    ameacadores: ameacadores,
                    adolescentes: adolescentes,
                });
                console.log("Autosaving ProtecaoSeguranca...", data);
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 2000);
    }

    function handleMasterSwitch(value: string) {
        data.PS_Situacao_ameaca_relat = value;
        if (value === "Não") {
            clearFields();
        }
    }

    function clearFields() {
        const fieldsToClear = [
            "PS_Natureza_Ameaca",
            "PS_Natureza_Ameaca_Especif",
            "PS_Como_Ameaca",
            "PS_Tempo_Ameaca",
            "PS_Ameaca_Autor_Vitim",
            "PS_Ameaca_Conhece",
            "PS_Ameaca_Mais_Autor",
            "PS_Tipo_Relacao",
            "PS_Tipo_Relacao_Especif",
            "PS_Reside_Com_Autor",
            "PS_Relacao_Poder",
            "PS_Relacao_Poder_Especif",
            "PS_Ameacas_Anteriores",
            "PS_Ameacas_Anteriores_Especif",
            "PS_Ameaca_Agente_Publico",
            "PS_Ameaca_Agente_Instituicao",
            "PS_Ameaca_Agente_Instituicao_Especif",
            "PS_Ameaca_Org_Criminosa",
            "PS_Ameaca_Org_Criminosa_Especif",
            "PS_Regiao_Abrangencia_Ameaca",
            "PS_Ameaca_Meios_Concretizar",
            "PS_Ameaca_Meios_Concretizar_Especif",
            "PS_Liberdade_Limitada",
            "PS_Liberdade_Limitada_Descr",
            "PS_Impactos_Emocionais_Psic",
            "PS_Impactos_Emocionais_Psic_Descr",
            "PS_Impactos_Financeiros",
            "PS_Impactos_Financeiros_Descr",
            "PS_Nao_Sente_Segura_Mudar",
            "PS_Nao_Sente_Segura_Mudar_Descr",
            "PS_Possui_Rede_Apoio_Fam",
            "PS_Rede_Apoio_Fam_Descr",
            "PS_Possui_Rede_Comunitaria",
            "PS_Rede_Comunitaria_Descr",
            "PS_Possui_Equip_Seguranca",
            "PS_Equip_Seguranca_Descr",
            "PS_Possivel_Deslocamento_Seguro",
            "PS_Deslocamento_Seguro_Descr",
            "PS_Servicos_Prot_Social",
            "PS_Servicos_Prot_Social_Especif",
            "PS_Servicos_Acolhimento_Emerg",
            "PS_Servicos_Acolhimento_Especif",
            "PS_Programas_Protecao",
            "PS_Programas_Protecao_Especif",
            "PS_Vitima_Capaz_Ingressar_Prog",
            "PS_Providencia_Realizada",
            "PS_Providencia_Realizada_Descr",
            "PS_Vitima_Violencia_Domestica",
            "PS_Vitima_Crime_Odio",
            "PS_Rede_Aplicou_Protocolo_FF",
            "PS_Rede_Aplicou_Protocolo_Roger",
            "PS_Deseja_Aplicar_FONAR",
            "PS_Violencia_Pos_Ameaca",
            "PS_Violencia_Pos_Ameaca_Descr",
            "PS_Ameaca_Repercussoes_Soc",
            "PS_Repercussoes_Soc_Descr",
            "PS_Sendo_Perseguido",
            "PS_Perseguido_Descr",
            "PS_Autor_Acesso_Armas",
            "PS_Acesso_Armas_Descr",
            "PS_Ameaca_Extensao_Familia",
            "PS_Extensao_Familia_Descr",
            "PS_Ameaca_Crianca_Adolescente",
        ];

        fieldsToClear.forEach((field) => {
            data[field] = ""; // Or null, depending on backend preference. Go strings are usually ""
        });

        // Clear auxiliary lists
        ameacadores = [];
        adolescentes = [];
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

    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Proteção e Segurança</h2>
        <!-- Manual Save Button -->
        <div class="flex items-center space-x-4">
            <button
                class="bg-save-primary text-white px-4 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                on:click={manualSave}
                disabled={saving || loading}
            >
                {saving ? "Salvando..." : "Salvar"}
            </button>
        </div>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Master Switch -->
            <div class="border p-4 rounded bg-gray-50">
                <label class="block">
                    <span class="text-gray-700 font-medium"
                        >A vítima relata situação de ameaça?</span
                    >
                    <select
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.PS_Situacao_ameaca_relat}
                        on:change={(e) =>
                            handleMasterSwitch(e.currentTarget.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </label>
            </div>

            {#if data.PS_Situacao_ameaca_relat === "Sim"}
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Detalhamento da Ameaça
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Natureza da Ameaça</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Natureza_Ameaca}
                                on:input={autosave}
                            />
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                checked={data.PS_Autor_Acesso_Armas === "Sim"}
                                on:change={(e) =>
                                    (data.PS_Autor_Acesso_Armas = e
                                        .currentTarget.checked
                                        ? "Sim"
                                        : "Não")}
                            />
                            <span class="ml-2">Acesso a Armas</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                checked={data.PS_Sendo_Perseguido === "Sim"}
                                on:change={(e) =>
                                    (data.PS_Sendo_Perseguido = e.currentTarget
                                        .checked
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
                                bind:value={data.PS_Ameaca_Crianca_Adolescente}
                            >
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <label class="block">
                            <span class="text-gray-700"
                                >Violência Doméstica?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Vitima_Violencia_Domestica}
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
                                bind:value={data.PS_Impactos_Emocionais_Psic}
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
                            <span class="text-gray-700"
                                >Rede de Apoio Ativada</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Possui_Rede_Apoio_Fam}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700"
                                >Equipamentos de Segurança</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Possui_Equip_Seguranca}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700"
                                >Inserido em Programa de Proteção?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Programas_Protecao}
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
                                bind:value={data.PS_Rede_Aplicou_Protocolo_FF}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Avaliação de Risco</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Deseja_Aplicar_FONAR}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Plano de Segurança</span
                            >
                            <textarea
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                rows="2"
                                bind:value={data.PS_Providencia_Realizada}
                            ></textarea>
                        </label>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
