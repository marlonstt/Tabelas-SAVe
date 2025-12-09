<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;
    export let isArchived: boolean = false;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus: string = "";

    // Auxiliary data
    let ameacadores: any[] = [];
    let adolescentes: any[] = [];

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
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
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";
        const currentData = JSON.stringify({ data, ameacadores, adolescentes });
        try {
            await api.put(`/cases/${caseId}/protecao-seguranca`, {
                protecaoSeguranca: data,
                ameacadores: ameacadores,
                adolescentes: adolescentes,
            });
            console.log("Manual save ProtecaoSeguranca...", data);
            lastSavedData = currentData;
            saveStatus = "Salvo com sucesso! ✅";
            setTimeout(() => (saveStatus = ""), 3000);
        } catch (err) {
            console.error("Error manual saving", err);
            saveStatus = "Erro ao salvar ❌";
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
                saveStatus = "Salvo! ✅";
                setTimeout(() => (saveStatus = ""), 2000);
            } catch (err) {
                console.error("Error autosaving", err);
                saveStatus = "Erro ao salvar ❌";
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
        autosave();
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
<div class="bg-white rounded shadow p-10 relative">
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
        class:opacity-0={saving || loading || !saveStatus}
        class:opacity-100={!saving && !loading && saveStatus}
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
            {saveStatus}
        </span>
    </div>
    <!--<div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Proteção e Segurança</h2>
    </div>-->

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
                        <!-- Natureza da Ameaça -->
                        <label class="block">
                            <span class="text-gray-700">Natureza da Ameaça</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Natureza_Ameaca}
                                on:change={() => {
                                    if (data.PS_Natureza_Ameaca !== "Outras") {
                                        data.PS_Natureza_Ameaca_Especif = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Ameaça à vida"
                                    >Ameaça à vida</option
                                >
                                <option value="Ameaça psicológica"
                                    >Ameaça psicológica</option
                                >
                                <option
                                    value="Ameaça de violência financeira/patrimonial"
                                    >Ameaça de violência financeira/patrimonial</option
                                >
                                <option value="Ameaça à privacidade"
                                    >Ameaça à privacidade</option
                                >
                                <option value="Ameaça virtual"
                                    >Ameaça virtual</option
                                >
                                <option value="Ameaça política"
                                    >Ameaça política</option
                                >
                                <option value="Assédio moral e sexual"
                                    >Assédio moral e sexual</option
                                >
                                <option value="Outras">Outras</option>
                            </select>
                        </label>

                        <!-- Especifique a natureza da ameaça -->
                        {#if data.PS_Natureza_Ameaca === "Outras"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique a natureza da ameaça</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Natureza_Ameaca_Especif}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Como se deu a ameaça -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Como se deu a ameaça?</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Como_Ameaca}
                                on:input={autosave}
                            />
                        </label>

                        <!-- Há quanto tempo está sendo ameaçada? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Há quanto tempo está sendo ameaçada?</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Tempo_Ameaca}
                                on:input={autosave}
                            />
                        </label>

                        <!-- A pessoa que ameaça é o autor da vitimização primária? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >A pessoa que ameaça é o autor da vitimização
                                primária?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="autor_vitim"
                                        value="Sim"
                                        bind:group={data.PS_Ameaca_Autor_Vitim}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="autor_vitim"
                                        value="Não"
                                        bind:group={data.PS_Ameaca_Autor_Vitim}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameaca_Autor_Vitim = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- Se por terceiro, conhece o ameaçador? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Se por terceiro, conhece o ameaçador?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="conhece"
                                        value="Sim"
                                        bind:group={data.PS_Ameaca_Conhece}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="conhece"
                                        value="Não"
                                        bind:group={data.PS_Ameaca_Conhece}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameaca_Conhece = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- A ameaça é realizada por mais de um autor? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >A ameaça é realizada por mais de um autor?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="mais_autor"
                                        value="Sim"
                                        bind:group={data.PS_Ameaca_Mais_Autor}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.PS_Ameaca_Mais_Autor}
                                        on:change={() => {
                                            ameacadores = [];
                                            autosave();
                                        }}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameaca_Mais_Autor = "";
                                        ameacadores = [];
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- Incluir nome dos ameaçadores -->
                        {#if data.PS_Ameaca_Mais_Autor === "Sim"}
                            <div class="col-span-2">
                                <button
                                    class="bg-save-primary text-white px-3 py-1 rounded"
                                    on:click={() => {
                                        ameacadores = [
                                            ...ameacadores,
                                            {
                                                ID: Date.now(),
                                                PSA_Nome_Ameacadores: "",
                                            },
                                        ];
                                    }}>Incluir nome</button
                                >
                            </div>
                            <label class="block col-span-2">
                                <span class="text-gray-700"
                                    >Informe o nome dos ameaçadores:</span
                                >
                                <div class="mt-2">
                                    {#each ameacadores as ameacador (ameacador.ID)}
                                        <div
                                            class="flex items-center space-x-2 mb-2"
                                        >
                                            <input
                                                type="text"
                                                class="flex-1 rounded-md border-gray-300 focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    ameacador.PSA_Nome_Ameacadores
                                                }
                                                on:input={autosave}
                                            />
                                            <button
                                                class="text-red-600"
                                                on:click={() => {
                                                    ameacadores =
                                                        ameacadores.filter(
                                                            (a) =>
                                                                a.ID !==
                                                                ameacador.ID,
                                                        );
                                                }}>x</button
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Relação Vítima-agressor -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Relação Vítima-agressor
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Qual o tipo de relação a vítima possui com o ameaçador? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Qual o tipo de relação a vítima possui com o
                                ameaçador?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Tipo_Relacao}
                                on:change={() => {
                                    if (data.PS_Tipo_Relacao !== "Outro") {
                                        data.PS_Tipo_Relacao_Especif = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Desconhecido/a"
                                    >Desconhecido/a</option
                                >
                                <option value="Marido/companheiro/parceiro/a"
                                    >Marido/companheiro/parceiro/a</option
                                >
                                <option
                                    value="Ex-marido/ ex-companheiro/ ex-parceiro/a"
                                    >Ex-marido/ ex-companheiro/ ex-parceiro/a</option
                                >
                                <option value="Namorado/a">Namorado/a</option>
                                <option value="Ex-namorado/a"
                                    >Ex-namorado/a</option
                                >
                                <option value="Colega de trabalho"
                                    >Colega de trabalho</option
                                >
                                <option value="Vizinho/a">Vizinho/a</option>
                                <option value="Conhecido/a">Conhecido/a</option>
                                <option value="Pai/ mãe">Pai/ mãe</option>
                                <option value="Irmão/a">Irmão/a</option>
                                <option value="Tios/as">Tios/as</option>
                                <option value="Sobrinho/a">Sobrinho/a</option>
                                <option value="Primos/as">Primos/as</option>
                                <option value="Avô/ ó">Avô/ ó</option>
                                <option value="Neto/a">Neto/a</option>
                                <option value="Cunhado/a">Cunhado/a</option>
                                <option value="Curador/a">Curador/a</option>
                                <option value="Tutor/a">Tutor/a</option>
                                <option value="Amigo/a">Amigo/a</option>
                                <option
                                    value="Empregador/ chefe/superior hierárquico"
                                    >Empregador/ chefe/superior hierárquico</option
                                >
                                <option value="Outro">Outro</option>
                            </select>
                        </label>

                        <!-- Especifique o tipo de relação -->
                        {#if data.PS_Tipo_Relacao === "Outro"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique o tipo de relação que a vítima
                                    possui com o ameaçador:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Tipo_Relacao_Especif}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Reside com o autor da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Reside com o autor da ameaça?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="reside_autor"
                                        value="Sim"
                                        bind:group={data.PS_Reside_Com_Autor}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="reside_autor"
                                        value="Não"
                                        bind:group={data.PS_Reside_Com_Autor}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Reside_Com_Autor = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- O ameaçador possui alguma relação de poder em relação à vítima? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >O ameaçador possui alguma relação de poder em
                                relação à vítima?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="relacao_poder"
                                        value="Sim"
                                        bind:group={data.PS_Relacao_Poder}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.PS_Relacao_Poder}
                                        on:change={() => {
                                            data.PS_Relacao_Poder_Especif = "";
                                            autosave();
                                        }}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Relacao_Poder = "";
                                        data.PS_Relacao_Poder_Especif = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- Especifique a relação de poder -->
                        {#if data.PS_Relacao_Poder === "Sim"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique a relação de poder que o
                                    ameaçador tinha sobre a vítima:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Relacao_Poder_Especif}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Ocorreram ameaças anteriores? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Ocorreram ameaças anteriores?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="ameacas_anteriores"
                                        value="Sim"
                                        bind:group={data.PS_Ameacas_Anteriores}
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.PS_Ameacas_Anteriores}
                                        on:change={() => {
                                            data.PS_Ameacas_Anteriores_Especif =
                                                "";
                                            autosave();
                                        }}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameacas_Anteriores = "";
                                        data.PS_Ameacas_Anteriores_Especif = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- Especifique como ocorreram as ameaças anteriores -->
                        {#if data.PS_Ameacas_Anteriores === "Sim"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique como ocorreram as ameaças
                                    anteriores:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Ameacas_Anteriores_Especif
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Abrangência da Ameaça -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Abrangência da Ameaça
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- A ameaça é realizada por agente público? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >A ameaça é realizada por agente público?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Ameaca_Agente_Publico}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não sabe">Não sabe</option>
                            </select>
                        </label>

                        <!-- O ameaçador pertence à qual instituição? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >O ameaçador pertence à qual instituição?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Ameaca_Agente_Instituicao}
                                on:change={() => {
                                    if (
                                        data.PS_Ameaca_Agente_Instituicao !==
                                        "Outro"
                                    ) {
                                        data.PS_Ameaca_Agente_Instituicao_Especif =
                                            "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Não sabe">Não sabe</option>
                                <option value="Governo">Governo</option>
                                <option value="Polícias">Polícias</option>
                                <option value="Exército">Exército</option>
                                <option value="Instituição religiosa"
                                    >Instituição religiosa</option
                                >
                                <option value="Mídia">Mídia</option>
                                <option value="Organização criminosa armada"
                                    >Organização criminosa armada</option
                                >
                                <option value="Outro">Outro</option>
                            </select>
                        </label>

                        <!-- Especifique qual instituição o ameaçador pertence -->
                        {#if data.PS_Ameaca_Agente_Instituicao === "Outro"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique qual instituição o ameaçador
                                    pertence:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Ameaca_Agente_Instituicao_Especif
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- A ameaça é realizada por agente do crime organizado ou organização criminosa? -->
                        <!-- A ameaça é realizada por agente do crime organizado ou organização criminosa? -->
                        <div class="block">
                            <span class="text-gray-700 font-semibold"
                                >A ameaça é realizada por agente do crime
                                organizado ou organização criminosa?</span
                            >
                            <div class="mt-2 flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={
                                            data.PS_Ameaca_Org_Criminosa
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={
                                            data.PS_Ameaca_Org_Criminosa
                                        }
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameaca_Org_Criminosa = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>

                        <!-- Descreva extensão a familiares -->
                        {#if data.PS_Ameaca_Extensao_Familia === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Extensao_Familia_Descr}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- A ameaça se estende à criança e adolescente? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >A ameaça se estende à criança e adolescente?</span
                            >
                            <div class="flex space-x-4 mt-1">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.PS_Ameaca_Crianca_Adolescente
                                        }
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.PS_Ameaca_Crianca_Adolescente
                                        }
                                        on:change={() => {
                                            adolescentes = [];
                                            autosave();
                                        }}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Ameaca_Crianca_Adolescente = "";
                                        adolescentes = [];
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </label>

                        <!-- Incluir pessoa (Criança/Adolescente) -->
                        {#if data.PS_Ameaca_Crianca_Adolescente === "Sim"}
                            <div class="col-span-2">
                                <button
                                    class="bg-save-primary text-white px-3 py-1 rounded"
                                    on:click={() => {
                                        adolescentes = [
                                            ...adolescentes,
                                            {
                                                ID: Date.now(),
                                                PS_ADOLESCENTE_Nome: "",
                                                PS_ADOLESCENTE_Idade: "",
                                            },
                                        ];
                                    }}>Incluir pessoa</button
                                >
                            </div>
                            <label class="block col-span-2">
                                <span class="text-gray-700"
                                    >Crianças e Adolescentes ameaçados:</span
                                >
                                <div class="mt-2 space-y-2">
                                    {#each adolescentes as adolescente (adolescente.ID)}
                                        <div
                                            class="flex items-center space-x-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                class="flex-1 rounded-md border-gray-300 focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    adolescente.PS_ADOLESCENTE_Nome
                                                }
                                                on:input={autosave}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Idade"
                                                class="w-20 rounded-md border-gray-300 focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    adolescente.PS_ADOLESCENTE_Idade
                                                }
                                                on:input={autosave}
                                            />
                                            <button
                                                class="text-red-600 font-bold"
                                                on:click={() => {
                                                    adolescentes =
                                                        adolescentes.filter(
                                                            (a) =>
                                                                a.ID !==
                                                                adolescente.ID,
                                                        );
                                                }}>x</button
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Impactos da Ameaça -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Impactos da Ameaça
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Teve a liberdade limitada em razão da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Teve a liberdade limitada em razão da ameaça?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Liberdade_Limitada}
                                on:change={() => {
                                    if (data.PS_Liberdade_Limitada !== "Sim") {
                                        data.PS_Liberdade_Limitada_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não sabe">Não sabe</option>
                            </select>
                        </label>

                        <!-- Descreva liberdade limitada -->
                        {#if data.PS_Liberdade_Limitada === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Liberdade_Limitada_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Teve impactos emocionais e psicologicos em razão da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Teve impactos emocionais e psicologicos em
                                razão da ameaça?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Impactos_Emocionais_Psic}
                                on:change={() => {
                                    if (
                                        data.PS_Impactos_Emocionais_Psic !==
                                        "Sim"
                                    ) {
                                        data.PS_Impactos_Emocionais_Psic_Descr =
                                            "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não sabe">Não sabe</option>
                            </select>
                        </label>

                        <!-- Descreva impactos emocionais -->
                        {#if data.PS_Impactos_Emocionais_Psic === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Impactos_Emocionais_Psic_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Teve impactos financeiros em razão da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Teve impactos financeiros em razão da ameaça?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Impactos_Financeiros}
                                on:change={() => {
                                    if (
                                        data.PS_Impactos_Financeiros !== "Sim"
                                    ) {
                                        data.PS_Impactos_Financeiros_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não sabe">Não sabe</option>
                            </select>
                        </label>

                        <!-- Descreva impactos financeiros -->
                        {#if data.PS_Impactos_Financeiros === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Impactos_Financeiros_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Não se sente segura e precisou se mudar de território ou pensa em se mudar em razão da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Não se sente segura e precisou se mudar de
                                território ou pensa em se mudar em razão da
                                ameaça?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Nao_Sente_Segura_Mudar}
                                on:change={() => {
                                    if (
                                        data.PS_Nao_Sente_Segura_Mudar !== "Sim"
                                    ) {
                                        data.PS_Nao_Sente_Segura_Mudar_Descr =
                                            "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não sabe">Não sabe</option>
                            </select>
                        </label>

                        <!-- Descreva precisou mudar -->
                        {#if data.PS_Nao_Sente_Segura_Mudar === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Nao_Sente_Segura_Mudar_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Medidas de Proteção e Segurança - Recursos para autoproteção -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Medidas de Proteção e Segurança - Recursos para
                        autoproteção
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Possui rede de apoio familiar? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Possui rede de apoio familiar?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Possui_Rede_Apoio_Fam}
                                on:change={() => {
                                    if (
                                        data.PS_Possui_Rede_Apoio_Fam !== "Sim"
                                    ) {
                                        data.PS_Rede_Apoio_Fam_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Descreva rede de apoio familiar -->
                        {#if data.PS_Possui_Rede_Apoio_Fam === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Rede_Apoio_Fam_Descr}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Possui rede comunitária de proteção? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Possui rede comunitária de proteção?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Possui_Rede_Comunitaria}
                                on:change={() => {
                                    if (
                                        data.PS_Possui_Rede_Comunitaria !==
                                        "Sim"
                                    ) {
                                        data.PS_Rede_Comunitaria_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Descreva rede comunitária -->
                        {#if data.PS_Possui_Rede_Comunitaria === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Rede_Comunitaria_Descr}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Possui equipamentos de segurança? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Possui equipamentos de segurança?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Possui_Equip_Seguranca}
                                on:change={() => {
                                    if (
                                        data.PS_Possui_Equip_Seguranca !== "Sim"
                                    ) {
                                        data.PS_Equip_Seguranca_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Descreva equipamentos de segurança -->
                        {#if data.PS_Possui_Equip_Seguranca === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.PS_Equip_Seguranca_Descr}
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- É possível deslocamento para local seguro e longe da ameaça? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >É possível deslocamento para local seguro e
                                longe da ameaça?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={
                                    data.PS_Possivel_Deslocamento_Seguro
                                }
                                on:change={() => {
                                    if (
                                        data.PS_Possivel_Deslocamento_Seguro !==
                                        "Sim"
                                    ) {
                                        data.PS_Deslocamento_Seguro_Descr = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Descreva deslocamento seguro -->
                        {#if data.PS_Possivel_Deslocamento_Seguro === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Deslocamento_Seguro_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Sistema de Proteção -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Sistema de Proteção
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Necessário acionar Serviços de Proteção Social? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Necessário acionar Serviços de Proteção Social?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Servicos_Prot_Social}
                                on:change={() => {
                                    if (
                                        data.PS_Servicos_Prot_Social !== "Sim"
                                    ) {
                                        data.PS_Servicos_Prot_Social_Especif =
                                            "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Especifique qual serviço de proteção social -->
                        {#if data.PS_Servicos_Prot_Social === "Sim"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique qual serviço de proteção
                                    social:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Servicos_Prot_Social_Especif
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Necessário acionar os Serviços de Acolhimento emergencial? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Necessário acionar os Serviços de Acolhimento
                                emergencial?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Servicos_Acolhimento_Emerg}
                                on:change={() => {
                                    if (
                                        data.PS_Servicos_Acolhimento_Emerg !==
                                        "Sim"
                                    ) {
                                        data.PS_Servicos_Acolhimento_Especif =
                                            "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Especifique o serviço de acolhimento -->
                        {#if data.PS_Servicos_Acolhimento_Emerg === "Sim"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique o serviço de acolhimento:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Servicos_Acolhimento_Especif
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- Necessário acionar os Programas de Proteção? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Necessário acionar os Programas de Proteção?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Programas_Protecao}
                                on:change={() => {
                                    if (data.PS_Programas_Protecao !== "Sim") {
                                        data.PS_Programas_Protecao_Especif = "";
                                    }
                                    autosave();
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Especifique o programa -->
                        {#if data.PS_Programas_Protecao === "Sim"}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Especifique o programa:</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Programas_Protecao_Especif
                                    }
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="PROVITA">PROVITA</option>
                                    <option value="PPCAAM">PPCAAM</option>
                                    <option value="PPDDH">PPDDH</option>
                                </select>
                            </label>
                        {/if}

                        <!-- A vítima é capaz de exprimir a vontade... -->
                        <div class="col-span-1 md:col-span-2 space-y-2">
                            <label class="block">
                                <span class="text-gray-700"
                                    >A vítima é capaz de exprimir a vontade de
                                    ingressar nos Programas de Proteção, de
                                    forma livre e autônoma ou possui
                                    representante legal capaz de fazê-lo?</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Vitima_Capaz_Ingressar_Prog
                                    }
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </label>
                            <div
                                class="text-red-600 font-bold text-center border border-red-600 p-2 rounded"
                            >
                                ALERTA: Verificar voluntariedade e adequação aos
                                critérios dos Programas de Proteção
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Providências já realizadas -->
                <div class="border p-4 rounded bg-gray-50 space-y-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Providências já realizadas
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Alguma providência já foi realizada? -->
                        <label class="block">
                            <span class="text-gray-700"
                                >Alguma providência já foi realizada?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.PS_Providencia_Realizada}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>

                        <!-- Descreva providência realizada -->
                        {#if data.PS_Providencia_Realizada === "Sim"}
                            <label class="block">
                                <span class="text-gray-700">Descreva:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.PS_Providencia_Realizada_Descr
                                    }
                                    on:input={autosave}
                                />
                            </label>
                        {/if}

                        <!-- É vítima de violência doméstica? -->
                        <div class="block">
                            <span class="text-gray-700 block mb-2"
                                >É vítima de violência doméstica?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Vitima_Violencia_Domestica
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Vitima_Violencia_Domestica
                                        }
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Vitima_Violencia_Domestica = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>

                        <!-- É vítima de Crime de ódio? -->
                        <div class="block">
                            <span class="text-gray-700 block mb-2"
                                >É vítima de Crime de ódio?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={data.PS_Vitima_Crime_Odio}
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={data.PS_Vitima_Crime_Odio}
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Vitima_Crime_Odio = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>

                        <!-- A rede aplicou o protocolo Frida/Fonar? -->
                        <div class="block">
                            <span class="text-gray-700 block mb-2"
                                >A rede aplicou o protocolo Frida/Fonar?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Rede_Aplicou_Protocolo_FF
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Rede_Aplicou_Protocolo_FF
                                        }
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Rede_Aplicou_Protocolo_FF = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>

                        <!-- A rede aplicou o protocolo Rogéria? -->
                        <div class="block">
                            <span class="text-gray-700 block mb-2"
                                >A rede aplicou o protocolo Rogéria?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Rede_Aplicou_Protocolo_Roger
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Rede_Aplicou_Protocolo_Roger
                                        }
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Rede_Aplicou_Protocolo_Roger =
                                            "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>

                        <!-- Deseja aplicar o Formulário Nacional de Avaliação de Risco (FONAR) -->
                        <div class="block col-span-1 md:col-span-2">
                            <span class="text-gray-700 block mb-2"
                                >Deseja aplicar o Formulário Nacional de
                                Avaliação de Risco (FONAR)?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Deseja_Aplicar_FONAR
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary focus:ring-save-primary/30"
                                        bind:group={
                                            data.PS_Deseja_Aplicar_FONAR
                                        }
                                        value="Não"
                                        on:change={autosave}
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.PS_Deseja_Aplicar_FONAR = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
        <!-- Manual Save Button -->
        <!-- Manual Save Button -->
        <div class="md:col-span-2 flex justify-end mt-4">
            <div class="flex flex-col items-center">
                <button
                    class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                    on:click={manualSave}
                    disabled={saving || loading}
                >
                    {saving ? "Salvando..." : "Salvar Dados"}
                </button>
                {#if saveStatus.includes("Salvo")}
                    <span class="text-green-600 font-medium mt-2 text-sm"
                        >Salvo com sucesso!</span
                    >
                {/if}
            </div>
        </div>
    {/if}
</div>
