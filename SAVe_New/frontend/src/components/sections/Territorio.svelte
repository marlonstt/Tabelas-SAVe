<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        ID_Caso: caseId,
        Moradia_regular: false,
        Moradia_regular_esp: "",
        Moradia_Irregular: false,
        Moradia_Irregular_esp: "",
        Moradia_Emergencial: false,
        Moradia_Emergencial_esp: "",
        Territorio: "",
        Comunidade_tradicional: "",
        Comunidade_tradicional_esp: "",
        Reconhecido_fund_palmares: "",
        Reconhecido_orgao_publico: "",
        Reconhecido_funai: "",
        titulado_incra: "",
        Estrutura_Mat_predominante: "",
        Estrutura_Mat_predominante_esp: "",
        Estrutura_Insta_eletricas_hidraulica: "",
        Estrutura_Insta_eletricas_hidraulica_esp: "",
        Estrutura_paredes_revesti: "",
        Estrutura_danos_eventos_naturais: "",
        Estrutura_danos_eventos_naturais_esp: "",
        Estrutura_Risco_geologico: "",
        Estrutura_Risco_geologico_esp: "",
        Estrutura_Acesso_internet: "",
        Estrutura_Acesso_internet_esp: "",
        Fatores_risco_ambiental_infra: false,
        Fatores_risco_ambiental_infra_esp: "",
        Conflitos_Urbanos_Criminalidade: false,
        Conflitos_Urbanos_Criminalidade_esp: "",
        Conflitos_fundiarios_Agrarios: false,
        Conflitos_fundiarios_Agrarios_esp: "",
        Fatores_risco_outros: false,
        Fatores_risco_outros_esp: "",
        RV_Mudanca_domicilio: "",
        RV_Mudanca_domicilio_esp: "",
    };

    let loading = true;
    let saving = false;
    let saveStatus = "";

    // Helper variables for Territorio checkboxes
    let territorioUrbano = false;
    let territorioRural = false;
    let territorioPeriferico = false;
    let territorioTradicional = false;

    // Helper variables for Comunidade Tradicional checkboxes
    let comunidadeIndigena = false;
    let comunidadeQuilombola = false;
    let comunidadeRibeirinho = false;
    let comunidadeCigano = false;
    let comunidadeOutro = false;

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            if (
                response.data.habitacaoTerritorio &&
                response.data.habitacaoTerritorio.ID_Caso
            ) {
                console.log(
                    "Raw data from backend:",
                    response.data.habitacaoTerritorio,
                );

                // Use Object.assign to maintain reactivity
                Object.assign(data, response.data.habitacaoTerritorio);

                // Fix case sensitivity issue for titulado_incra
                if (data.titulado_Incra !== undefined) {
                    data.titulado_incra = data.titulado_Incra;
                    delete data.titulado_Incra;
                }

                // Normalize titulado_incra to string values "Sim"/"Não"
                if (typeof data.titulado_incra === "boolean") {
                    data.titulado_incra = data.titulado_incra ? "Sim" : "Não";
                }

                console.log(
                    "After normalization - titulado_incra:",
                    data.titulado_incra,
                    "Type:",
                    typeof data.titulado_incra,
                );

                // Parse Territorio string to checkboxes
                if (data.Territorio) {
                    territorioUrbano = data.Territorio.includes("Urbano");
                    territorioRural = data.Territorio.includes("Rural");
                    territorioPeriferico =
                        data.Territorio.includes("Periférico");
                    territorioTradicional =
                        data.Territorio.includes("Tradicional");
                    console.log(
                        "Territorio:",
                        data.Territorio,
                        "-> territorioTradicional:",
                        territorioTradicional,
                    );
                }

                // Parse Comunidade Tradicional string to checkboxes
                if (data.Comunidade_tradicional) {
                    comunidadeIndigena =
                        data.Comunidade_tradicional.includes("Indigena");
                    comunidadeQuilombola =
                        data.Comunidade_tradicional.includes("Quilombola");
                    comunidadeRibeirinho =
                        data.Comunidade_tradicional.includes("Ribeirinho");
                    comunidadeCigano =
                        data.Comunidade_tradicional.includes("Cigano");
                    comunidadeOutro =
                        data.Comunidade_tradicional.includes("Outro");
                    console.log(
                        "Comunidade_tradicional:",
                        data.Comunidade_tradicional,
                        "-> comunidadeOutro:",
                        comunidadeOutro,
                    );
                }

                console.log("Final data object:", data);

                // Force Svelte reactivity
                data = data;
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            loading = false;
        }
    }

    async function autosave() {
        saveStatus = "Salvando...";
        try {
            // Update Territorio string
            let territorios = [];
            if (territorioUrbano) territorios.push("Urbano");
            if (territorioRural) territorios.push("Rural");
            if (territorioPeriferico) territorios.push("Periférico");
            if (territorioTradicional) territorios.push("Tradicional");
            data.Territorio = territorios.join("; ");

            // Update Comunidade Tradicional string
            let comunidades = [];
            if (comunidadeIndigena) comunidades.push("Indigena");
            if (comunidadeQuilombola) comunidades.push("Quilombola");
            if (comunidadeRibeirinho) comunidades.push("Ribeirinho");
            if (comunidadeCigano) comunidades.push("Cigano");
            if (comunidadeOutro) comunidades.push("Outro");
            data.Comunidade_tradicional = comunidades.join("; ");

            // Ensure ID_Caso is an integer
            data.ID_Caso = parseInt(caseId);

            console.log("Saving Territorio data:", data);
            await api.put(`/cases/${caseId}/habitacao-territorio`, data);
            saveStatus = "Salvo! ✅";
            setTimeout(() => (saveStatus = ""), 2000);
        } catch (error) {
            console.error("Error saving data:", error);
            saveStatus = "Erro ao salvar ❌";
        }
    }

    function handleCheckboxChange() {
        autosave();
    }

    async function manualSave() {
        if (loading || saving) return;
        saving = true;
        saveStatus = "Salvando...";
        try {
            // Update Territorio string
            let territorios = [];
            if (territorioUrbano) territorios.push("Urbano");
            if (territorioRural) territorios.push("Rural");
            if (territorioPeriferico) territorios.push("Periférico");
            if (territorioTradicional) territorios.push("Tradicional");
            data.Territorio = territorios.join("; ");

            // Update Comunidade Tradicional string
            let comunidades = [];
            if (comunidadeIndigena) comunidades.push("Indigena");
            if (comunidadeQuilombola) comunidades.push("Quilombola");
            if (comunidadeRibeirinho) comunidades.push("Ribeirinho");
            if (comunidadeCigano) comunidades.push("Cigano");
            if (comunidadeOutro) comunidades.push("Outro");
            data.Comunidade_tradicional = comunidades.join("; ");

            // Ensure ID_Caso is an integer
            data.ID_Caso = parseInt(caseId);

            console.log("Saving Territorio data:", data);
            await api.put(`/cases/${caseId}/habitacao-territorio`, data);
            saveStatus = "Salvo! ✅";
            setTimeout(() => (saveStatus = ""), 2000);
        } catch (error) {
            console.error("Error saving data:", error);
            saveStatus = "Erro ao salvar ❌";
        } finally {
            saving = false;
        }
    }
