<script lang="ts">
    export let caseId: string = "";
    export let caseData: any = undefined;

    // Silence unused warning
    $: _ = { caseId, caseData };

    const referencias = [
        {
            descricao: "Guia Metodológico PAV",
            url: "https://www.mpmg.mp.br/data/files/33/75/B0/3E/C178391041383A19760849A8/Guia%20Metodologico%20Casa%20Lilian.pdf",
        },
        {
            descricao: "Protocolo PAV",
            url: "https://www.mpmg.mp.br/data/files/33/75/B0/3E/C178391041383A19760849A8/Guia%20Metodologico%20Casa%20Lilian.pdf",
        },
        {
            descricao: "Resolução 243/2021 do CNMP",
            url: "https://www.cnmp.mp.br/portal/atos-e-normas/norma/8398/",
        },
        {
            descricao:
                "Domestic Abuse; Stalking and Harassment and Honour Based Violence (DASH 2009-2024) Risk Identification and Assessment and Management Model",
            url: "https://static1.squarespace.com/static/63585aa01220164be2e387b2/t/65a82ce5e47f867b140872ed/1705520358604/DASH+2009+2024.pdf",
        },
        {
            descricao:
                "MANUAL DE SEGURANÇA: MEDIDAS PRÁTICAS PARA DEFENSORES DOS DIREITOS HUMANOS EM RISCO",
            url: "https://www.frontlinedefenders.org/sites/default/files/workbook_portuguese_0_copy.pdf",
        },
        {
            descricao: "FRIDA",
            url: "https://www.gov.br/mdh/pt-br/centrais-de-conteudo/ligue-180/FormulrioFRIDA.pdf/view",
        },
        {
            descricao: "Rogéria",
            url: "https://www.cnj.jus.br/wp-content/uploads/2024/10/formulario-rogeria-18-10-24.pdf",
        },
        {
            descricao:
                "Avaliação e Gestão de Risco em Rede Manual para profissionais",
            url: "https://www.pgdlisboa.pt/docpgd/files/1436798180_gestao_risco_emar.pdf",
        },
        {
            descricao: "Insegurança Alimentar e Nutricional",
            url: "https://www.gov.br/saude/pt-br/assuntos/saude-brasil/glossario/inseguranca-alimentar-e-nutricional",
        },
        {
            descricao:
                "ROTEIRO PARA UTILIZAÇÃO DA ESCALA DE VULNERABILIDADE FAMILIAR (EVFAM-BR)",
            url: "https://www.planificasus.com.br/arquivo-download.php?hash=48c3191b70c9ff22b8b336331fa417eaf87d366d&t=1692220483&type=biblioteca&utm_source=chatgpt.com",
        },
        {
            descricao:
                "Modelo para Avaliação dos Riscos Psicossociais e de Violência - NOTA TÉCNICA Nº 67/2021-CGMAD/DAPES/SAPS/MS",
            url: "https://egestorab.saude.gov.br/image/?file=20211216_N_InstrumentoparaAvaliacaodoRiscosPsicossociaisedeViolencia-pacientesforenses-inclusaoemSRT_7107186306922612782.pdf&utm_source=chatgpt.com",
        },
        {
            descricao: "Cartilha CNJ",
            url: "https://www.cnj.jus.br/wp-content/uploads/2023/12/cartilha-vitimas-de-crimes-digital.pdf",
        },
    ];
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <div class="mb-6 border-b pb-4">
        <h2 class="text-2xl font-bold text-gray-800">Referências</h2>
        <p class="text-gray-500 mt-1">
            Links úteis e documentos de referência.
        </p>
    </div>

    <div class="grid grid-cols-1 gap-4">
        {#each referencias as ref}
            <div
                class="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
            >
                <div class="flex items-center">
                    <span
                        class="material-icons text-save-primary mr-3 group-hover:scale-110 transition-transform"
                    >
                        {ref.url ? "link" : "description"}
                    </span>
                    <span class="font-medium text-gray-700"
                        >{ref.descricao}</span
                    >
                </div>
                {#if ref.url}
                    <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-save-primary hover:text-save-secondary font-medium text-sm flex items-center"
                    >
                        Acessar
                        <span class="material-icons text-sm ml-1"
                            >open_in_new</span
                        >
                    </a>
                {:else}
                    <span class="text-gray-400 text-sm italic"
                        >Link indisponível</span
                    >
                {/if}
            </div>
        {/each}
    </div>
</div>
