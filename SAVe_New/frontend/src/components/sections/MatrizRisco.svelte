<script lang="ts">
    import { onMount } from "svelte";

    export let caseId: string;
    export let isArchived: boolean = false;
    export let caseData: any = null;

    let scores: Record<string, number> = {
        VEV: 0,
        GFVS: 0,
        EQ: 0,
        SLE: 0,
        SHT: 0,
        SS: 0,
        DJ: 0,
        PS: 0,
    };

    // Helper to calculate age from DD/MM/YYYY string
    function calculateAge(dateStr: string): number {
        if (!dateStr) return 0;
        const parts = dateStr.split("/");
        if (parts.length !== 3) return 0;
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
        const keys = path.split(".");
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) return defaultValue;
            result = result[key];
        }
        return result === undefined ? defaultValue : result;
    }

    // Reactive statement to calculate risks whenever caseData changes
    $: if (caseData) {
        calculateRisks();
    }

    function calculateRisks() {
        if (!caseData) return;

        const ident = caseData.identificacao || {};
        const vinculos = caseData.vinculos || {};
        const etr = caseData.ensinoTrabRenda || {};
        const ht = caseData.habitacaoTerritorio || {};
        const saude = caseData.saude || {};
        const sj = caseData.situacaoJuridica || {};
        const sj2 = caseData.situacaoJuridica2 || {};
        const ps = caseData.protecaoSeguranca || {};

        const age = calculateAge(ident.Data_nascimento);

        // --- VEV: Vítima de especial vulnerabilidade ---
        const vev_high =
            (get(vinculos, "Alt_Fam_Com_Vitim") === "Sim" ||
                (get(vinculos, "Vulnerab_Vinculos_Fam") === "Sim" &&
                    (get(ident, "PPS_Sexo") !== "Masculino" ||
                        age < 18 ||
                        age > 60 ||
                        get(ident, "PPS_idgenero") !== "Homem cisgênero" ||
                        get(ident, "PPS_orientacao_sexual") !==
                            "Heterossexual"))) &&
            caseData.identificacao &&
            caseData.vinculos;

        const vev_low =
            ((get(ident, "PPS_Sexo") === "Masculino" &&
                age > 18 &&
                age < 60 &&
                get(ident, "PPS_idgenero") === "Homem cisgênero" &&
                get(ident, "PPS_orientacao_sexual") === "Heterossexual") ||
                !caseData.identificacao) &&
            !vev_high;

        if (vev_high) scores.VEV = 3;
        else if (vev_low) scores.VEV = 1;
        else scores.VEV = 2;

        // --- GFVS: Grupo familiar e vínculos sociais ---
        const gfvs_high = get(vinculos, "Alt_Fam_Com_Vitim") === "Sim";
        const gfvs_med =
            get(vinculos, "Alt_Fam_Com_Vitim") === "Não" &&
            get(vinculos, "Vulnerab_Vinculos_Fam") === "Sim";
        const gfvs_low =
            !gfvs_med && !gfvs_high && get(vinculos, "Alt_Fam_Com_Vitim");

        if (gfvs_high) scores.GFVS = 3;
        else if (gfvs_med) scores.GFVS = 2;
        else if (gfvs_low) scores.GFVS = 1;

        // --- EQ: Escolaridade/qualificação ---
        const escolaridade = get(etr, "Grau_escolaridade");
        const eq_high = [
            "Analfabeto Funcional",
            "Analfabeto",
            "E. Fund. Incompleto",
        ].includes(escolaridade);
        const eq_med = ["E. Fund. Completo", "E. Médio Incompleto"].includes(
            escolaridade,
        );
        const eq_low = !eq_med && !eq_high && escolaridade;

        if (eq_high) scores.EQ = 3;
        else if (eq_med) scores.EQ = 2;
        else if (eq_low) scores.EQ = 1;

        // --- SLE: Situação laboral e econômica ---
        const sitTrab = get(etr, "Situacao_trabalho");
        const afastado = get(etr, "Esta_Afastado");
        const renda = get(etr, "Valor_renda");

        const sle_high =
            ["Desempregado/a", "Inativo/a", "Aposentado/a"].includes(sitTrab) ||
            afastado === "Afastamento Médico" ||
            renda === "Menos de um salário mínimo";

        const sle_med =
            ([
                "Estudante/Mestrando/Doutorando/Bolsista",
                "Trabalhador/a informal",
            ].includes(sitTrab) ||
                afastado === "Afastamento por Motivo Pessoal ou Profissional" ||
                [
                    "de 1 a 2 salários mínimos",
                    "de 2 a 5 salários mínimos",
                ].includes(renda)) &&
            !sle_high;

        const sle_low = !sle_med && !sle_high && sitTrab;

        if (sle_high) scores.SLE = 3;
        else if (sle_med) scores.SLE = 2;
        else if (sle_low) scores.SLE = 1;

        // --- SHT: Situação habitacional e território ---
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
            (get(ht, "Moradia_Irregular") === true || matPred === "Madeira") &&
            !sht_high;

        const sht_low =
            get(ht, "Moradia_regular") === true && !sht_med && !sht_high;

        if (sht_high) scores.SHT = 3;
        else if (sht_med) scores.SHT = 2;
        else if (sht_low) scores.SHT = 1;

        // --- SS: Situação de saúde ---
        const ss_high =
            get(saude, "HS_Condicao_saude_acompanhamento") === "Não" ||
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

        const ss_low = !ss_med && !ss_high && caseData.saude;

        if (ss_high) scores.SS = 3;
        else if (ss_med) scores.SS = 2;
        else if (ss_low) scores.SS = 1;

        // --- DJ: Demandas jurídicas ---
        const dj_high =
            get(vinculos, "Vulnerab_Vitim_Sec_Ter") === "Sim" ||
            get(sj2, "SJ2_Demanda_Justica_Diligencia") === true ||
            get(sj2, "SJ2_Demanda_Protecao_Nao_Revitimizacao") === true;

        const dj_med =
            (get(sj2, "SJ2_Demanda_Memoria_Verdade") === true ||
                get(sj2, "SJ2_Demanda_Apoio_Assistencia") === true ||
                get(sj2, "SJ2_Demanda_Seguranca") === true ||
                get(sj2, "SJ2_Demanda_Protecao_Psicologica") === true ||
                get(sj2, "SJ2_Demanda_Protecao_Documental") === true ||
                get(sj2, "SJ2_Demanda_Compensacao_Reparacao") === true ||
                get(sj2, "SJ2_Demanda_Tratamento_Digno") === true) &&
            !dj_high;

        const dj_low =
            !dj_med && !dj_high && get(vinculos, "Vulnerab_Vitim_Sec_Ter");

        if (dj_high) scores.DJ = 3;
        else if (dj_med) scores.DJ = 2;
        else if (dj_low) scores.DJ = 1;

        // --- PS: Proteção e segurança ---
        const ps_high = get(ps, "PS_Situacao_ameaca_relat") === "Sim";
        const ps_low =
            get(ps, "PS_Situacao_ameaca_relat") === "Não" && !ps_high;

        if (ps_high) scores.PS = 3;
        else if (ps_low) scores.PS = 1;
        else if (scores.PS !== 2) scores.PS = 0;

        scores = { ...scores };
    }

    const rows = [
        {
            id: "VEV",
            label: "Vítima de especial vulnerabilidade",
            low: "Não pertence a grupos vulneráveis",
            med: "Pertence a grupos vulneráveis, mas com apoio",
            high: "Pertence a grupos vulneráveis sem apoio",
            obs: "Crianças, idosos, PCDs, LGBTQIA+, etc.",
        },
        {
            id: "GFVS",
            label: "Grupo familiar e vínculos sociais",
            low: "Rede de apoio funcional",
            med: "Rede de apoio frágil e instável",
            high: "Isolamento social, rompimento familiar",
            obs: "Avaliar apoio familiar e comunitário",
        },
        {
            id: "EQ",
            label: "Escolaridade/qualificação",
            low: "Ensino médio completo ou superior",
            med: "Ensino fundamental completo ou médio incompleto",
            high: "Analfabetismo ou nenhuma qualificação",
            obs: "Impacto na autonomia econômica",
        },
        {
            id: "SLE",
            label: "Situação laboral e econômica",
            low: "Emprego formal estável",
            med: "Trabalho informal ou desemprego eventual",
            high: "Desemprego crônico, renda insuficiente",
            obs: "Avaliar programas de inclusão econômica",
        },
        {
            id: "SHT",
            label: "Situação habitacional e território",
            low: "Moradia segura em local adequado",
            med: "Moradia precária em área urbana de risco",
            high: "Sem moradia fixa ou em área de risco grave",
            obs: "Avaliar riscos ambientais e habitacionais",
        },
        {
            id: "SS",
            label: "Situação de saúde",
            low: "Saúde estável, acesso regular a cuidados",
            med: "Doenças crônicas controladas",
            high: "Doenças graves sem acompanhamento",
            obs: "Necessidade de suporte médico contínuo",
        },
        {
            id: "DJ",
            label: "Demandas jurídicas",
            low: "Sem pendências jurídicas",
            med: "Questões jurídicas em andamento",
            high: "Sem documentação ou litígios complexos",
            obs: "Necessidade de assistência jurídica",
        },
        {
            id: "PS",
            label: "Proteção e segurança",
            low: "Não há ameaças diretas",
            med: "Ameaças ocasionais",
            high: "Ameaça iminente à integridade física",
            obs: "Acesso a medidas protetivas e segurança",
        },
    ];

    function setScore(rowId: string, score: number) {
        scores[rowId] = score;
        scores = { ...scores };
    }
