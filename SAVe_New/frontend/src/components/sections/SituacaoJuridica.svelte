<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data = {
        SJ_IP_PCNet: "",
        SJ_Auto_Judicial: "",
        SJ_Num_MPMG: "",
        SJ_IP_PCNet_Classe_Tipo: "",
        SJ_Auto_Judicial_Classe_Tipo: "",
        SJ_Num_MPMG_Tipo: "",
        SJ_REDS_Classe_Tipo: "",
        SJ_Obs_Documentacao: "",
        SJ_Medidas_Prot_Cautelar: "Não",
        SJ_REDS: "",
        SJ_Num_Processo: "",
        SJ_Vitima_Intimada: "Não",
        SJ_Agressor_Intimado: "Não",
        SJ_Compartilhado_Rede: "Não",
        SJ_Relato_Descumprimento: "Não",
        SJ_Descumprimento_Especif: "",
        SJ_Autor_Maior_18: "Sim",
        SJ_Promotoria: "",
        SJ_Delegacia: "",
        SJ_Servidor_Referencia: "",
        SJ_Promotor: "",
        SJ_Delegado: "",
        SJ_Juiz: "",
        SJ_Orgao_Julgador: "",
        SJ_Contato_Promotor: "",
        SJ_Contato_Delegado: "",
        SJ_Contato_Juiz: "",
        SJ_Tipo_Penal_Fatos: "",
        SJ_Tipo_Penal_Autuacao_IP: "",
        SJ_Tipo_Penal_Conclusao_IP: "",
        SJ_Tipo_Penal_Denuncia_Repres: "",
        SJ_Tipo_Penal_Audiencia: "",
        SJ_Tipo_Penal_Sentenca: "",
        SJ_Tipo_Penal_Transito_Julgado: "",
        SJ_Data_Fatos: "",
        SJ_Data_Autuacao_IP: "",
        SJ_Data_Conclusao_IP: "",
        SJ_Data_Denuncia_Repres: "",
        SJ_Data_Audiencia: "",
        SJ_Data_Sentenca: "",
        SJ_Data_Transito_Julgado: "",
        SJ_Hora_Crime: "",
        SJ_Dia_Semana: "",
        SJ_Local_Crime: "",
        SJ_Local_Crime_Especif: "",
        SJ_Obs_Crime: "",
        SJ_Fase_Persecucao_Penal: "",
        SJ_Fase_Judicial_Especif: "",
        SJ_Status_Juridico_Autor: "",
    };

    let situacaoJuridica2: any = {
        ID_Caso: 0,
        SJ2_Resultado_Julgamento: "",
        SJ2_Tempo_Pena: "",
        SJ2_Inicio_Cumprimento: "",
        SJ2_Regime: "",
        SJ2_Apuracao_Investigacao: "Não",
        SJ2_Apuracao_Invest_Especif: "",
        SJ2_Pedido_Reparacao_Denuncia: "Não",
        SJ2_Tipo_Danos: "",
        SJ2_Tipo_Danos_Especif: "",
        SJ2_Condenacao_Reparacao: "Não",
        SJ2_Condenacao_Repar_Especif: "",
        SJ2_Demanda_Info_Participacao: false,
        SJ2_Demanda_Info_Participacao_Especif: "",
        SJ2_Demanda_Info_Participacao_Especif2: "",
        SJ2_Demanda_Memoria_Verdade: false,
        SJ2_Demanda_Memoria_Verdade_Especif: "",
        SJ2_Demanda_Memoria_Verdade_Especif2: "",
        SJ2_Demanda_Justica_Diligencia: false,
        SJ2_Demanda_Justica_Diligencia_Especif: "",
        SJ2_Demanda_Justica_Diligencia_Especif2: "",
        SJ2_Demanda_Apoio_Assistencia: false,
        SJ2_Demanda_Apoio_Assistencia_Especif: "",
        SJ2_Demanda_Apoio_Assistencia_Especif2: "",
        SJ2_Demanda_Seguranca: false,
        SJ2_Demanda_Seguranca_Especif: "",
        SJ2_Demanda_Seguranca_Especif2: "",
        SJ2_Demanda_Protecao_Nao_Revitimizacao: false,
        SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif: "",
        SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2: "",
        SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif: "",
        SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2: "",
        SJ2_Demanda_Protecao_Psicologica: false,
        SJ2_Demanda_Protecao_Psicologica_Especif: "",
        SJ2_Demanda_Protecao_Psicologica_Especif2: "",
        SJ2_Demanda_Protecao_Documental: false,
        SJ2_Demanda_Protecao_Documental_Especif: "",
        SJ2_Demanda_Protecao_Documental_Especif2: "",
        SJ2_Demanda_Compensacao_Reparacao: false,
        SJ2_Demanda_Compensacao_Reparacao_Especif: "",
        SJ2_Demanda_Compensacao_Reparacao_Especif2: "",
        SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma: "",
        SJ2_Demanda_Tratamento_Digno: false,
        SJ2_Demanda_Tratamento_Digno_Especif: "",
        SJ2_Demanda_Tratamento_Digno_OutraForma: "",
    };

    let loading = true;
    let saving = false;
    let saveStatus = "";
    let lastSavedData = "";
    let saveTimeout: any;
    let processos: any[] = [];

    onMount(async () => {
        await loadData();
    });

    async function loadData() {
        try {
            loading = true;

            // Load situacao-juridica (and processos)
            try {
                const res1 = await api.get(
                    `/cases/${caseId}/situacao-juridica`,
                );
                if (res1.data) {
                    data = { ...data, ...res1.data.SAVe_Situacao_Juridica };
                    if (res1.data.processos) {
                        processos = res1.data.processos;
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.log(
                        "Situacao Juridica not found (404), assuming new record.",
                    );
                } else {
                    console.error("Error loading situacao-juridica:", error);
                }
            }

            // Load situacao-juridica-2
            try {
                const res2 = await api.get(
                    `/cases/${caseId}/situacao-juridica-2`,
                );
                if (res2.data) {
                    situacaoJuridica2 = { ...situacaoJuridica2, ...res2.data };
                }
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    console.log(
                        "Situacao Juridica 2 not found (404), assuming new record.",
                    );
                } else {
                    console.error("Error loading situacao-juridica-2:", error);
                }
            }

            lastSavedData = JSON.stringify({
                data,
                situacaoJuridica2,
                processos,
            });
        } finally {
            loading = false;
        }
    }

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify({
            data,
            situacaoJuridica2,
            processos,
        });
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;
        saveStatus = "";

        saveTimeout = setTimeout(async () => {
            try {
                await Promise.all([
                    api.put(`/cases/${caseId}/situacao-juridica`, {
                        ...data,
                        processos: processos,
                    }),
                    api.put(
                        `/cases/${caseId}/situacao-juridica-2`,
                        situacaoJuridica2,
                    ),
                ]);

                lastSavedData = currentData;
                saveStatus = "Salvo! ✅";
                setTimeout(() => (saveStatus = ""), 2000);
                console.log("Autosaved SituacaoJuridica");
            } catch (error) {
                console.error("Error autosaving:", error);
                saveStatus = "Erro ao salvar ❌";
            } finally {
                saving = false;
            }
        }, 2000);
    }

    function manualSave() {
        if (loading || saving) return;
        autosave();
    }

    function handlePhaseChange() {
        if (data.SJ_Fase_Persecucao_Penal !== judicialLabel) {
            data.SJ_Fase_Judicial_Especif = "";
        }
        autosave();
    }

    const judicialLabel = "Fase Judicial (Processo)";
    const judicialOptions = [
        "Ação Penal Privada",
        "Ação Penal Pública Condicionada",
        "Ação Penal Pública Incondicionada",
    ];

    const labelPrisaoAdvertencia = "Prisão domiciliar";
    const labelPresoObrigacao = "Preso (provisório ou condenado)";
    const labelLiberdadePrestacao = "Liberdade provisória (com ou sem fiança)";
    const labelCumprimentoLiberdade =
        "Cumprimento de pena em liberdade (aberto, livramento condicional)";
    const labelMortoSemiliberdade = "Morto (extinção da punibilidade)";

    const labelMedidaSeguranca = "Medida de Segurança";
    const labelPrescricaoImprocedencia = "Prescrição/Decadência";
    const labelCondenacaoArquivamento = "Condenação";

    const labelTempoPena = "Tempo de pena:";
    const labelInicioCumprimento = "Início do cumprimento:";
    const labelRegime = "Regime:";

    const regimeOptions = ["Fechado", "Semiaberto", "Aberto"];

    function addProcesso() {
        processos = [...processos, { SJIP_Numero: "", SJIP_Classe_Tipo: "" }];
        autosave();
    }

    function removeProcesso(index: number) {
        processos = processos.filter((_, i) => i !== index);
        autosave();
    }

    $: compensacaoOptions = (() => {
        switch (situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif) {
            case "Restituição":
                return [
                    "Bens",
                    "Liberdade",
                    "Terras",
                    "Residência",
                    "Reitegração ao emprego",
                    "Localização de corpo",
                    "Outras restituições",
                ];
            case "Compensação":
                return [
                    "Impactos na saúde física e motora",
                    "Impactos na saúde mental",
                    "Perdas profissionais e educacionais",
                    "Danos morais",
                    "Despesas de ordem assistência Jurídica, médicas e psicológicas",
                ];
            case "Reabilitação":
                return [
                    "Inclusão no Sistema Assistencial",
                    "Benefícios Socioassistencias",
                    "Outras formas de reabilitação",
                ];
            case "Satisfação":
                return [
                    "Declaração oficial ou judicial",
                    "Sanções judiciais ou administrativas",
                    "Outras formas de satisfação",
                ];
            case "Pensão":
                return [
                    "Pensão por fato criminoso",
                    "Pensão por feminicídio",
                    "outras formas de satisfação",
                ];
            default:
                return [];
        }
    })();

    $: cautelaresOptions = (() => {
        if (
            situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif ===
            "Medidas Cautelares"
        ) {
            return [
                "Comparecimento periódico em juízo, no prazo e nas condições fixadas pelo juiz, para informar e justificar atividades",
                "Proibição de acesso ou frequência a determinados lugares quando, por circunstâncias relacionadas ao fato, deva o indiciado ou acusado permanecer distante desses locais para evitar o risco de novas infrações",
                "Proibição de manter contato com pessoa determinada quando, por circunstâncias relacionadas ao fato, deva o indiciado ou acusado dela permanecer distante",
                "Proibição de ausentar-se da Comarca quando a permanência seja conveniente ou necessária para a investigação ou instrução ",
                "Recolhimento domiciliar no período noturno e nos dias de folga quando o investigado ou acusado tenha residência e trabalho fixos",
                "Suspensão do exercício de função pública ou de atividade de natureza econômica ou financeira quando houver justo receio de sua utilização para a prática de infrações penais",
                "Internação provisória do acusado nas hipóteses de crimes praticados com violência ou grave ameaça, quando os peritos concluírem ser inimputável ou semi-imputável (art. 26 do Código Penal) e houver risco de reiteração",
                "Fiança, nas infrações que a admitem, para assegurar o comparecimento a atos do processo, evitar a obstrução do seu andamento ou em caso de resistência injustificada à ordem judicial",
                "Monitoração eletrônica",
                "Prisão",
                "Outras medidas cautelares",
            ];
        }

        switch (
            situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif
        ) {
            case "Medidas Protetivas de Urgência que obrigam o agressor":
                return [
                    "Suspensão da posse ou restrição do porte de armas, com comunicação ao órgão competente",
                    "Afastamento do lar, domicílio ou local de convivência com a ofendida",
                    "Proibição de aproximação da ofendida, de seus familiares e das testemunhas, fixando o limite mínimo de distância entre estes e o agressor",
                    "Proibição de contato com a ofendida, seus familiares e testemunhas por qualquer meio de comunicação",
                    "Proibição de freqüentação de determinados lugares a fim de preservar a integridade física e psicológica da ofendida",
                    "Restrição ou suspensão de visitas aos dependentes menores, ouvida a equipe de atendimento multidisciplinar ou serviço similar",
                    "Prestação de alimentos provisionais ou provisórios",
                    "Comparecimento do agressor a programas de recuperação e reeducação",
                    "acompanhamento psicossocial do agressor, por meio de atendimento individual e/ou em grupo de apoio.",
                    "Outras Medidas Protetivas de Urgência que obrigam o agressor",
                ];
            case "Medidas Protetivas de Urgência à Ofendida":
                return [
                    "Encaminhar a ofendida e seus dependentes a programa oficial ou comunitário de proteção ou de atendimento",
                    "Recondução da ofendida e a de seus dependentes ao respectivo domicílio, após afastamento do agressor",
                    "Afastamento da ofendida do lar, sem prejuízo dos direitos relativos a bens, guarda dos filhos e alimentos",
                    "Separação de corpos",
                    "Matrícula dos dependentes da ofendida em instituição de educação básica mais próxima do seu domicílio, ou a transferência deles para essa instituição, independentemente da existência de vaga",
                    "Auxílio-aluguel, com valor fixado em função de sua situação de vulnerabilidade social e econômica, por período não superior a 6 (seis) meses",
                    "Outros",
                ];
            case "Proteção patrimonial":
                return [
                    "Restituição de bens indevidamente subtraídos pelo agressor à vítima",
                    "Proibição temporária para a celebração de atos e contratos de compra, venda e locação de propriedade em comum, salvo expressa autorização judicial",
                    "Suspensão das procurações conferidas pela vítima ao agressor",
                    "Prestação de caução provisória, mediante depósito judicial, por perdas e danos materiais decorrentes da prática de violência contra à vítima",
                    "Outros",
                ];
            default:
                return [];
        }
    })();
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

    {#if loading}
        <div class="flex justify-center items-center h-64">
            <p class="text-gray-500 text-lg">Carregando...</p>
        </div>
    {:else}
        <!-- Main Container -->
        <div class="border-2 border-gray-200 rounded-lg p-4 bg-white relative">
            <!-- Top Section: Autor Maior de 18 -->
            <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-800 mb-2"
                    >O autor é maior de 18 anos?</label
                >
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Autor_Maior_18}
                            value="Sim"
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Autor_Maior_18}
                            value="Não"
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="space-y-6">
                    <!-- REDS -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >REDS:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_REDS}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Classe/tipo:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_REDS_Classe_Tipo}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- IP - PCNet -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >IP - PCNet:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_IP_PCNet}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Classe/tipo:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_IP_PCNet_Classe_Tipo}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Auto Judicial -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Auto Judicial (Principal):</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Auto_Judicial}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Classe/tipo:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Auto_Judicial_Classe_Tipo}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Nº do MPMG -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Nº do MPMG:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Num_MPMG}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Classe/tipo:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Num_MPMG_Tipo}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Outros Processos -->
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label
                                class="block text-sm font-semibold text-gray-600"
                                >Outros processos:</label
                            >
                            <button
                                on:click={addProcesso}
                                class="bg-save-primary text-white px-3 py-1 rounded text-xs hover:bg-save-secondary transition-colors"
                                >Incluir processo</button
                            >
                        </div>
                        <div class="space-y-2">
                            {#each processos as processo, i}
                                <div
                                    class="flex gap-2 items-center bg-gray-50 p-2 rounded border"
                                >
                                    <div class="flex-1">
                                        <label
                                            class="block text-xs font-semibold text-gray-800"
                                            >Número:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={processo.SJIP_Numero}
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        />
                                    </div>
                                    <div class="flex-1">
                                        <label
                                            class="block text-xs font-semibold text-gray-800"
                                            >Classe/tipo:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                processo.SJIP_Classe_Tipo
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        />
                                    </div>
                                    <button
                                        on:click={() => removeProcesso(i)}
                                        class="text-red-500 hover:text-red-700 self-end mb-1"
                                    >
                                        <span class="material-icons">close</span
                                        >
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <!-- Observações -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Observações sobre a documentação processual:</label
                        >
                        <textarea
                            bind:value={data.SJ_Obs_Documentacao}
                            on:blur={autosave}
                            rows="4"
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        ></textarea>
                    </div>

                    <!-- Medidas Protetivas -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-2"
                                >Há Medidas Protetiva/Cautelar?</label
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.SJ_Medidas_Prot_Cautelar
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.SJ_Medidas_Prot_Cautelar
                                        }
                                        value="Não"
                                        on:change={() => {
                                            data.SJ_Relato_Descumprimento =
                                                "Não";
                                            data.SJ_Descumprimento_Especif = "";
                                            autosave();
                                        }}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.SJ_Medidas_Prot_Cautelar = "";
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

                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-2"
                                >Há relato de descumprimento?</label
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.SJ_Relato_Descumprimento
                                        }
                                        value="Sim"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={
                                            data.SJ_Relato_Descumprimento
                                        }
                                        value="Não"
                                        on:change={() => {
                                            data.SJ_Descumprimento_Especif = "";
                                            autosave();
                                        }}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                                <button
                                    type="button"
                                    class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                    on:click={() => {
                                        data.SJ_Relato_Descumprimento = "";
                                        data.SJ_Descumprimento_Especif = "";
                                        autosave();
                                    }}
                                    title="Limpar seleção"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            </div>
                            {#if data.SJ_Relato_Descumprimento === "Sim"}
                                <div class="mt-2">
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <input
                                        type="text"
                                        bind:value={
                                            data.SJ_Descumprimento_Especif
                                        }
                                        on:blur={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    />
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Container 2: Dados Judiciários e Policiais -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Column 1 -->
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Órgão Julgador:</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Orgao_Julgador}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Promotoria:</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Promotoria}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Delegacia:</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Delegacia}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Servidor de referência:</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Servidor_Referencia}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                </div>

                <!-- Column 2 -->
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Juíz(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Juiz}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Promotor(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Promotor}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Delegado(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Delegado}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                </div>

                <!-- Column 3 -->
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Contato do(a) Juíz(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Contato_Juiz}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Contato do(a) Promotor(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Contato_Promotor}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Contato do(a) Delegado(a):</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Contato_Delegado}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Container 3: Datas, Tipos Penais e Detalhes do Crime -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column (Dates & Types) - Spans 2 columns -->
                <div class="lg:col-span-2 space-y-4">
                    <!-- Data dos Fatos -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data dos fatos:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Fatos}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Fatos}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data da Autuação do IP -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data da autuação do IP:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Autuacao_IP}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Autuacao_IP}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data da Conclusão do IP -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data da conclusão do IP:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Conclusao_IP}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Conclusao_IP}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data da Denúncia/Representação -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data da denúncia/representação:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Denuncia_Repres}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Denuncia_Repres}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data da Audiência -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data da audiência:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Audiencia}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Audiencia}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data da Sentença -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data da sentença:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Sentenca}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Sentenca}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>

                    <!-- Data do Trânsito em Julgado -->
                    <div class="flex items-center gap-4">
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Data do trânsito em julgado:</label
                            >
                            <input
                                type="date"
                                bind:value={data.SJ_Data_Transito_Julgado}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1 text-left"
                                >Tipo penal:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Tipo_Penal_Transito_Julgado}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    </div>
                </div>

                <!-- Right Column (Crime Details) - Spans 1 column -->
                <div class="space-y-4">
                    <!-- Hora do Crime -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Hora do crime:</label
                        >
                        <input
                            type="text"
                            bind:value={data.SJ_Hora_Crime}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>

                    <!-- Dia da Semana -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Dia da semana:</label
                        >
                        <select
                            bind:value={data.SJ_Dia_Semana}
                            on:change={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        >
                            <option value="">Selecione...</option>
                            <option value="Segunda-feira">Segunda-feira</option>
                            <option value="Terça-feira">Terça-feira</option>
                            <option value="Quarta-feira">Quarta-feira</option>
                            <option value="Quinta-feira">Quinta-feira</option>
                            <option value="Sexta-feira">Sexta-feira</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                    </div>

                    <!-- Local do Crime -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Local do crime:</label
                        >
                        <select
                            bind:value={data.SJ_Local_Crime}
                            on:change={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        >
                            <option value="">Selecione...</option>
                            <option value="Residência">Residência</option>
                            <option value="Em via pública próxima à residência"
                                >Em via pública próxima à residência</option
                            >
                            <option value="Residência de terceiro"
                                >Residência de terceiro</option
                            >
                            <option value="Via pública">Via pública</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <!-- Especifique (Conditional) -->
                    {#if data.SJ_Local_Crime === "Outro"}
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Especifique o local do crime:</label
                            >
                            <input
                                type="text"
                                bind:value={data.SJ_Local_Crime_Especif}
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    {/if}

                    <!-- Observações sobre o Crime -->
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >Observações sobre o crime:</label
                        >
                        <textarea
                            bind:value={data.SJ_Obs_Crime}
                            on:blur={autosave}
                            rows="4"
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- Container 4: Fase da Persecução Penal -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-gray-600">
                    Fase da Persecução Penal no momento do primeiro atendimento
                </h3>
                <button
                    type="button"
                    class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center"
                    on:click={() => {
                        data.SJ_Fase_Persecucao_Penal = "";
                        handlePhaseChange();
                    }}
                >
                    <span class="material-icons text-sm mr-1">close</span>
                    Limpar
                </button>
            </div>

            <div class="space-y-3">
                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Fase_Persecucao_Penal}
                        value="Sem Registro de Evento de Defesa Social (REDS)"
                        on:change={handlePhaseChange}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >Sem Registro de Evento de Defesa Social (REDS)</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Fase_Persecucao_Penal}
                        value="Com Registro de Evento de Defesa Social (REDS)"
                        on:change={handlePhaseChange}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >Com Registro de Evento de Defesa Social (REDS)</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Fase_Persecucao_Penal}
                        value="Inquérito"
                        on:change={handlePhaseChange}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800">Inquérito</span>
                </label>

                <div class="flex items-center gap-4">
                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Fase_Persecucao_Penal}
                            value={judicialLabel}
                            on:change={handlePhaseChange}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >{judicialLabel}</span
                        >
                    </label>

                    {#if data.SJ_Fase_Persecucao_Penal === judicialLabel}
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-gray-800"
                                >Especifique:</span
                            >
                            <select
                                bind:value={data.SJ_Fase_Judicial_Especif}
                                on:change={autosave}
                                class="rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                            >
                                <option value="">Selecione...</option>
                                {#each judicialOptions as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Container 5: Situação Jurídica Atual do Autor -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-gray-600">
                    Situação jurídica atual do autor
                </h3>
                <button
                    type="button"
                    class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center"
                    on:click={() => {
                        data.SJ_Status_Juridico_Autor = "";
                        autosave();
                    }}
                >
                    <span class="material-icons text-sm mr-1">close</span>
                    Limpar
                </button>
            </div>

            <div class="space-y-3">
                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value="Em liberdade"
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800">Em liberdade</span>
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value={labelPrisaoAdvertencia}
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >{labelPrisaoAdvertencia}</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value={labelPresoObrigacao}
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >{labelPresoObrigacao}</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value={labelLiberdadePrestacao}
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >{labelLiberdadePrestacao}</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value={labelCumprimentoLiberdade}
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >{labelCumprimentoLiberdade}</span
                    >
                </label>

                <label class="flex items-center">
                    <input
                        type="radio"
                        bind:group={data.SJ_Status_Juridico_Autor}
                        value={labelMortoSemiliberdade}
                        on:change={autosave}
                        class="form-radio text-save-primary"
                    />
                    <span class="ml-2 text-sm text-gray-800"
                        >{labelMortoSemiliberdade}</span
                    >
                </label>

                {#if data.SJ_Autor_Maior_18 === "Não"}
                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Status_Juridico_Autor}
                            value="Internação"
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >Internação</span
                        >
                    </label>
                {/if}
            </div>
        </div>

        <!-- Container 6: Resultado do Julgamento -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-gray-600">
                    Resultado do julgamento
                </h3>
                <button
                    type="button"
                    class="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center"
                    on:click={() => {
                        situacaoJuridica2.SJ2_Resultado_Julgamento = "";
                        autosave();
                    }}
                >
                    <span class="material-icons text-sm mr-1">close</span>
                    Limpar
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column: Checkboxes -->
                <div class="space-y-3">
                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={
                                situacaoJuridica2.SJ2_Resultado_Julgamento
                            }
                            value="Absolvição"
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >Absolvição</span
                        >
                    </label>

                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={
                                situacaoJuridica2.SJ2_Resultado_Julgamento
                            }
                            value={labelMedidaSeguranca}
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >{labelMedidaSeguranca}</span
                        >
                    </label>

                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={
                                situacaoJuridica2.SJ2_Resultado_Julgamento
                            }
                            value={labelPrescricaoImprocedencia}
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >{labelPrescricaoImprocedencia}</span
                        >
                    </label>

                    <label class="flex items-center">
                        <input
                            type="radio"
                            bind:group={
                                situacaoJuridica2.SJ2_Resultado_Julgamento
                            }
                            value={labelCondenacaoArquivamento}
                            on:change={autosave}
                            class="form-radio text-save-primary"
                        />
                        <span class="ml-2 text-sm text-gray-800"
                            >{labelCondenacaoArquivamento}</span
                        >
                    </label>
                </div>

                <!-- Right Column: Inputs -->
                <div class="space-y-4">
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >{labelTempoPena}</label
                        >
                        <input
                            type="text"
                            bind:value={situacaoJuridica2.SJ2_Tempo_Pena}
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >{labelInicioCumprimento}</label
                        >
                        <input
                            type="date"
                            bind:value={
                                situacaoJuridica2.SJ2_Inicio_Cumprimento
                            }
                            on:blur={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-800 mb-1"
                            >{labelRegime}</label
                        >
                        <select
                            bind:value={situacaoJuridica2.SJ2_Regime}
                            on:change={autosave}
                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        >
                            <option value="">Selecione...</option>
                            {#each regimeOptions as option}
                                <option value={option}>{option}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Container 7: Reparação de Danos -->
        <div
            class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
        >
            <h3 class="text-sm font-semibold text-gray-600 mb-4">
                Reparação de danos
            </h3>

            <div class="space-y-6">
                <!-- Apuração Específica -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-800 mb-2"
                        >Houve apuração específica na fase de investigação?</label
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Apuracao_Investigacao
                                }
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Apuracao_Investigacao
                                }
                                value="Não"
                                on:change={() => {
                                    situacaoJuridica2.SJ2_Apuracao_Invest_Especif =
                                        "";
                                    autosave();
                                }}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                        <button
                            type="button"
                            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            on:click={() => {
                                situacaoJuridica2.SJ2_Apuracao_Investigacao =
                                    "";
                                situacaoJuridica2.SJ2_Apuracao_Invest_Especif =
                                    "";
                                autosave();
                            }}
                            title="Limpar seleção"
                        >
                            <span class="material-icons text-sm">close</span>
                        </button>
                    </div>
                    {#if situacaoJuridica2.SJ2_Apuracao_Investigacao === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Especifique:</label
                            >
                            <input
                                type="text"
                                bind:value={
                                    situacaoJuridica2.SJ2_Apuracao_Invest_Especif
                                }
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    {/if}
                </div>

                <!-- Pedido de Reparação -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-800 mb-2"
                        >Houve pedido de reparação na denúncia?</label
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Pedido_Reparacao_Denuncia
                                }
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Pedido_Reparacao_Denuncia
                                }
                                value="Não"
                                on:change={() => {
                                    situacaoJuridica2.SJ2_Tipo_Danos = "";
                                    situacaoJuridica2.SJ2_Tipo_Danos_Especif =
                                        "";
                                    autosave();
                                }}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                        <button
                            type="button"
                            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            on:click={() => {
                                situacaoJuridica2.SJ2_Pedido_Reparacao_Denuncia =
                                    "";
                                situacaoJuridica2.SJ2_Tipo_Danos = "";
                                situacaoJuridica2.SJ2_Tipo_Danos_Especif = "";
                                autosave();
                            }}
                            title="Limpar seleção"
                        >
                            <span class="material-icons text-sm">close</span>
                        </button>
                    </div>
                    {#if situacaoJuridica2.SJ2_Pedido_Reparacao_Denuncia === "Sim"}
                        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-800 mb-1"
                                    >Tipo de danos:</label
                                >
                                <input
                                    type="text"
                                    bind:value={
                                        situacaoJuridica2.SJ2_Tipo_Danos
                                    }
                                    on:blur={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                />
                            </div>
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-800 mb-1"
                                    >Especifique:</label
                                >
                                <input
                                    type="text"
                                    bind:value={
                                        situacaoJuridica2.SJ2_Tipo_Danos_Especif
                                    }
                                    on:blur={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                />
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Condenação em Reparação -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-800 mb-2"
                        >Houve condenação em reparação de danos?</label
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Condenacao_Reparacao
                                }
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={
                                    situacaoJuridica2.SJ2_Condenacao_Reparacao
                                }
                                value="Não"
                                on:change={() => {
                                    situacaoJuridica2.SJ2_Condenacao_Repar_Especif =
                                        "";
                                    autosave();
                                }}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                        <button
                            type="button"
                            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            on:click={() => {
                                situacaoJuridica2.SJ2_Condenacao_Reparacao = "";
                                situacaoJuridica2.SJ2_Condenacao_Repar_Especif =
                                    "";
                                autosave();
                            }}
                            title="Limpar seleção"
                        >
                            <span class="material-icons text-sm">close</span>
                        </button>
                    </div>
                    {#if situacaoJuridica2.SJ2_Condenacao_Reparacao === "Sim"}
                        <div class="mt-2">
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-1"
                                >Especifique:</label
                            >
                            <input
                                type="text"
                                bind:value={
                                    situacaoJuridica2.SJ2_Condenacao_Repar_Especif
                                }
                                on:blur={autosave}
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            />
                        </div>
                    {/if}
                </div>
            </div>
            <!-- Container 8: Demandas das vítimas -->
            <div
                class="border-2 border-gray-200 rounded-lg p-4 bg-white relative mt-6"
            >
                <h3 class="text-sm font-semibold text-gray-600 mb-4">
                    Demandas das vítimas em relação à persecução penal
                </h3>

                <div class="space-y-6">
                    <!-- Direito à informação e participação -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Info_Participacao
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Info_Participacao
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Info_Participacao_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Info_Participacao_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à informação e participação</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Info_Participacao}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Info_Participacao_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Informações e orientações jurídicas"
                                            >Informações e orientações jurídicas</option
                                        >
                                        <option
                                            value="Obtenção de cópia de procedimento"
                                            >Obtenção de cópia de procedimento</option
                                        >
                                        <option
                                            value="Notificação de atos processuais"
                                            >Notificação de atos processuais</option
                                        >
                                        <option
                                            value="Apresentação de novas testemunhas"
                                            >Apresentação de novas testemunhas</option
                                        >
                                        <option
                                            value="Apresentação de novas provas"
                                            >Apresentação de novas provas</option
                                        >
                                        <option
                                            value="Outras formas de acesso à justiça"
                                            >Outras formas de acesso à justiça</option
                                        >
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Info_Participacao_Especif === "Outras formas de acesso à justiça"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Info_Participacao_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à memória e verdade -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Memoria_Verdade
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Memoria_Verdade
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Memoria_Verdade_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Memoria_Verdade_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à memória e verdade</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Memoria_Verdade}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Memoria_Verdade_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Sanções judiciais e administrativas contra os agressores"
                                            >Sanções judiciais e administrativas
                                            contra os agressores</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Memoria_Verdade_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Memoria_Verdade_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à justiça e devida diligência -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Justica_Diligencia
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Justica_Diligencia
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Justica_Diligencia_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Justica_Diligencia_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à justiça e devida diligência</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Justica_Diligencia}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Justica_Diligencia_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Registrar ou denunciar crime ou ato infracional"
                                            >Registrar ou denunciar crime ou ato
                                            infracional</option
                                        >
                                        <option
                                            value="Realização de perícias e audiências"
                                            >Realização de perícias e audiências</option
                                        >
                                        <option value="Justiça Restaurativa"
                                            >Justiça Restaurativa</option
                                        >
                                        <option
                                            value="Outros métodos alternativos de resolução de conflitos"
                                            >Outros métodos alternativos de
                                            resolução de conflitos</option
                                        >
                                        <option value="Direito à recurso"
                                            >Direito à recurso</option
                                        >
                                        <option
                                            value="Outras formas de acesso à justiça"
                                            >Outras formas de acesso à justiça</option
                                        >
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Justica_Diligencia_Especif === "Outras formas de acesso à justiça"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Justica_Diligencia_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à apoio e assistência -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à apoio e assistência</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Assistência jurídica gratuita"
                                            >Assistência jurídica gratuita</option
                                        >
                                        <option
                                            value="Ser acompanhada em atos processuais e afins"
                                            >Ser acompanhada em atos processuais
                                            e afins</option
                                        >
                                        <option
                                            value="Ser encaminhada para atendimento médico, odontológico e de saúde mental"
                                            >Ser encaminhada para atendimento
                                            médico, odontológico e de saúde
                                            mental</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Apoio_Assistencia_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à segurança -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Seguranca
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Seguranca
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Seguranca_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Seguranca_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à segurança</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Seguranca}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Seguranca_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Aguardar em salas de espera reservadas nos dias de diligências processuais e audiências"
                                            >Aguardar em salas de espera
                                            reservadas nos dias de diligências
                                            processuais e audiências</option
                                        >
                                        <option
                                            value="Outras medidas de segurança"
                                            >Outras medidas de segurança</option
                                        >
                                        <option
                                            value="Ser ouvida sem a presença do réu, caso sua presença possa causar intimidação"
                                            >Ser ouvida sem a presença do réu,
                                            caso sua presença possa causar
                                            intimidação</option
                                        >
                                        <option
                                            value="Afastamento do investigado"
                                            >Afastamento do investigado</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Seguranca_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Seguranca_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à proteção e não revitimização -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2 =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à proteção e não revitimização</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao}
                            <div class="mt-2 ml-6 space-y-4">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique:</label
                                        >
                                        <select
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif
                                            }
                                            on:change={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Medidas Protetivas"
                                                >Medidas Protetivas</option
                                            >
                                            <option value="Medidas Cautelares"
                                                >Medidas Cautelares</option
                                            >
                                            <option
                                                value="Encaminhamento para Programa de Proteção"
                                                >Encaminhamento para Programa de
                                                Proteção</option
                                            >
                                            <option
                                                value="Apoio frente à inquérito ou ação impretada em retaliação à denúncia de fato criminoso"
                                                >Apoio frente à inquérito ou
                                                ação impretada em retaliação à
                                                denúncia de fato criminoso</option
                                            >
                                            <option
                                                value="Abrigamento ou acolhimento temporário"
                                                >Abrigamento ou acolhimento
                                                temporário</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </div>
                                    {#if situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Medidas Protetivas"}
                                        <div>
                                            <label
                                                class="block text-sm font-semibold text-gray-800 mb-1"
                                                >Especifique:</label
                                            >
                                            <select
                                                bind:value={
                                                    situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif
                                                }
                                                on:change={autosave}
                                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                            >
                                                <option value=""
                                                    >Selecione...</option
                                                >
                                                <option
                                                    value="Medidas Protetivas de Urgência que obrigam o agressor"
                                                    >Medidas Protetivas de
                                                    Urgência que obrigam o
                                                    agressor</option
                                                >
                                                <option
                                                    value="Medidas Protetivas de Urgência à Ofendida"
                                                    >Medidas Protetivas de
                                                    Urgência à Ofendida</option
                                                >
                                                <option
                                                    value="Proteção patrimonial"
                                                    >Proteção patrimonial</option
                                                >
                                            </select>
                                        </div>
                                    {/if}
                                </div>

                                {#if (situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Medidas Protetivas" && situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif) || situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Medidas Cautelares"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique:</label
                                        >
                                        <select
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2
                                            }
                                            on:change={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            {#each cautelaresOptions as option}
                                                <option value={option}
                                                    >{option}</option
                                                >
                                            {/each}
                                        </select>
                                    </div>
                                {/if}

                                {#if situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Outros" || (situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Medidas Cautelares" && situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2 === "Outras medidas cautelares") || (situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif === "Medidas Protetivas" && (situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2 === "Outras Medidas Protetivas de Urgência que obrigam o agressor" || situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_MedidasCautelares_Especif2 === "Outros"))}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Protecao_Nao_Revitimizacao_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à proteção psicológica -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à proteção psicológica</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Receber atendimento psicológico"
                                            >Receber atendimento psicológico</option
                                        >
                                        <option value="Depoimento sem dano"
                                            >Depoimento sem dano</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Protecao_Psicologica_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à proteção documental -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Protecao_Documental
                                }
                                on:change={() => {
                                    if (
                                        !situacaoJuridica2.SJ2_Demanda_Protecao_Documental
                                    ) {
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Documental_Especif =
                                            "";
                                        situacaoJuridica2.SJ2_Demanda_Protecao_Documental_Especif2 =
                                            "";
                                    }
                                    autosave();
                                }}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à proteção documental</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Protecao_Documental}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Protecao_Documental_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Sigilo das informações pessoais"
                                            >Sigilo das informações pessoais</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Protecao_Documental_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Protecao_Documental_Especif2
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à compensação e outras formas de reparação integral -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao
                                }
                                on:change={autosave}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à compensação e outras formas de
                                reparação integral</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Restituição"
                                            >Restituição</option
                                        >
                                        <option value="Compensação"
                                            >Compensação</option
                                        >
                                        <option value="Reabilitação"
                                            >Reabilitação</option
                                        >
                                        <option value="Satisfação"
                                            >Satisfação</option
                                        >
                                        <option value="Pensão">Pensão</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique:</label
                                        >
                                        <select
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif2
                                            }
                                            on:change={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            {#each compensacaoOptions as option}
                                                <option value={option}
                                                    >{option}</option
                                                >
                                            {/each}
                                        </select>
                                    </div>
                                {/if}
                                {#if situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif2 && situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif2.toLowerCase().includes("outra")}
                                    <div class="md:col-span-2">
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Compensacao_Reparacao_Especif_OutraForma
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Direito à tratamento digno e respeitoso -->
                    <div>
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={
                                    situacaoJuridica2.SJ2_Demanda_Tratamento_Digno
                                }
                                on:change={autosave}
                                class="form-checkbox text-save-primary rounded"
                            />
                            <span
                                class="ml-2 text-sm font-semibold text-gray-800"
                                >Direito à tratamento digno e respeitoso</span
                            >
                        </label>
                        {#if situacaoJuridica2.SJ2_Demanda_Tratamento_Digno}
                            <div
                                class="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        class="block text-sm font-semibold text-gray-800 mb-1"
                                        >Especifique:</label
                                    >
                                    <select
                                        bind:value={
                                            situacaoJuridica2.SJ2_Demanda_Tratamento_Digno_Especif
                                        }
                                        on:change={autosave}
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option
                                            value="Responsabilização por violência institucional (Lei Mariana Ferrer)"
                                            >Responsabilização por violência
                                            institucional (Lei Mariana Ferrer)</option
                                        >
                                        <option
                                            value="Coibir procedimentos desnecessários, repetitivos ou invasivos"
                                            >Coibir procedimentos
                                            desnecessários, repetitivos ou
                                            invasivos</option
                                        >
                                        <option
                                            value="Ações de enfrentamento à revitimização"
                                            >Ações de enfrentamento à
                                            revitimização</option
                                        >
                                        <option
                                            value="Solicitação de exclusão de circunstâncias ou elementos alheios aos fatos objeto de apuração nos autos"
                                            >Solicitação de exclusão de
                                            circunstâncias ou elementos alheios
                                            aos fatos objeto de apuração nos
                                            autos</option
                                        >
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                {#if situacaoJuridica2.SJ2_Demanda_Tratamento_Digno_Especif === "Outros"}
                                    <div>
                                        <label
                                            class="block text-sm font-semibold text-gray-800 mb-1"
                                            >Especifique a outra forma:</label
                                        >
                                        <input
                                            type="text"
                                            bind:value={
                                                situacaoJuridica2.SJ2_Demanda_Tratamento_Digno_OutraForma
                                            }
                                            on:blur={autosave}
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        />
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Manual Save Button -->
            <div class="mt-6 flex justify-end">
                <div class="flex flex-col items-center">
                    <button
                        on:click={manualSave}
                        disabled={saving}
                        class="bg-save-primary text-white px-6 py-2 rounded-md hover:bg-save-secondary transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {#if saving}
                            <span class="material-icons animate-spin text-sm"
                                >refresh</span
                            >
                            Salvando...
                        {:else}
                            <span class="material-icons text-sm">save</span>
                            Salvar Alterações
                        {/if}
                    </button>
                    {#if saveStatus && saveStatus.includes("Salvo")}
                        <span class="text-green-600 font-medium mt-2 text-sm"
                            >Salvo com sucesso!</span
                        >
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
