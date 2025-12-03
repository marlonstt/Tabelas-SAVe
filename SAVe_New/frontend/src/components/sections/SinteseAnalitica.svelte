<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    // Data for the table
    let data: any[] = [];
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    // Data from other tabs for calculation
    let identificacao: any = {};
    let vinculos: any = {};
    let etr: any = {}; // Ensino, Trabalho, Renda
    let ht: any = {}; // Habitacao, Territorio
    let saude: any = {};
    let sj: any = {}; // Situacao Juridica
    let sj2: any = {}; // Situacao Juridica 2
    let ps: any = {}; // Protecao Seguranca

    // Fixed list of analytical units in the correct order
    const unidadesAnaliticas = [
        "Vítima de especial vulnerabilidade",
        "Grupo familiar e vínculos sociais",
        "Escolaridade/qualificação",
        "Situação laboral e econômica",
        "Situação habitacional e território",
        "Situação de saúde",
        "Demandas jurídicas",
        "Proteção e segurança",
    ];

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            const caseData = response.data;

            // Load data from other tabs
            identificacao = caseData.identificacao || {};
            vinculos = caseData.vinculos || {};
            etr = caseData.ensinoTrabRenda || {};
            ht = caseData.habitacaoTerritorio || {};
            saude = caseData.saude || {};
            sj = caseData.situacaoJuridica || {};
            sj2 = caseData.situacaoJuridica2 || {};
            ps = caseData.protecaoSeguranca || {};

            // Load existing Sintese Analitica data
            const existingData = caseData.sinteseAnalitica || [];

            // Merge with fixed units
            data = unidadesAnaliticas.map((unidade) => {
                const existing = existingData.find(
                    (item: any) => item.UnidadeAnalitica === unidade,
                );
                return (
                    existing || {
                        ID_Caso: parseInt(caseId),
                        UnidadeAnalitica: unidade,
                        AvaliacaoDeRiscos: "",
                        PlanoDePrevencao: "",
                        DataVencimento: "",
                        Cor: "",
                    }
                );
            });

            // Calculate risks immediately after loading
            calculateRisks();
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    // Helper to calculate age
    function calculateAge(dateStr: string): number {
        if (!dateStr) return 0;
        const parts = dateStr.split("/");
        if (parts.length !== 3) {
            // Try YYYY-MM-DD if DD/MM/YYYY fails
            const parts2 = dateStr.split("-");
            if (parts2.length === 3) {
                const birthDate = new Date(dateStr);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (
                    m < 0 ||
                    (m === 0 && today.getDate() < birthDate.getDate())
                ) {
                    age--;
                }
                return age;
            }
            return 0;
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const birthDate = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Helper to safely access nested properties
    function get(obj: any, path: string, defaultValue: any = undefined): any {
        if (!obj) return defaultValue;
        const keys = path.split(".");
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) return defaultValue;
            result = result[key];
        }
        return result === undefined ? defaultValue : result;
    }

    function calculateRisks() {
        let updated = false;

        data = data.map((item) => {
            let newItem = { ...item };
            let riskText = "";
            let riskColor = "";

            const age = calculateAge(identificacao.Data_nascimento);

            switch (item.UnidadeAnalitica) {
                case "Vítima de especial vulnerabilidade":
                    const vev_high =
                        get(vinculos, "Alt_Fam_Com_Vitim") === "Sim" ||
                        (get(vinculos, "Vulnerab_Vinculos_Fam") === "Sim" &&
                            (get(identificacao, "PPS_Sexo") !== "Masculino" ||
                                age < 18 ||
                                age > 60 ||
                                get(identificacao, "PPS_idgenero") !==
                                    "Homem cisgênero" ||
                                get(identificacao, "PPS_orientacao_sexual") !==
                                    "Heterossexual"));

                    const vev_low =
                        ((get(identificacao, "PPS_Sexo") === "Masculino" &&
                            age > 18 &&
                            age < 60 &&
                            get(identificacao, "PPS_idgenero") ===
                                "Homem cisgênero" &&
                            get(identificacao, "PPS_orientacao_sexual") ===
                                "Heterossexual") ||
                            !Object.keys(identificacao).length) &&
                        !vev_high;

                    if (vev_high) {
                        riskText = "Pertence a grupos vulneráveis sem apoio.";
                        riskColor = "Vermelho";
                    } else if (vev_low) {
                        riskText = "Não pertence a grupos vulneráveis.";
                        riskColor = "Verde";
                    } else {
                        riskText =
                            "Pertence a grupos vulneráveis, mas com apoio.";
                        riskColor = "Aviso"; // Amarelo
                    }
                    break;

                case "Grupo familiar e vínculos sociais":
                    const gfvs_high =
                        get(vinculos, "Alt_Fam_Com_Vitim") === "Sim";
                    const gfvs_med =
                        get(vinculos, "Alt_Fam_Com_Vitim") === "Não" &&
                        get(vinculos, "Vulnerab_Vinculos_Fam") === "Sim";

                    if (gfvs_high) {
                        riskText = "Isolamento social, rompimento familiar.";
                        riskColor = "Vermelho";
                    } else if (gfvs_med) {
                        riskText = "Rede de apoio frágil e instável.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Rede de apoio funcional.";
                        riskColor = "Verde";
                    }
                    break;

                case "Escolaridade/qualificação":
                    const escolaridade = get(etr, "Grau_escolaridade");
                    const eq_high = [
                        "Analfabeto Funcional",
                        "Analfabeto",
                        "E. Fund. Incompleto",
                    ].includes(escolaridade);
                    const eq_med = [
                        "E. Fund. Completo",
                        "E. Médio Incompleto",
                    ].includes(escolaridade);

                    if (eq_high) {
                        riskText = "Analfabetismo ou nenhuma qualificação.";
                        riskColor = "Vermelho";
                    } else if (eq_med) {
                        riskText =
                            "Ensino fundamental completo ou médio incompleto.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Ensino médio completo ou superior.";
                        riskColor = "Verde";
                    }
                    break;

                case "Situação laboral e econômica":
                    const sitTrab = get(etr, "Situacao_trabalho");
                    const afastado = get(etr, "Esta_Afastado");
                    const renda = get(etr, "Valor_renda");

                    const sle_high =
                        [
                            "Desempregado/a",
                            "Inativo/a",
                            "Aposentado/a",
                        ].includes(sitTrab) ||
                        afastado === "Afastamento Médico" ||
                        renda === "Menos de um salário mínimo";
                    const sle_med =
                        ([
                            "Estudante/Mestrando/Doutorando/Bolsista",
                            "Trabalhador/a informal",
                        ].includes(sitTrab) ||
                            afastado ===
                                "Afastamento por Motivo Pessoal ou Profissional" ||
                            [
                                "de 1 a 2 salários mínimos",
                                "de 2 a 5 salários mínimos",
                            ].includes(renda)) &&
                        !sle_high;

                    if (sle_high) {
                        riskText = "Desemprego crônico, renda insuficiente.";
                        riskColor = "Vermelho";
                    } else if (sle_med) {
                        riskText = "Trabalho informal ou desemprego eventual.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Emprego formal estável.";
                        riskColor = "Verde";
                    }
                    break;

                case "Situação habitacional e território":
                    const matPred = get(ht, "Estrutura_Mat_predominante");
                    const sht_high =
                        get(ht, "Moradia_Emergencial") === true ||
                        ["Mista", "Outro"].includes(matPred) ||
                        get(ht, "Estrutura_danos_eventos_naturais") === "Sim" ||
                        get(ht, "Estrutura_Risco_geologico") === "Sim" ||
                        get(ht, "Fatores_risco_ambiental_infra") === true ||
                        get(ht, "Conflitos_fundiarios_Agrarios") === true ||
                        get(ht, "Conflitos_Urbanos_Criminalidade") === true ||
                        get(ht, "Fatores_risco_outros") === true;
                    const sht_med =
                        (get(ht, "Moradia_Irregular") === true ||
                            matPred === "Madeira") &&
                        !sht_high;

                    if (sht_high) {
                        riskText =
                            "Sem moradia fixa ou em área de risco grave.";
                        riskColor = "Vermelho";
                    } else if (sht_med) {
                        riskText = "Moradia precária em área urbana de risco.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Moradia segura em local adequado.";
                        riskColor = "Verde";
                    }
                    break;

                case "Situação de saúde":
                    const ss_high =
                        get(saude, "HS_Condicao_saude_acompanhamento") ===
                            "Não" ||
                        get(saude, "HS_Cond_saude_nao_perma_acomp") === "Não" ||
                        get(saude, "HS_Vitim_sexual_acomp") === "Não";
                    const ss_med =
                        (get(saude, "HS_Vitim_sexual") === "Sim" ||
                            get(saude, "HS_Condicao_saude") === "Sim" ||
                            get(saude, "HS_Cond_saude_nao_perma") === "Sim" ||
                            get(saude, "HS_Pessoa_deficiencia") === "Sim" ||
                            get(saude, "HS_Medic_continua") === "Sim" ||
                            get(saude, "HS_Medic_psiq") === "Sim") &&
                        !ss_high;

                    if (ss_high) {
                        riskText = "Doenças graves sem acompanhamento.";
                        riskColor = "Vermelho";
                    } else if (ss_med) {
                        riskText = "Doenças crônicas controladas.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Saúde estável, acesso regular a cuidados.";
                        riskColor = "Verde";
                    }
                    break;

                case "Demandas jurídicas":
                    const dj_high =
                        get(vinculos, "Vulnerab_Vitim_Sec_Ter") === "Sim" ||
                        get(sj2, "SJ2_Demanda_Justica_Diligencia") === true ||
                        get(sj2, "SJ2_Demanda_Protecao_Nao_Revitimizacao") ===
                            true;
                    const dj_med =
                        (get(sj2, "SJ2_Demanda_Memoria_Verdade") === true ||
                            get(sj2, "SJ2_Demanda_Apoio_Assistencia") ===
                                true ||
                            get(sj2, "SJ2_Demanda_Seguranca") === true ||
                            get(sj2, "SJ2_Demanda_Protecao_Psicologica") ===
                                true ||
                            get(sj2, "SJ2_Demanda_Protecao_Documental") ===
                                true ||
                            get(sj2, "SJ2_Demanda_Compensacao_Reparacao") ===
                                true ||
                            get(sj2, "SJ2_Demanda_Tratamento_Digno") ===
                                true) &&
                        !dj_high;

                    if (dj_high) {
                        riskText = "Sem documentação ou litígios complexos.";
                        riskColor = "Vermelho";
                    } else if (dj_med) {
                        riskText = "Questões jurídicas em andamento.";
                        riskColor = "Aviso";
                    } else {
                        riskText = "Sem pendências jurídicas.";
                        riskColor = "Verde";
                    }
                    break;

                case "Proteção e segurança":
                    const ps_high =
                        get(ps, "PS_Situacao_ameaca_relat") === "Sim";

                    if (ps_high) {
                        riskText = "Ameaça iminente à integridade física.";
                        riskColor = "Vermelho";
                    } else {
                        riskText = "Não há ameaças diretas.";
                        riskColor = "Verde";
                    }
                    break;
            }

            if (
                newItem.AvaliacaoDeRiscos !== riskText ||
                newItem.Cor !== riskColor
            ) {
                newItem.AvaliacaoDeRiscos = riskText;
                newItem.Cor = riskColor;
                updated = true;
            }
            return newItem;
        });

        if (updated) {
            autosave();
        }
    }

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            if (saving) return;
            saving = true;
            saveStatus = "Salvando...";
            try {
                await api.put(`/cases/${caseId}/sintese-analitica`, data);
                console.log("Autosaving Sintese Analitica...", data);
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

    function getRiskColorClass(cor: string) {
        switch (cor) {
            case "Verde":
                return "bg-[#d9f2d0] text-[#154412] border-[#154412]";
            case "Aviso": // Amarelo
                return "bg-[#fafafe] text-[#696906] border-[#696906]";
            case "Vermelho":
                return "bg-[#fce1dc] text-[#842826] border-[#842826]";
            default:
                return "bg-gray-100 text-gray-500 border-gray-300";
        }
    }
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

    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Síntese Analítica</h2>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                        >
                            Unidade Analítica
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                        >
                            Avaliação de riscos e vulnerabilidades - ARV
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                        >
                            Plano de prevenção da vitimização - PPV
                        </th>
                        <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                        >
                            Data de Vencimento
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each data as item}
                        <tr>
                            <td
                                class="px-6 py-4 whitespace-normal align-middle w-1/4"
                            >
                                <div
                                    class="w-full min-h-[57px] flex items-center justify-center text-center p-2 rounded-[10px] border border-[#6A7A7F] text-lg font-normal text-black bg-white"
                                >
                                    {item.UnidadeAnalitica}
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-normal align-middle w-1/3"
                            >
                                <!-- Automatic Risk Display (Read-only) -->
                                <div class="relative">
                                    <div
                                        class="w-full min-h-[57px] flex items-center justify-center text-center p-2 rounded-[10px] border text-sm font-semibold transition-colors duration-300 {getRiskColorClass(
                                            item.Cor,
                                        )}"
                                    >
                                        {item.AvaliacaoDeRiscos || "-"}
                                    </div>
                                    <p
                                        class="text-xs text-gray-500 mt-1 text-center italic"
                                    >
                                        Calculado automaticamente
                                    </p>
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-normal align-middle"
                            >
                                <textarea
                                    class="shadow-sm focus:ring-save-primary focus:border-save-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    rows="3"
                                    bind:value={item.PlanoDePrevencao}
                                    on:input={autosave}
                                ></textarea>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-normal align-middle"
                            >
                                <input
                                    type="date"
                                    class="shadow-sm focus:ring-save-primary focus:border-save-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    bind:value={item.DataVencimento}
                                    on:input={autosave}
                                />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