</script>

<div class="bg-white rounded-lg shadow-md p-4">
    <div class="mb-4">
        <h2 class="text-xl font-bold text-[#00126b]">
            Matriz de Risco para Avaliação de Vulnerabilidades
        </h2>
    </div>

    <div class="overflow-x-auto">
        <!-- Use border-spacing-x to create vertical gaps between columns -->
        <table
            class="w-full border-separate border-spacing-x-2 border-spacing-y-0"
        >
            <thead>
                <tr>
                    <th class="p-0 pb-2">
                        <div
                            class="bg-[#ebeef0] text-[#353d3f] font-bold text-center py-3 rounded-t-lg shadow-sm h-full flex items-center justify-center"
                        >
                            Unidade Analítica
                        </div>
                    </th>
                    <th class="p-0 pb-2 w-1/4">
                        <div
                            class="bg-[#d9f2d0] text-[#154412] font-bold text-center py-3 rounded-t-lg shadow-sm h-full flex items-center justify-center"
                        >
                            Baixo Risco (1)
                        </div>
                    </th>
                    <th class="p-0 pb-2 w-1/4">
                        <div
                            class="bg-[#fafafe] text-[#696906] font-bold text-center py-3 rounded-t-lg shadow-sm h-full flex items-center justify-center"
                        >
                            Médio Risco (2)
                        </div>
                    </th>
                    <th class="p-0 pb-2 w-1/4">
                        <div
                            class="bg-[#fce1dc] text-[#842826] font-bold text-center py-3 rounded-t-lg shadow-sm h-full flex items-center justify-center"
                        >
                            Alto Risco (3)
                        </div>
                    </th>
                    <th class="p-0 pb-2 w-1/5">
                        <div
                            class="bg-[#e1eefc] text-[#0c3b5e] font-bold text-center py-3 rounded-t-lg shadow-sm h-full flex items-center justify-center"
                        >
                            Observações/Intervenções
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each rows as row, i}
                    <tr class="group">
                        <!-- Unit Label -->
                        <td
                            class="p-2 align-middle bg-[#f7fafc] border-b border-gray-100 {i ===
                            rows.length - 1
                                ? 'rounded-b-lg border-b-0'
                                : ''}"
                        >
                            <div
                                class="flex items-center justify-center h-full text-center font-bold text-[#353d3f] text-sm"
                            >
                                {row.label}
                            </div>
                        </td>

                        <!-- Low Risk -->
                        <td
                            class="p-2 bg-[#fbfffa] border-b border-gray-100 {i ===
                            rows.length - 1
                                ? 'rounded-b-lg border-b-0'
                                : ''}"
                        >
                            <div
                                class="flex items-center gap-3 p-2 rounded-lg border border-transparent transition-all h-full pointer-events-none"
                            >
                                <div
                                    class="w-5 h-5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center transition-colors
                         {scores[row.id] === 1
                                        ? 'bg-[#4caf50] border-[#4caf50]'
                                        : 'border-gray-300 bg-white'}"
                                >
                                    {#if scores[row.id] === 1}
                                        <span
                                            class="material-icons text-white text-xs font-bold"
                                            >check</span
                                        >
                                    {/if}
                                </div>
                                <span
                                    class="text-xs text-gray-700 font-medium leading-tight"
                                    >{row.low}</span
                                >
                            </div>
                        </td>

                        <!-- Medium Risk -->
                        <td
                            class="p-2 bg-[#f7f7f0] border-b border-gray-100 {i ===
                            rows.length - 1
                                ? 'rounded-b-lg border-b-0'
                                : ''}"
                        >
                            <div
                                class="flex items-center gap-3 p-2 rounded-lg border border-transparent transition-all h-full pointer-events-none"
                            >
                                <div
                                    class="w-5 h-5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center transition-colors
                         {scores[row.id] === 2
                                        ? 'bg-[#fbc02d] border-[#fbc02d]'
                                        : 'border-gray-300 bg-white'}"
                                >
                                    {#if scores[row.id] === 2}
                                        <span
                                            class="material-icons text-white text-xs font-bold"
                                            >check</span
                                        >
                                    {/if}
                                </div>
                                <span
                                    class="text-xs text-gray-700 font-medium leading-tight"
                                    >{row.med}</span
                                >
                            </div>
                        </td>

                        <!-- High Risk -->
                        <td
                            class="p-2 bg-[#f7f3f2] border-b border-gray-100 {i ===
                            rows.length - 1
                                ? 'rounded-b-lg border-b-0'
                                : ''}"
                        >
                            <div
                                class="flex items-center gap-3 p-2 rounded-lg border border-transparent transition-all h-full pointer-events-none"
                            >
                                <div
                                    class="w-5 h-5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center transition-colors
                         {scores[row.id] === 3
                                        ? 'bg-[#f44336] border-[#f44336]'
                                        : 'border-gray-300 bg-white'}"
                                >
                                    {#if scores[row.id] === 3}
                                        <span
                                            class="material-icons text-white text-xs font-bold"
                                            >check</span
                                        >
                                    {/if}
                                </div>
                                <span
                                    class="text-xs text-gray-700 font-medium leading-tight"
                                    >{row.high}</span
                                >
                            </div>
                        </td>

                        <!-- Observations -->
                        <td
                            class="p-2 align-middle bg-[#f7fbff] border-b border-gray-100 {i ===
                            rows.length - 1
                                ? 'rounded-b-lg border-b-0'
                                : ''}"
                        >
                            <div
                                class="text-center text-xs text-gray-600 font-medium"
                            >
                                {row.obs}
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="mt-4 pt-2 border-t border-gray-100">
        <p class="text-sm text-gray-600 font-bold">
            Obs: Atribuir uma pontuação de 1 (baixo risco), 2 (médio risco) ou 3
            (alto risco) para cada critério.
        </p>
    </div>
</div>
