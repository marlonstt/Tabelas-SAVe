<script>
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let id;

    let data = {
        HS_Pessoa_deficiencia: "",
        HS_Pessoa_deficiencia_tipo: "",
        HS_Condicao_saude: "",
        HS_Condicao_saude_acompanhamento: "",
        HS_Condicao_saude_tipo: "",
        HS_Cond_saude_nao_perma: "",
        HS_Cond_saude_nao_perma_acomp: "",
        HS_Cond_saude_nao_perma_desc: "",
        HS_Aux_saude: "",
        HS_Aux_saude_acomp: "",
        HS_Aux_saude_desc: "",
        HS_Vitim_sexual: "",
        HS_Vitim_sexual_acomp: "",
        HS_Vitim_sexual_desc: "",
        HS_Medic_continua: "",
        HS_Medic_continua_desc: "",
        HS_Medic_psiq: "",
        HS_Medic_psiq_desc: "",
        FR_Alcool: "",
        FR_Alcool_freq: "",
        FR_Cigarro: "",
        FR_Cigarro_freq: "",
        FR_Subst_psicoativas: "",
        FR_Subst_psicoativas_freq: "",
        FR_Apoio: "",
        FR_Apoio_desc: "",
        RS_Acomp_publica: "",
        RS_Acomp_publica_tipo: "",
        RS_Acomp_RAPS: "",
        RS_Acomp_RAPS_centro: "",
        RS_Acomp_RAPS_especif: "",
        RS_Plano_saude: "",
        RS_Plano_saude_especif: "",
        RS_Contato_nome: "",
        RS_Contato_telefone: "",
        RS_Contato_email: "",
        IV_Impacto_Saude_Mental_tipos: "",
        IV_ISTOutros_esp: "",
    };

    const mentalHealthOptions = [
        {
            value: "NRSFisicaHigieneSaude",
            label: "Negligência em relação à saúde fisica, higiene e saúde",
        },
        {
            value: "NRSaudeMental",
            label: "Negligência em relação à saúde mental",
        },
        {
            value: "NRSaudeAlimentar",
            label: "Negligência em relação à saúde alimentar",
        },
        {
            value: "DQUNAlcoolDrogas",
            label: "Dependência química ou uso nocivo de álcool e outras drogas",
        },
        { value: "UsoMedicacaoPsiq", label: "Uso de medicação psiquiátrica" },
        {
            value: "FORLOPConscienciaReduzido",
            label: "Funções mentais de orientação, raciocínio lógico, organização do pensamento, consciência reduzidos",
        },
        {
            value: "DAgravoSaudeMental",
            label: "Diagnóstico de agravo de saúde mental",
        },
        { value: "ISTOutros", label: "Outro" },
        {
            value: "AfastRedeApoioAmigos",
            label: "Afastamento da rede de apoio e amigos",
        },
        {
            value: "AfastRedeFamiliares",
            label: "Afastamento da rede de familiares",
        },
        {
            value: "ExaustFisicaEsgMental",
            label: "Exaustão física e esgotamento mental",
        },
        { value: "EsgotamentoMental", label: "Esgotamento mental" },
        {
            value: "NescTratPsicologico",
            label: "Necessidade de tratamento psicológico",
        },
        {
            value: "RiscoAutomutSuicidio",
            label: "Risco de Automutilação ou suicídio",
        },
        {
            value: "RiscoHetereogressividade",
            label: "Risco de Hetereogressividade",
        },
    ];

    let saving = false;
    let saveMessage = "";
    let saveTimeout;

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            const response = await api.get(`/cases/${id}`);
            if (response.saude) {
                data = { ...data, ...response.saude };
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    function autosave() {
        saving = true;
        saveMessage = "Salvando...";
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            try {
                await api.put(`/cases/${id}/saude`, { saude: data });
                saveMessage = "Salvo! ✅";
                setTimeout(() => (saveMessage = ""), 2000);
            } catch (error) {
                console.error("Error saving data:", error);
                saveMessage = "Erro ao salvar ❌";
            } finally {
                saving = false;
            }
        }, 1000);
    }
    function toggleMentalHealth(value) {
        let current = data.IV_Impacto_Saude_Mental_tipos
            ? data.IV_Impacto_Saude_Mental_tipos.split(";")
            : [];
        const index = current.indexOf(value);

        if (index > -1) {
            current.splice(index, 1);
            if (value === "ISTOutros") {
                data.IV_ISTOutros_esp = "";
            }
        } else {
            current.push(value);
        }

        data.IV_Impacto_Saude_Mental_tipos = current.join(";");
        autosave();
    }

    function handleRadioChange(field, value, clearFields = []) {
        data[field] = value;
        if (value === "Não") {
            clearFields.forEach((f) => (data[f] = ""));
        }
        autosave();
    }