</script>

<div class="bg-white rounded shadow p-10 relative">
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
        class:opacity-0={saving || loading || !saveStatus}
        class:opacity-100={!saving && !loading && saveStatus}
    >
        <span class="text-green-600 flex items-center">
            <span class="material-icons text-sm mr-1">check</span>
            {saveStatus}
        </span>
    </div>

    {#if loading}
        <div class="flex justify-center p-8">
            <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-save-primary"
            ></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Container Moradia -->
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">
                    Moradia
                </h3>

                <div class="space-y-4">
                    <!-- Moradia Regular -->
                    <div class="flex flex-col space-y-2">
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={data.Moradia_regular}
                                on:change={() => {
                                    if (!data.Moradia_regular) {
                                        data.Moradia_regular_esp = "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium"
                                >Regular</span
                            >
                        </label>
                        {#if data.Moradia_regular}
                            <div class="ml-7">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Especifique:</label
                                >
                                <select
                                    bind:value={data.Moradia_regular_esp}
                                    on:change={autosave}
                                    class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Casa propria - quitada "
                                        >Casa propria - quitada
                                    </option>
                                    <option value="Casa própria - financiada"
                                        >Casa própria - financiada</option
                                    >
                                    <option value="Alugada">Alugada</option>
                                </select>
                            </div>
                        {/if}
                    </div>

                    <!-- Moradia Irregular -->
                    <div class="flex flex-col space-y-2">
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={data.Moradia_Irregular}
                                on:change={() => {
                                    if (!data.Moradia_Irregular) {
                                        data.Moradia_Irregular_esp = "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium"
                                >Irregular</span
                            >
                        </label>
                        {#if data.Moradia_Irregular}
                            <div class="ml-7">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Especifique:</label
                                >
                                <select
                                    bind:value={data.Moradia_Irregular_esp}
                                    on:change={autosave}
                                    class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Ocupação">Ocupação</option>
                                    <option value="Situação de rua"
                                        >Situação de rua</option
                                    >
                                </select>
                            </div>
                        {/if}
                    </div>

                    <!-- Moradia Emergencial -->
                    <div class="flex flex-col space-y-2">
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={data.Moradia_Emergencial}
                                on:change={() => {
                                    if (!data.Moradia_Emergencial) {
                                        data.Moradia_Emergencial_esp = "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium"
                                >Emergencial</span
                            >
                        </label>
                        {#if data.Moradia_Emergencial}
                            <div class="ml-7">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Especifique:</label
                                >
                                <select
                                    bind:value={data.Moradia_Emergencial_esp}
                                    on:change={autosave}
                                    class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Acolhimento institucional"
                                        >Acolhimento institucional</option
                                    >
                                    <option value="Moradia cedida/emprestada"
                                        >Moradia cedida/emprestada</option
                                    >
                                    <option
                                        value="Acolhida com familiares ou amigos"
                                        >Acolhida com familiares ou amigos</option
                                    >
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Container Território -->
            <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 class="text-lg font-semibold text-blue-900 mb-4">
                    Território
                </h3>

                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={territorioUrbano}
                                on:change={handleCheckboxChange}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium">Urbano</span
                            >
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={territorioPeriferico}
                                on:change={handleCheckboxChange}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium"
                                >Periférico</span
                            >
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={territorioRural}
                                on:change={handleCheckboxChange}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium">Rural</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                bind:checked={territorioTradicional}
                                on:change={() => {
                                    if (!territorioTradicional) {
                                        comunidadeIndigena = false;
                                        comunidadeQuilombola = false;
                                        comunidadeRibeirinho = false;
                                        comunidadeCigano = false;
                                        comunidadeOutro = false;
                                        data.Reconhecido_funai = "";
                                        data.Reconhecido_fund_palmares = "";
                                        data.Reconhecido_orgao_publico = "";
                                        data.Comunidade_tradicional_esp = "";
                                        data.titulado_incra = "";
                                    }
                                    handleCheckboxChange();
                                }}
                                class="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <span class="text-gray-700 font-medium"
                                >Tradicional</span
                            >
                        </label>
                    </div>

                    {#if territorioTradicional}
                        <div
                            class="mt-4 p-4 bg-gray-50 rounded border border-gray-200"
                        >
                            <h4
                                class="text-md font-semibold text-blue-800 mb-3"
                            >
                                Comunidade Tradicional
                            </h4>

                            <div class="space-y-3">
                                <!-- Indigena -->
                                <div class="flex flex-col">
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            bind:checked={comunidadeIndigena}
                                            on:change={() => {
                                                if (!comunidadeIndigena) {
                                                    data.Reconhecido_funai = "";
                                                }
                                                handleCheckboxChange();
                                            }}
                                            class="form-checkbox h-5 w-5 text-blue-600 rounded"
                                        />
                                        <span class="text-gray-700"
                                            >Território Indígena</span
                                        >
                                    </label>
                                    {#if comunidadeIndigena}
                                        <div class="ml-7 mt-2">
                                            <label
                                                class="block text-sm font-medium text-gray-700 mb-1"
                                                >É reconhecida pelo FUNAI?</label
                                            >
                                            <div class="flex space-x-4">
                                                <label
                                                    class="inline-flex items-center"
                                                >
                                                    <input
                                                        type="radio"
                                                        bind:group={
                                                            data.Reconhecido_funai
                                                        }
                                                        value="Sim"
                                                        on:change={autosave}
                                                        class="form-radio text-blue-600"
                                                    />
                                                    <span class="ml-2">Sim</span
                                                    >
                                                </label>
                                                <label
                                                    class="inline-flex items-center"
                                                >
                                                    <input
                                                        type="radio"
                                                        bind:group={
                                                            data.Reconhecido_funai
                                                        }
                                                        value="Não"
                                                        on:change={autosave}
                                                        class="form-radio text-blue-600"
                                                    />
                                                    <span class="ml-2">Não</span
                                                    >
                                                </label>
                                                <button
                                                    type="button"
                                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    on:click={() => {
                                                        data.Reconhecido_funai =
                                                            "";
                                                        autosave();
                                                    }}
                                                    title="Limpar seleção"
                                                >
                                                    <span
                                                        class="material-icons text-sm"
                                                        >close</span
                                                    >
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Quilombola -->
                                <div class="flex flex-col">
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            bind:checked={comunidadeQuilombola}
                                            on:change={() => {
                                                if (!comunidadeQuilombola) {
                                                    data.Reconhecido_fund_palmares =
                                                        "";
                                                }
                                                handleCheckboxChange();
                                            }}
                                            class="form-checkbox h-5 w-5 text-blue-600 rounded"
                                        />
                                        <span class="text-gray-700"
                                            >Território Quilombola</span
                                        >
                                    </label>
                                    {#if comunidadeQuilombola}
                                        <div class="ml-7 mt-2">
                                            <label
                                                class="block text-sm font-medium text-gray-700 mb-1"
                                                >É reconhecido pela Fundação
                                                Palmares?</label
                                            >
                                            <div class="flex space-x-4">
                                                <label
                                                    class="inline-flex items-center"
                                                >
                                                    <input
                                                        type="radio"
                                                        bind:group={
                                                            data.Reconhecido_fund_palmares
                                                        }
                                                        value="Sim"
                                                        on:change={autosave}
                                                        class="form-radio text-blue-600"
                                                    />
                                                    <span class="ml-2">Sim</span
                                                    >
                                                </label>
                                                <label
                                                    class="inline-flex items-center"
                                                >
                                                    <input
                                                        type="radio"
                                                        bind:group={
                                                            data.Reconhecido_fund_palmares
                                                        }
                                                        value="Não"
                                                        on:change={autosave}
                                                        class="form-radio text-blue-600"
                                                    />
                                                    <span class="ml-2">Não</span
                                                    >
                                                </label>
                                                <button
                                                    type="button"
                                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    on:click={() => {
                                                        data.Reconhecido_fund_palmares =
                                                            "";
                                                        autosave();
                                                    }}
                                                    title="Limpar seleção"
                                                >
                                                    <span
                                                        class="material-icons text-sm"
                                                        >close</span
                                                    >
                                                </button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Ribeirinho -->
                                <label class="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        bind:checked={comunidadeRibeirinho}
                                        on:change={handleCheckboxChange}
                                        class="form-checkbox h-5 w-5 text-blue-600 rounded"
                                    />
                                    <span class="text-gray-700"
                                        >Território Ribeirinho</span
                                    >
                                </label>

                                <!-- Cigano -->
                                <label class="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        bind:checked={comunidadeCigano}
                                        on:change={handleCheckboxChange}
                                        class="form-checkbox h-5 w-5 text-blue-600 rounded"
                                    />
                                    <span class="text-gray-700"
                                        >Território Cigano</span
                                    >
                                </label>

                                <!-- Outro -->
                                <div class="flex flex-col">
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            bind:checked={comunidadeOutro}
                                            on:change={() => {
                                                if (!comunidadeOutro) {
                                                    data.Reconhecido_orgao_publico =
                                                        "";
                                                    data.Comunidade_tradicional_esp =
                                                        "";
                                                }
                                                handleCheckboxChange();
                                            }}
                                            class="form-checkbox h-5 w-5 text-blue-600 rounded"
                                        />
                                        <span class="text-gray-700"
                                            >Outro território tradicional</span
                                        >
                                    </label>
                                    {#if comunidadeOutro}
                                        <div class="ml-7 mt-2 space-y-2">
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 mb-1"
                                                    >Possui reconhecimento de
                                                    outro órgão público?</label
                                                >
                                                <div class="flex space-x-4">
                                                    <label
                                                        class="inline-flex items-center"
                                                    >
                                                        <input
                                                            type="radio"
                                                            bind:group={
                                                                data.Reconhecido_orgao_publico
                                                            }
                                                            value="Sim"
                                                            on:change={autosave}
                                                            class="form-radio text-blue-600"
                                                        />
                                                        <span class="ml-2"
                                                            >Sim</span
                                                        >
                                                    </label>
                                                    <label
                                                        class="inline-flex items-center"
                                                    >
                                                        <input
                                                            type="radio"
                                                            bind:group={
                                                                data.Reconhecido_orgao_publico
                                                            }
                                                            value="Não"
                                                            on:change={autosave}
                                                            class="form-radio text-blue-600"
                                                        />
                                                        <span class="ml-2"
                                                            >Não</span
                                                        >
                                                    </label>
                                                    <button
                                                        type="button"
                                                        class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        on:click={() => {
                                                            data.Reconhecido_orgao_publico =
                                                                "";
                                                            autosave();
                                                        }}
                                                        title="Limpar seleção"
                                                    >
                                                        <span
                                                            class="material-icons text-sm"
                                                            >close</span
                                                        >
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    class="block text-sm font-medium text-gray-700 mb-1"
                                                    >Especifique:</label
                                                >
                                                <input
                                                    type="text"
                                                    bind:value={
                                                        data.Comunidade_tradicional_esp
                                                    }
                                                    on:blur={autosave}
                                                    class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Titulado Incra -->
                                <div class="mt-4 pt-4 border-t border-gray-200">
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >O território tradicional está titulado
                                        pelo Incra?</label
                                    >
                                    <div class="flex space-x-4">
                                        <label class="inline-flex items-center">
                                            <input
                                                type="radio"
                                                bind:group={data.titulado_incra}
                                                value="Sim"
                                                on:change={autosave}
                                                class="form-radio text-blue-600"
                                            />
                                            <span class="ml-2">Sim</span>
                                        </label>
                                        <label class="inline-flex items-center">
                                            <input
                                                type="radio"
                                                bind:group={data.titulado_incra}
                                                value="Não"
                                                on:change={autosave}
                                                class="form-radio text-blue-600"
                                            />
                                            <span class="ml-2">Não</span>
                                        </label>
                                        <button
                                            type="button"
                                            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                            on:click={() => {
                                                data.titulado_incra = "";
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
            </div>
        </div>

        <!-- Additional Fields Container -->
        <div class="bg-white p-4 rounded-lg shadow border border-gray-200 mt-6">
            <h3 class="text-lg font-semibold text-blue-900 mb-4">
                Estrutura e Condições
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Material Predominante -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        Qual o material predominante?
                    </span>
                    <select
                        bind:value={data.Estrutura_Mat_predominante}
                        on:change={() => {
                            if (data.Estrutura_Mat_predominante !== "Outro") {
                                data.Estrutura_Mat_predominante_esp = "";
                            }
                            autosave();
                        }}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Alvenaria">Alvenaria</option>
                        <option value="Madeira">Madeira</option>
                        <option value="Mista">Mista</option>
                        <option value="Adobo">Adobo</option>
                        <option value="Outro">Outro</option>
                    </select>
                    {#if data.Estrutura_Mat_predominante === "Outro"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Especifique:</label
                            >
                            <input
                                type="text"
                                bind:value={data.Estrutura_Mat_predominante_esp}
                                on:blur={autosave}
                                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ex: Papelão, Plástico"
                            />
                        </div>
                    {/if}
                </div>

                <!-- Instalações Elétricas/Hidráulicas -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        Possui instalações elétricas e hidráulicas?
                    </span>
                    <select
                        bind:value={data.Estrutura_Insta_eletricas_hidraulica}
                        on:change={() => {
                            if (
                                data.Estrutura_Insta_eletricas_hidraulica !==
                                "Sim"
                            ) {
                                data.Estrutura_Insta_eletricas_hidraulica_esp =
                                    "";
                            }
                            autosave();
                        }}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                    {#if data.Estrutura_Insta_eletricas_hidraulica === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Especifique:</label
                            >
                            <input
                                type="text"
                                bind:value={
                                    data.Estrutura_Insta_eletricas_hidraulica_esp
                                }
                                on:blur={autosave}
                                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ex: água do açude"
                            />
                        </div>
                    {/if}
                </div>

                <!-- Paredes e Revestimentos -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        Possui paredes e revestimentos?
                    </span>
                    <select
                        bind:value={data.Estrutura_paredes_revesti}
                        on:change={autosave}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </div>

                <!-- Acesso à Internet -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        Possui acesso à internet?
                    </span>
                    <select
                        bind:value={data.Estrutura_Acesso_internet}
                        on:change={() => {
                            if (data.Estrutura_Acesso_internet !== "Sim") {
                                data.Estrutura_Acesso_internet_esp = "";
                            }
                            autosave();
                        }}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                    {#if data.Estrutura_Acesso_internet === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Especifique:</label
                            >
                            <input
                                type="text"
                                bind:value={data.Estrutura_Acesso_internet_esp}
                                on:blur={autosave}
                                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    {/if}
                </div>

                <!-- Danos por Eventos Naturais -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        O imóvel já sofreu danos por eventos naturais?
                    </span>
                    <select
                        bind:value={data.Estrutura_danos_eventos_naturais}
                        on:change={() => {
                            if (
                                data.Estrutura_danos_eventos_naturais !== "Sim"
                            ) {
                                data.Estrutura_danos_eventos_naturais_esp = "";
                            }
                            autosave();
                        }}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                    {#if data.Estrutura_danos_eventos_naturais === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Especifique os danos:</label
                            >
                            <input
                                type="text"
                                bind:value={
                                    data.Estrutura_danos_eventos_naturais_esp
                                }
                                on:blur={autosave}
                                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    {/if}
                </div>

                <!-- Riscos Geológicos -->
                <div>
                    <span class="block text-sm font-medium text-gray-700 mb-1">
                        O entorno do imóvel apresenta riscos geológicos?
                    </span>
                    <select
                        bind:value={data.Estrutura_Risco_geologico}
                        on:change={() => {
                            if (data.Estrutura_Risco_geologico !== "Sim") {
                                data.Estrutura_Risco_geologico_esp = "";
                            }
                            autosave();
                        }}
                        class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                    {#if data.Estrutura_Risco_geologico === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Especifique os riscos:</label
                            >
                            <input
                                type="text"
                                bind:value={data.Estrutura_Risco_geologico_esp}
                                on:blur={autosave}
                                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    {/if}
                </div>
            </div>
            <!-- Território - Fatores de risco -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-save-primary mb-4">
                    Território - Fatores de risco
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Risco ambiental e de infraestrutura -->
                    <div class="flex flex-col space-y-2">
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    data.Fatores_risco_ambiental_infra
                                }
                                on:change={() => {
                                    autosave();
                                    if (!data.Fatores_risco_ambiental_infra) {
                                        data.Fatores_risco_ambiental_infra_esp =
                                            "";
                                        autosave();
                                    }
                                }}
                                class="form-checkbox h-5 w-5 text-save-primary rounded border-gray-300 focus:ring-save-primary"
                            />
                            <span class="ml-2 text-gray-700"
                                >Risco ambiental e de infraestrutura</span
                            >
                        </label>

                        {#if data.Fatores_risco_ambiental_infra}
                            <div class="ml-7 animate-fade-in">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Especifique
                                </label>
                                <select
                                    bind:value={
                                        data.Fatores_risco_ambiental_infra_esp
                                    }
                                    on:change={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary sm:text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Alagamento"
                                        >Alagamento</option
                                    >
                                    <option value="Deslizamento de terra"
                                        >Deslizamento de terra</option
                                    >
                                    <option value="Barragens">Barragens</option>
                                    <option value="Residuos tóxicos"
                                        >Residuos tóxicos</option
                                    >
                                </select>
                            </div>
                        {/if}
                    </div>

                    <!-- Conflitos urbanos e criminalidade -->
                    <div class="flex flex-col space-y-2">
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    data.Conflitos_Urbanos_Criminalidade
                                }
                                on:change={() => {
                                    autosave();
                                    if (!data.Conflitos_Urbanos_Criminalidade) {
                                        data.Conflitos_Urbanos_Criminalidade_esp =
                                            "";
                                        autosave();
                                    }
                                }}
                                class="form-checkbox h-5 w-5 text-save-primary rounded border-gray-300 focus:ring-save-primary"
                            />
                            <span class="ml-2 text-gray-700"
                                >Conflitos urbanos e criminalidade</span
                            >
                        </label>

                        {#if data.Conflitos_Urbanos_Criminalidade}
                            <div class="ml-7 animate-fade-in">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Especifique
                                </label>
                                <select
                                    bind:value={
                                        data.Conflitos_Urbanos_Criminalidade_esp
                                    }
                                    on:change={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary sm:text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Pontos de tráfico"
                                        >Pontos de tráfico</option
                                    >
                                    <option value="Facções">Facções</option>
                                    <option value="Milícias armadas"
                                        >Milícias armadas</option
                                    >
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        {/if}
                    </div>

                    <!-- Conflitos fundiários ou agrários -->
                    <div class="flex flex-col space-y-2">
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    data.Conflitos_fundiarios_Agrarios
                                }
                                on:change={() => {
                                    autosave();
                                    if (!data.Conflitos_fundiarios_Agrarios) {
                                        data.Conflitos_fundiarios_Agrarios_esp =
                                            "";
                                        autosave();
                                    }
                                }}
                                class="form-checkbox h-5 w-5 text-save-primary rounded border-gray-300 focus:ring-save-primary"
                            />
                            <span class="ml-2 text-gray-700"
                                >Conflitos fundiários ou agrários</span
                            >
                        </label>

                        {#if data.Conflitos_fundiarios_Agrarios}
                            <div class="ml-7 animate-fade-in">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Especifique
                                </label>
                                <select
                                    bind:value={
                                        data.Conflitos_fundiarios_Agrarios_esp
                                    }
                                    on:change={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary sm:text-sm"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Facções">Facções</option>
                                    <option value="Milícias armadas"
                                        >Milícias armadas</option
                                    >
                                    <option value="Deslocamento forçados"
                                        >Deslocamento forçados</option
                                    >
                                    <option value="Desmatamento ilegal"
                                        >Desmatamento ilegal</option
                                    >
                                    <option value="Contaminação do solo"
                                        >Contaminação do solo</option
                                    >
                                    <option
                                        value="Trabalho análogo à escravidão"
                                        >Trabalho análogo à escravidão</option
                                    >
                                </select>
                            </div>
                        {/if}
                    </div>

                    <!-- Outros riscos -->
                    <div class="flex flex-col space-y-2">
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={data.Fatores_risco_outros}
                                on:change={() => {
                                    autosave();
                                    if (!data.Fatores_risco_outros) {
                                        data.Fatores_risco_outros_esp = "";
                                        autosave();
                                    }
                                }}
                                class="form-checkbox h-5 w-5 text-save-primary rounded border-gray-300 focus:ring-save-primary"
                            />
                            <span class="ml-2 text-gray-700">Outros riscos</span
                            >
                        </label>

                        {#if data.Fatores_risco_outros}
                            <div class="ml-7 animate-fade-in">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Especifique
                                </label>
                                <input
                                    type="text"
                                    bind:value={data.Fatores_risco_outros_esp}
                                    on:blur={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary sm:text-sm"
                                />
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            <!-- Repercussões da vitimização -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-save-primary mb-4">
                    Repercussões da vitimização
                </h3>

                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            A Vítima precisa ou precisou se mudar de domicílio
                            em decorrência da vitimização?
                        </label>
                        <div class="flex space-x-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.RV_Mudanca_domicilio}
                                    value="Sim"
                                    on:change={autosave}
                                    class="form-radio h-4 w-4 text-save-primary border-gray-300 focus:ring-save-primary"
                                />
                                <span class="ml-2 text-gray-700">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    bind:group={data.RV_Mudanca_domicilio}
                                    value="Não"
                                    on:change={() => {
                                        data.RV_Mudanca_domicilio_esp = "";
                                        autosave();
                                    }}
                                    class="form-radio h-4 w-4 text-save-primary border-gray-300 focus:ring-save-primary"
                                />
                                <span class="ml-2 text-gray-700">Não</span>
                            </label>
                            <button
                                type="button"
                                class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                on:click={() => {
                                    data.RV_Mudanca_domicilio = "";
                                    data.RV_Mudanca_domicilio_esp = "";
                                    autosave();
                                }}
                                title="Limpar seleção"
                            >
                                <span class="material-icons text-sm">close</span
                                >
                            </button>
                        </div>
                    </div>

                    {#if data.RV_Mudanca_domicilio === "Sim"}
                        <div class="animate-fade-in">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Especifique quais meios o ameaçador possui de
                                concretizar a ameaça:
                            </label>
                            <input
                                type="text"
                                bind:value={data.RV_Mudanca_domicilio_esp}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring-save-primary sm:text-sm"
                            />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
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
