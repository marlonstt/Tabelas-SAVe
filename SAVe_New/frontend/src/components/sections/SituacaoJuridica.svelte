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

    let processos: any[] = [];

    let loading = true;
    let saving = false;
    let saveStatus = "";
    let saveTimeout: any;

    const dateFields = [
        "SJ_Data_Fatos",
        "SJ_Data_Autuacao_IP",
        "SJ_Data_Conclusao_IP",
        "SJ_Data_Denuncia_Repres",
        "SJ_Data_Audiencia",
        "SJ_Data_Sentenca",
        "SJ_Data_Transito_Julgado",
    ];

    $: judicialLabel =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Judicial - Criminal"
            : "Judicial - Infracional";

    $: judicialOptions =
        data.SJ_Autor_Maior_18 === "Sim"
            ? [
                  "Sem denúncia",
                  "Com Denúncia",
                  "AIJ realizada",
                  "Com sentença",
                  "Transitada em julgada",
              ]
            : [
                  "Sem representação",
                  "Com representação",
                  "Audiência de apresentação",
                  "Aplicação de medidas socioeducativas",
                  "Em cumprimento de Medidas Socioeducativas",
              ];

    // Labels for Current Legal Status based on age
    $: labelPrisaoAdvertencia =
        data.SJ_Autor_Maior_18 === "Sim" ? "Prisão Cautelar" : "Advertência";
    $: labelPresoObrigacao =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Preso em razão de outro fato"
            : "Obrigação de Reparar o Dano";
    $: labelLiberdadePrestacao =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Liberdade Provisória"
            : "Prestação de Serviços à Comunidade";
    $: labelCumprimentoLiberdade =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Em cumprimento de pena"
            : "Liberdade Assistida";
    $: labelMortoSemiliberdade =
        data.SJ_Autor_Maior_18 === "Sim" ? "Morto" : "Semiliberdade";

    // Labels for Judgment Result based on age
    $: labelMedidaSeguranca =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Medida de Segurança (absolvição imprópria)"
            : "Medida";
    $: labelPrescricaoImprocedencia =
        data.SJ_Autor_Maior_18 === "Sim" ? "Prescrição" : "Improcedência";
    $: labelCondenacaoArquivamento =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Condenação"
            : "Arquivamento do processo";

    $: labelTempoPena =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Tempo da pena:"
            : "Tempo da medida:";
    $: labelInicioCumprimento =
        data.SJ_Autor_Maior_18 === "Sim"
            ? "Inicio do cumprimento:"
            : "Data de inicio medida:";
    $: labelRegime =
        data.SJ_Autor_Maior_18 === "Sim" ? "Regime:" : "Tipo de medida:";

    $: regimeOptions =
        data.SJ_Autor_Maior_18 === "Sim"
            ? ["Fechado", "Semiaberto", "Aberto"]
            : [
                  "Advertência",
                  "Obrigação de Reparar o Dano",
                  "Prestação de Serviços à Comunidade",
                  "Liberdade Assistida",
                  "Semiliberdade",
                  "Internação",
              ];

    // Reset especific field if main phase changes or isn't judicial
    function handlePhaseChange() {
        if (!data.SJ_Fase_Persecucao_Penal.startsWith("Judicial")) {
            data.SJ_Fase_Judicial_Especif = "";
        }
        autosave();
    }

    onMount(async () => {
        await loadData();
    });

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            const payload = {
                ...data,
                situacaoJuridica2: situacaoJuridica2,
                processos: processos,
            };
            await api.put(`/cases/${caseId}/situacao-juridica`, payload);
            saveStatus = "Salvo com sucesso! ✅";
            setTimeout(() => (saveStatus = ""), 3000);
        } catch (error) {
            console.error("Error saving data:", error);
            saveStatus = "Erro ao salvar ❌";
        } finally {
            saving = false;
        }
    }

    async function loadData() {
        try {
            loading = true;
            const response = await api.get(`/cases/${caseId}`);
            const apiData = response.data;

            if (apiData.situacaoJuridica && apiData.situacaoJuridica.ID_Caso) {
                data = { ...data, ...apiData.situacaoJuridica };

                // Format date fields
                dateFields.forEach((field) => {
                    if (data[field]) {
                        data[field] = data[field].split("T")[0];
                    }
                });
            }
            if (
                apiData.situacaoJuridica2 &&
                apiData.situacaoJuridica2.ID_Caso
            ) {
                situacaoJuridica2 = {
                    ...situacaoJuridica2,
                    ...apiData.situacaoJuridica2,
                };
                // Format SJ2_Inicio_Cumprimento date
                if (situacaoJuridica2.SJ2_Inicio_Cumprimento) {
                    situacaoJuridica2.SJ2_Inicio_Cumprimento =
                        situacaoJuridica2.SJ2_Inicio_Cumprimento.split("T")[0];
                }
            }
            if (apiData.processos) {
                processos = apiData.processos;
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            loading = false;
        }
    }

    function autosave() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saving = true;
        saveTimeout = setTimeout(async () => {
            try {
                const payload = {
                    ...data,
                    situacaoJuridica2: situacaoJuridica2,
                    processos: processos,
                };
                await api.put(`/cases/${caseId}/situacao-juridica`, payload);
                saving = false;
            } catch (error) {
                console.error("Error saving data:", error);
                saving = false;
            }
        }, 1000);
    }

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
        class:opacity-0={saving || loading}
        class:opacity-100={!saving && !loading}
    >
        <span class="text-green-600 flex items-center">
            <span class="material-icons text-sm mr-1">check</span>
            Salvo
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
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>
                        {#if data.SJ_Medidas_Prot_Cautelar === "Sim"}
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-800 mb-1"
                                    >Nº do Processo:</label
                                >
                                <input
                                    type="text"
                                    bind:value={data.SJ_Num_Processo}
                                    on:blur={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                />
                            </div>
                        {/if}
                    </div>

                    {#if data.SJ_Medidas_Prot_Cautelar === "Sim"}
                        <!-- Compartilhado com Rede -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-2"
                                >Foi compartilhado com a rede?</label
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Compartilhado_Rede}
                                        value="Sim"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Compartilhado_Rede}
                                        value="Não"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>

                        <!-- Relato de Descumprimento -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            on:change={autosave}
                                            class="form-radio text-save-primary"
                                        />
                                        <span class="ml-2">Não</span>
                                    </label>
                                </div>
                            </div>
                            {#if data.SJ_Relato_Descumprimento === "Sim"}
                                <div>
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

                        <!-- Vítima Intimada -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-2"
                                >A vítima foi intimada?</label
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Vitima_Intimada}
                                        value="Sim"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Vitima_Intimada}
                                        value="Não"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>

                        <!-- Agressor Intimado -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-800 mb-2"
                                >O agressor foi intimado?</label
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Agressor_Intimado}
                                        value="Sim"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        bind:group={data.SJ_Agressor_Intimado}
                                        value="Não"
                                        on:change={autosave}
                                        class="form-radio text-save-primary"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>
                    {/if}
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
            <h3 class="text-sm font-semibold text-gray-600 mb-4">
                Fase da Persecução Penal no momento do primeiro atendimento
            </h3>

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
            <h3 class="text-sm font-semibold text-gray-600 mb-4">
                Situação jurídica atual do autor
            </h3>

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
            <h3 class="text-sm font-semibold text-gray-600 mb-4">
                Resultado do julgamento
            </h3>

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
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
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

                <!-- Pedido de Reparação na Denúncia -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-800 mb-2"
                        >Houve pedido de reparação de danos na denúncia?</label
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
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                    {#if situacaoJuridica2.SJ2_Pedido_Reparacao_Denuncia === "Sim"}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-800 mb-1"
                                    >Quais tipos de danos?</label
                                >
                                <select
                                    bind:value={
                                        situacaoJuridica2.SJ2_Tipo_Danos
                                    }
                                    on:change={autosave}
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Patrimoniais"
                                        >Patrimoniais</option
                                    >
                                    <option value="Extrapatrimoniais"
                                        >Extrapatrimoniais</option
                                    >
                                    <option value="In re ipsa"
                                        >In re ipsa</option
                                    >
                                    <option value="Mediante comprovação"
                                        >Mediante comprovação</option
                                    >
                                </select>
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

                <!-- Condenação à Reparação -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-800 mb-2"
                        >Houve condenação à reparação de danos?</label
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
                                on:change={autosave}
                                class="form-radio text-save-primary"
                            />
                            <span class="ml-2">Não</span>
                        </label>
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
                                on:change={autosave}
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