</script>

<div class="space-y-6 p-6 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center border-b pb-4">
        <h2 class="text-2xl font-bold text-gray-800">Saúde</h2>
        <div class="text-sm font-medium">
            {#if saveMessage}
                <span
                    class={saveMessage.includes("Erro")
                        ? "text-red-500"
                        : "text-green-500"}
                >
                    {saveMessage}
                </span>
            {/if}
        </div>
    </div>

    <!-- Histórico de Saúde -->
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">Histórico de Saúde</h3>

        <!-- Pessoa com Deficiência -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Pessoa com deficiência?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Pessoa_deficiencia}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange(
                                    "HS_Pessoa_deficiencia",
                                    "Sim",
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Pessoa_deficiencia}
                            value="Não"
                            on:change={() =>
                                handleRadioChange(
                                    "HS_Pessoa_deficiencia",
                                    "Não",
                                    ["HS_Pessoa_deficiencia_tipo"],
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Pessoa_deficiencia === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <select
                        bind:value={data.HS_Pessoa_deficiencia_tipo}
                        on:change={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Deficiência física"
                            >Deficiência física</option
                        >
                        <option value="Deficiência auditiva"
                            >Deficiência auditiva</option
                        >
                        <option value="Deficiência visual"
                            >Deficiência visual</option
                        >
                        <option value="Deficiência intelectual"
                            >Deficiência intelectual</option
                        >
                        <option value="Deficiência mental"
                            >Deficiência mental</option
                        >
                        <option value="Deficiência múltipla"
                            >Deficiência múltipla</option
                        >
                    </select>
                </div>
            {/if}
        </div>

        <!-- Condição de Saúde Permanente -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Possui alguma condição de saúde permanente?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Condicao_saude}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("HS_Condicao_saude", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Condicao_saude}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("HS_Condicao_saude", "Não", [
                                    "HS_Condicao_saude_tipo",
                                    "HS_Condicao_saude_acompanhamento",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Condicao_saude === "Sim"}
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Qual?</label
                        >
                        <input
                            type="text"
                            bind:value={data.HS_Condicao_saude_tipo}
                            on:input={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Realiza acompanhamento?</label
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={
                                        data.HS_Condicao_saude_acompanhamento
                                    }
                                    value="Sim"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={
                                        data.HS_Condicao_saude_acompanhamento
                                    }
                                    value="Não"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Não</span>
                            </label>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Condição de Saúde Não Permanente -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Possui alguma condição de saúde não permanente?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Cond_saude_nao_perma}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange(
                                    "HS_Cond_saude_nao_perma",
                                    "Sim",
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Cond_saude_nao_perma}
                            value="Não"
                            on:change={() =>
                                handleRadioChange(
                                    "HS_Cond_saude_nao_perma",
                                    "Não",
                                    [
                                        "HS_Cond_saude_nao_perma_desc",
                                        "HS_Cond_saude_nao_perma_acomp",
                                    ],
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Cond_saude_nao_perma === "Sim"}
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Qual?</label
                        >
                        <input
                            type="text"
                            bind:value={data.HS_Cond_saude_nao_perma_desc}
                            on:input={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Realiza acompanhamento?</label
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={
                                        data.HS_Cond_saude_nao_perma_acomp
                                    }
                                    value="Sim"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={
                                        data.HS_Cond_saude_nao_perma_acomp
                                    }
                                    value="Não"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Não</span>
                            </label>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Auxílio Saúde -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Necessita de auxílio saúde?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Aux_saude}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("HS_Aux_saude", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Aux_saude}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("HS_Aux_saude", "Não", [
                                    "HS_Aux_saude_desc",
                                    "HS_Aux_saude_acomp",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Aux_saude === "Sim"}
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Qual?</label
                        >
                        <input
                            type="text"
                            bind:value={data.HS_Aux_saude_desc}
                            on:input={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Realiza acompanhamento?</label
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.HS_Aux_saude_acomp}
                                    value="Sim"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.HS_Aux_saude_acomp}
                                    value="Não"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Não</span>
                            </label>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Vítima Sexual -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Vítima de violência sexual?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Vitim_sexual}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("HS_Vitim_sexual", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Vitim_sexual}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("HS_Vitim_sexual", "Não", [
                                    "HS_Vitim_sexual_desc",
                                    "HS_Vitim_sexual_acomp",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Vitim_sexual === "Sim"}
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Descrição</label
                        >
                        <input
                            type="text"
                            bind:value={data.HS_Vitim_sexual_desc}
                            on:input={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Realiza acompanhamento?</label
                        >
                        <div class="flex gap-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.HS_Vitim_sexual_acomp}
                                    value="Sim"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.HS_Vitim_sexual_acomp}
                                    value="Não"
                                    on:change={autosave}
                                    class="form-radio text-blue-600"
                                />
                                <span class="ml-2">Não</span>
                            </label>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Medicamento Contínuo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Uso de medicamento contínuo?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Medic_continua}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("HS_Medic_continua", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Medic_continua}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("HS_Medic_continua", "Não", [
                                    "HS_Medic_continua_desc",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Medic_continua === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <input
                        type="text"
                        bind:value={data.HS_Medic_continua_desc}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>

        <!-- Medicamento Psiquiátrico -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Uso de medicamento psiquiátrico?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Medic_psiq}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("HS_Medic_psiq", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.HS_Medic_psiq}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("HS_Medic_psiq", "Não", [
                                    "HS_Medic_psiq_desc",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.HS_Medic_psiq === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <input
                        type="text"
                        bind:value={data.HS_Medic_psiq_desc}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>
    </div>

    <hr class="border-gray-200" />

    <!-- Fatores de Risco -->
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">Fatores de Risco</h3>

        <!-- Álcool -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Uso de álcool?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Alcool}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("FR_Alcool", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Alcool}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("FR_Alcool", "Não", [
                                    "FR_Alcool_freq",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.FR_Alcool === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Frequência</label
                    >
                    <input
                        type="text"
                        bind:value={data.FR_Alcool_freq}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>

        <!-- Cigarro -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Uso de cigarro?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Cigarro}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("FR_Cigarro", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Cigarro}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("FR_Cigarro", "Não", [
                                    "FR_Cigarro_freq",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.FR_Cigarro === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Frequência</label
                    >
                    <input
                        type="text"
                        bind:value={data.FR_Cigarro_freq}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>

        <!-- Substâncias Psicoativas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Uso de substâncias psicoativas?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Subst_psicoativas}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange(
                                    "FR_Subst_psicoativas",
                                    "Sim",
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Subst_psicoativas}
                            value="Não"
                            on:change={() =>
                                handleRadioChange(
                                    "FR_Subst_psicoativas",
                                    "Não",
                                    ["FR_Subst_psicoativas_freq"],
                                )}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.FR_Subst_psicoativas === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Frequência</label
                    >
                    <input
                        type="text"
                        bind:value={data.FR_Subst_psicoativas_freq}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>

        <!-- Apoio -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Necessita de apoio?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Apoio}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("FR_Apoio", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.FR_Apoio}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("FR_Apoio", "Não", [
                                    "FR_Apoio_desc",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.FR_Apoio === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <input
                        type="text"
                        bind:value={data.FR_Apoio_desc}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>
    </div>

    <hr class="border-gray-200" />

    <!-- Rede de Saúde -->
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">Rede de Saúde</h3>

        <!-- Acompanhamento Pública -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Acompanhamento na rede pública?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Acomp_publica}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("RS_Acomp_publica", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Acomp_publica}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("RS_Acomp_publica", "Não", [
                                    "RS_Acomp_publica_tipo",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.RS_Acomp_publica === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <select
                        bind:value={data.RS_Acomp_publica_tipo}
                        on:change={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Atenção Primária à Saúde (APS)"
                            >Atenção Primária à Saúde (APS)</option
                        >
                        <option value="Atenção Secundária/Especializada"
                            >Atenção Secundária/Especializada</option
                        >
                        <option value="Urgência/Emergência"
                            >Urgência/Emergência</option
                        >
                    </select>
                </div>
            {/if}
        </div>

        <!-- RAPS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Acompanhamento no RAPS?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Acomp_RAPS}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("RS_Acomp_RAPS", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Acomp_RAPS}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("RS_Acomp_RAPS", "Não", [
                                    "RS_Acomp_RAPS_centro",
                                    "RS_Acomp_RAPS_especif",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.RS_Acomp_RAPS === "Sim"}
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Centro</label
                        >
                        <select
                            bind:value={data.RS_Acomp_RAPS_centro}
                            on:change={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Selecione...</option>
                            <option value="UBS - NASF-AB">UBS - NASF-AB</option>
                            <option value="CAPS I">CAPS I</option>
                            <option value="CAPS II">CAPS II</option>
                            <option value="CAPS III">CAPS III</option>
                            <option value="CAPS AD">CAPS AD</option>
                            <option value="CAPS i">CAPS i</option>
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Especificação</label
                        >
                        <input
                            type="text"
                            bind:value={data.RS_Acomp_RAPS_especif}
                            on:input={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            {/if}
        </div>

        <!-- Plano de Saúde -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Possui plano de saúde?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Plano_saude}
                            value="Sim"
                            on:change={() =>
                                handleRadioChange("RS_Plano_saude", "Sim")}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.RS_Plano_saude}
                            value="Não"
                            on:change={() =>
                                handleRadioChange("RS_Plano_saude", "Não", [
                                    "RS_Plano_saude_especif",
                                ])}
                            class="form-radio text-blue-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.RS_Plano_saude === "Sim"}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Qual?</label
                    >
                    <input
                        type="text"
                        bind:value={data.RS_Plano_saude_especif}
                        on:input={autosave}
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>

        <!-- Contato -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nome do contato</label
            >
            <input
                type="text"
                bind:value={data.RS_Contato_nome}
                on:input={autosave}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
                >Telefone do contato</label
            >
            <input
                type="text"
                bind:value={data.RS_Contato_telefone}
                on:input={autosave}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email do contato</label
            >
            <input
                type="email"
                bind:value={data.RS_Contato_email}
                on:input={autosave}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
    </div>

    <hr class="border-gray-200" />

    <!-- Impacto na Saúde -->
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">Impacto na Saúde</h3>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
                >Houve impacto na saúde?</label
            >
            <div class="flex gap-4">
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={data.IV_Houve_Impacto_Saude}
                        value="Sim"
                        on:change={() =>
                            handleRadioChange("IV_Houve_Impacto_Saude", "Sim")}
                        class="form-radio text-blue-600"
                    />
                    <span class="ml-2">Sim</span>
                </label>
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={data.IV_Houve_Impacto_Saude}
                        value="Não"
                        on:change={() =>
                            handleRadioChange("IV_Houve_Impacto_Saude", "Não", [
                                "IV_Lesoes_Nao_Fatais",
                                "IV_Defic_vitimizacao",
                                "IV_Defic_vitimizacao_tipo",
                                "IV_Problemas_De_Saude",
                                "IV_Comp_Cogn_Comport",
                                "IV_Comp_Cogn_Comport_tipo",
                                "IV_Outro",
                                "IV_Outro_espec",
                            ])}
                        class="form-radio text-blue-600"
                    />
                    <span class="ml-2">Não</span>
                </label>
            </div>
        </div>

        {#if data.IV_Houve_Impacto_Saude === "Sim"}
            <div class="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
                <!-- Lesões não fatais -->
                <div>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            bind:checked={data.IV_Lesoes_Nao_Fatais}
                            on:change={() => {
                                if (!data.IV_Lesoes_Nao_Fatais) {
                                    data.IV_Defic_vitimizacao = "";
                                    data.IV_Defic_vitimizacao_tipo = "";
                                }
                                autosave();
                            }}
                            class="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span class="ml-2 text-sm text-gray-700"
                            >Lesões não fatais</span
                        >
                    </label>
                    {#if data.IV_Lesoes_Nao_Fatais}
                        <div class="mt-2 ml-6 space-y-2">
                            <label
                                class="block text-sm font-medium text-gray-700"
                                >Deficiência derivada da vitimização?</label
                            >
                            <div class="flex gap-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.IV_Defic_vitimizacao}
                                        value="Sim"
                                        on:change={() =>
                                            handleRadioChange(
                                                "IV_Defic_vitimizacao",
                                                "Sim",
                                            )}
                                        class="form-radio text-blue-600"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.IV_Defic_vitimizacao}
                                        value="Não"
                                        on:change={() =>
                                            handleRadioChange(
                                                "IV_Defic_vitimizacao",
                                                "Não",
                                                ["IV_Defic_vitimizacao_tipo"],
                                            )}
                                        class="form-radio text-blue-600"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                            {#if data.IV_Defic_vitimizacao === "Sim"}
                                <select
                                    bind:value={data.IV_Defic_vitimizacao_tipo}
                                    on:change={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Deficiência física"
                                        >Deficiência física</option
                                    >
                                    <option value="Deficiência auditiva"
                                        >Deficiência auditiva</option
                                    >
                                    <option value="Deficiência visual"
                                        >Deficiência visual</option
                                    >
                                    <option value="Deficiência intelectual"
                                        >Deficiência intelectual</option
                                    >
                                    <option value="Deficiência mental"
                                        >Deficiência mental</option
                                    >
                                    <option value="Deficiência múltipla"
                                        >Deficiência múltipla</option
                                    >
                                </select>
                            {/if}
                        </div>
                    {/if}
                </div>

                <!-- Problemas de Saúde -->
                <div>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            bind:checked={data.IV_Problemas_De_Saude}
                            on:change={autosave}
                            class="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span class="ml-2 text-sm text-gray-700"
                            >Problemas de Saúde</span
                        >
                    </label>
                </div>

                <!-- Comprometimento cognitivo-comportamental -->
                <div>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            bind:checked={data.IV_Comp_Cogn_Comport}
                            on:change={() => {
                                if (!data.IV_Comp_Cogn_Comport) {
                                    data.IV_Comp_Cogn_Comport_tipo = "";
                                }
                                autosave();
                            }}
                            class="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span class="ml-2 text-sm text-gray-700"
                            >Comprometimento cognitivo-comportamental</span
                        >
                    </label>
                    {#if data.IV_Comp_Cogn_Comport}
                        <div class="mt-2 ml-6">
                            <select
                                bind:value={data.IV_Comp_Cogn_Comport_tipo}
                                on:change={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Selecione...</option>
                                <option value="Desempenho escolar"
                                    >Desempenho escolar</option
                                >
                                <option value="Déficit laboral"
                                    >Déficit laboral</option
                                >
                            </select>
                        </div>
                    {/if}
                </div>

                <!-- Outro -->
                <div>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            bind:checked={data.IV_Outro}
                            on:change={() => {
                                if (!data.IV_Outro) {
                                    data.IV_Outro_espec = "";
                                }
                                autosave();
                            }}
                            class="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span class="ml-2 text-sm text-gray-700">Outro</span>
                    </label>
                    {#if data.IV_Outro}
                        <div class="mt-2 ml-6">
                            <input
                                type="text"
                                bind:value={data.IV_Outro_espec}
                                on:input={autosave}
                                placeholder="Especifique..."
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <hr class="border-gray-200" />

    <!-- Impacto na Saúde Mental -->
    <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-700">
            Impacto na Saúde Mental
        </h3>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
                >Tipos de impacto</label
            >
            <div class="grid grid-cols-1 gap-2">
                {#each mentalHealthOptions as option}
                    <label class="inline-flex items-start">
                        <input
                            type="checkbox"
                            checked={data.IV_Impacto_Saude_Mental_tipos &&
                                data.IV_Impacto_Saude_Mental_tipos.split(
                                    ";",
                                ).includes(option.value)}
                            on:change={() => toggleMentalHealth(option.value)}
                            class="form-checkbox h-4 w-4 text-blue-600 mt-1"
                        />
                        <span class="ml-2 text-sm text-gray-700"
                            >{option.label}</span
                        >
                    </label>
                {/each}
            </div>
            {#if data.IV_Impacto_Saude_Mental_tipos && data.IV_Impacto_Saude_Mental_tipos.split(";").includes("ISTOutros")}
                <div class="mt-2 ml-6">
                    <input
                        type="text"
                        bind:value={data.IV_ISTOutros_esp}
                        on:input={autosave}
                        placeholder="Especifique..."
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            {/if}
        </div>
    </div>
</div>

<hr class="border-gray-200" />

<!-- Relação familiar e de cuidado -->
<div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-700">
        Relação familiar e de cuidado
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
                >É responsável por membro/s do grupo familiar com alguma
                deficiência, comorbidade ou outra vulnerabilidade?</label
            >
            <div class="flex gap-4">
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={data.RFC_Familia_Vulnerab}
                        value="Sim"
                        on:change={() =>
                            handleRadioChange("RFC_Familia_Vulnerab", "Sim")}
                        class="form-radio text-blue-600"
                    />
                    <span class="ml-2">Sim</span>
                </label>
                <label class="inline-flex items-center">
                    <input
                        type="radio"
                        bind:group={data.RFC_Familia_Vulnerab}
                        value="Não"
                        on:change={() =>
                            handleRadioChange("RFC_Familia_Vulnerab", "Não", [
                                "RFC_Vulnerab_especif",
                            ])}
                        class="form-radio text-blue-600"
                    />
                    <span class="ml-2">Não</span>
                </label>
            </div>
        </div>
        {#if data.RFC_Familia_Vulnerab === "Sim"}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Especifique</label
                >
                <input
                    type="text"
                    bind:value={data.RFC_Vulnerab_especif}
                    on:input={autosave}
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
        {/if}
    </div>
</div>
