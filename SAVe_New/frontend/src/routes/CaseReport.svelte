<script lang="ts">
    import { onMount } from "svelte";
    import api from "../lib/api";
    import { formatDate } from "../lib/utils";

    export let id: string;

    let caseData: any = null;
    let loading = true;
    let showReport = false;

    let sections = [
        { id: "dadosEntrada", label: "Dados de Entrada", selected: true },
        { id: "identificacao", label: "Sócio Identificação", selected: true },
        {
            id: "ensinoTrabRenda",
            label: "Ensino - trab - renda",
            selected: true,
        },
        { id: "assistencia", label: "Assistência", selected: true },
        { id: "territorio", label: "Território", selected: true },
        { id: "saude", label: "Saúde", selected: true },
        { id: "vinculos", label: "Vínculos", selected: true },
        { id: "situacaoJuridica", label: "Situação Jurídica", selected: true },
        { id: "agressor", label: "Agressor", selected: true },
        {
            id: "protecaoSeguranca",
            label: "Proteção-segurança",
            selected: true,
        },
        {
            id: "vitimizacao",
            label: "Vitimização secundária e terciária",
            selected: true,
        },
        { id: "acompanhamento", label: "Acompanhamentos", selected: true },
        { id: "encerramento", label: "Encerramento", selected: true },
        { id: "referencias", label: "Referências", selected: true },
    ];
    onMount(async () => {
        try {
            const response = await api.get(`/cases/${id}`);
            caseData = response.data;

            if (caseData.acompanhamentos) {
                caseData.acompanhamentos.sort((a: any, b: any) => {
                    const d1 = new Date(a.Data).getTime();
                    const d2 = new Date(b.Data).getTime();
                    if (d1 !== d2) {
                        return d2 - d1; // Newer first
                    }
                    // Tie-breaker: Created time
                    const c1 = new Date(a.Criado).getTime();
                    const c2 = new Date(b.Criado).getTime();
                    return c2 - c1;
                });
            }

            const tipoForm = caseData.geral?.Tipo_Form?.toLowerCase() || "";
            const isBreve = !(
                tipoForm === "completo" ||
                tipoForm === "versão completa" ||
                tipoForm === "versao completa"
            );

            if (isBreve) {
                const allowed = [
                    "dadosEntrada",
                    "identificacao",
                    "situacaoJuridica",
                    "protecaoSeguranca",
                    "vitimizacao",
                ];
                sections = sections.filter((s) => allowed.includes(s.id));
            }
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar dados do caso.");
        } finally {
            loading = false;
        }
    });

    function toggleSection(index: number) {
        sections[index].selected = !sections[index].selected;
    }

    function handleGenerate() {
        showReport = true;
    }

    function handlePrint() {
        window.print();
    }

    function handleBack() {
        if (showReport) {
            showReport = false;
        } else {
            window.location.href = `/case/${id}`;
        }
    }

    // Helper functions for formatting

    function formatDateTime(dateStr: string) {
        if (!dateStr) return "Não informado";
        const date = new Date(dateStr);
        return isNaN(date.getTime())
            ? dateStr
            : date.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
              });
    }

    function formatMoney(val: any) {
        if (!val) return "Não informado";
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(val));
    }

    function getValue(val: any, fallback = "Não informado") {
        return val || fallback;
    }

    function getAgressorAddresses(agressorId: number) {
        if (!caseData?.agressorEnderecos) return [];
        return caseData.agressorEnderecos.filter(
            (addr: any) => addr.ID_Perfil_Agressor === agressorId,
        );
    }

    function stripHtml(html: string) {
        if (!html) return "";
        // Create a temporary element to use browser's parsing
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || "";
        // Remove extra whitespace
        return text.replace(/\s+/g, " ").trim();
    }

    function getAcompanhamentoHeader(dateStr: string, createdStr: string) {
        const datePart = formatDate(dateStr);

        let timePart = "00:00";
        if (createdStr) {
            const date = new Date(createdStr);
            if (!isNaN(date.getTime())) {
                timePart = date.toLocaleString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }
        }

        return `Acompanhamento de ${datePart} - ${timePart}`;
    }
    function toggleSelectAll() {
        const allSelected = sections.every((s) => s.selected);
        sections = sections.map((s) => ({ ...s, selected: !allSelected }));
    }
</script>

{#if loading}
    <div class="flex items-center justify-center h-screen">
        <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
    </div>
{:else if !caseData}
    <div class="p-8 text-center text-red-600">Erro ao carregar dados.</div>
{:else if !showReport}
    <!-- Configuration View -->
    <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
        <h1 class="text-2xl font-bold mb-6 text-center text-save-primary">
            Gerar Relatório
        </h1>
        <p class="text-gray-600 mb-4 text-center">
            Escolha os dados que serão emitidos no relatório:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
            {#each sections as section, i}
                <label
                    class="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer text-sm"
                >
                    <input
                        type="checkbox"
                        checked={section.selected}
                        on:change={() => toggleSection(i)}
                        class="h-4 w-4 text-save-primary focus:ring-save-primary border-gray-300 rounded"
                    />
                    <span class="text-gray-700">{section.label}</span>
                </label>
            {/each}
        </div>

        <div class="flex justify-end mb-4 px-1">
            <button
                on:click={toggleSelectAll}
                class="text-sm text-save-primary hover:underline font-medium focus:outline-none"
            >
                {sections.every((s) => s.selected)
                    ? "Desmarcar Todos"
                    : "Marcar Todos"}
            </button>
        </div>

        <div class="flex justify-between">
            <button
                on:click={handleBack}
                class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
                Voltar
            </button>
            <button
                on:click={handleGenerate}
                disabled={sections.every((s) => !s.selected)}
                class="px-6 py-2 bg-save-primary text-white rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Gerar Relatório
            </button>
        </div>
    </div>
{:else}
    <!-- Report View -->
    <div class="report-container bg-white min-h-screen">
        <!-- No-Print Controls -->
        <div
            class="no-print sticky top-0 bg-gray-100 p-4 border-b flex justify-between items-center shadow-sm"
        >
            <button
                on:click={() => (showReport = false)}
                class="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
                <span class="material-icons mr-2 text-sm">arrow_back</span>
                Voltar
            </button>
            <div class="flex gap-2">
                <button
                    on:click={handlePrint}
                    class="flex items-center px-4 py-2 bg-save-accent text-save-primary rounded font-bold hover:bg-yellow-500 shadow-sm"
                >
                    <span class="material-icons mr-2 text-sm">print</span>
                    Imprimir / Salvar PDF
                </button>
            </div>
        </div>

        <!-- Report Content -->
        <div class="p-8 max-w-[210mm] mx-auto print-content">
            <h1 class="text-3xl font-bold text-center mb-8 text-save-primary">
                Relatório PAV/SAVe - Caso {id}
            </h1>

            {#each sections as section}
                {#if section.selected}
                    {#if section.id === "dadosEntrada"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Dados de Entrada
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <p>
                                    <strong>Data de Entrada:</strong>
                                    {formatDate(caseData.dadosEntrada?.Data)}
                                </p>
                                <p>
                                    <strong>Município de Origem:</strong>
                                    {getValue(
                                        caseData.dadosEntrada?.Comarca_origem,
                                    )}
                                </p>
                                <p>
                                    <strong
                                        >Precisa de atendimento especial?:</strong
                                    >
                                    {getValue(
                                        caseData.dadosEntrada
                                            ?.Precisa_Atendimento_Esp,
                                    )}
                                </p>
                                {#if caseData.dadosEntrada?.Precisa_Atendimento_Esp === "Sim"}
                                    <p>
                                        <strong>Qual tipo?:</strong>
                                        {getValue(
                                            caseData.dadosEntrada
                                                ?.Atendimento_Especial,
                                        )}
                                    </p>
                                {/if}
                            </div>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Crimes ou Atos Infracionais Relacionados
                                </h3>
                                {#if !caseData.dadosEntrada?.Crime_relacionado}
                                    <p>Nenhum crime informado.</p>
                                {:else}
                                    <ul class="list-disc pl-6">
                                        {#each caseData.dadosEntrada.Crime_relacionado.split(";") as crime}
                                            {#if crime.trim()}
                                                <li>{crime.trim()}</li>
                                            {/if}
                                        {/each}
                                    </ul>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "identificacao"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Sócio Identificação
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Dados Civis
                                </h3>
                                <p>
                                    <strong>Nome (Registro Civil):</strong>
                                    {getValue(caseData.identificacao?.Nome_RC)}
                                </p>
                                <p>
                                    <strong>Nome Social:</strong>
                                    {getValue(
                                        caseData.identificacao
                                            ?.Nome_social_ancestral,
                                    )}
                                </p>
                                <p>
                                    <strong>Data de Nascimento:</strong>
                                    {formatDate(
                                        caseData.identificacao?.Data_nascimento,
                                    )}
                                </p>
                                <!-- Add age calculation if needed -->
                            </div>

                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Endereço(s)
                                </h3>
                                {#if !caseData.enderecos || caseData.enderecos.length === 0}
                                    <p>Nenhum endereço cadastrado.</p>
                                {:else}
                                    {#each caseData.enderecos as end}
                                        <div
                                            class="mb-2 p-2 bg-white rounded border"
                                        >
                                            <p>
                                                <strong>Endereço:</strong>
                                                {end.Endereco}, {end.Numero ||
                                                    "S/N"}
                                            </p>
                                            <p>
                                                <strong>Cidade/UF:</strong>
                                                {end.Cidade}/{end.UF}
                                            </p>
                                        </div>
                                    {/each}
                                {/if}
                            </div>

                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Contatos
                                </h3>
                                <!-- Telefones -->
                                {#if caseData.telefones && caseData.telefones.length > 0}
                                    <div class="mb-2">
                                        <strong class="block mb-1"
                                            >Telefones:</strong
                                        >
                                        <ul class="list-disc pl-6">
                                            {#each caseData.telefones as tel}
                                                <li>{tel.TelefoneDDD}</li>
                                            {/each}
                                        </ul>
                                    </div>
                                {:else}
                                    <p>Nenhum telefone cadastrado.</p>
                                {/if}

                                <!-- Emails -->
                                {#if caseData.emails && caseData.emails.length > 0}
                                    <div class="mt-2 text-sm">
                                        <strong class="block mb-1"
                                            >E-mails:</strong
                                        >
                                        <ul class="list-disc pl-6">
                                            {#each caseData.emails as email}
                                                <li>{email["E-mail"]}</li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "ensinoTrabRenda"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Ensino, Trabalho e Renda
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Vida Escolar/Acadêmica
                                </h3>
                                <p>
                                    <strong>Grau de escolaridade:</strong>
                                    {getValue(
                                        caseData.ensinoTrabRenda
                                            ?.Grau_escolaridade,
                                    )}
                                </p>
                                <p>
                                    <strong>Estuda atualmente?:</strong>
                                    {getValue(
                                        caseData.ensinoTrabRenda
                                            ?.Estuda_atualmente,
                                    )}
                                </p>
                                {#if caseData.ensinoTrabRenda?.Estuda_atualmente === "Sim"}
                                    <p>
                                        <strong>Nome da instituição:</strong>
                                        {getValue(
                                            caseData.ensinoTrabRenda
                                                ?.Nome_instituicao,
                                        )}
                                    </p>
                                {/if}
                            </div>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Trabalho e Renda
                                </h3>
                                <p>
                                    <strong>Situação ocupacional:</strong>
                                    {getValue(
                                        caseData.ensinoTrabRenda
                                            ?.Situacao_trabalho,
                                    )}
                                </p>
                                <p>
                                    <strong>Valor da Renda:</strong>
                                    {getValue(
                                        caseData.ensinoTrabRenda?.Valor_renda,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "vinculos"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Vínculos Familiares e Comunitários
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Composição do Grupo Familiar
                                </h3>
                                <p>
                                    <strong>Qtd pessoas:</strong>
                                    {getValue(
                                        caseData.vinculos?.Qtd_Pessoas_Fam,
                                    )}
                                </p>
                                <p>
                                    <strong>Renda total:</strong>
                                    {caseData.vinculos?.Renda_Total_Conv
                                        ? formatMoney(
                                              caseData.vinculos
                                                  .Renda_Total_Conv,
                                          )
                                        : "Não informado"}
                                </p>
                            </div>

                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Membros do Grupo Familiar
                                </h3>
                                {#if !caseData.vinculosApoio || caseData.vinculosApoio.length === 0}
                                    <p>Nenhum membro informado.</p>
                                {:else}
                                    <table
                                        class="w-full text-sm border-collapse border border-gray-300"
                                    >
                                        <thead class="bg-gray-100">
                                            <tr>
                                                <th class="border p-2"
                                                    >Parentesco</th
                                                >
                                                <th class="border p-2">Nome</th>
                                                <th class="border p-2"
                                                    >Mora junto?</th
                                                >
                                                <th class="border p-2"
                                                    >Rede Apoio?</th
                                                >
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {#each caseData.vinculosApoio as member}
                                                <tr>
                                                    <td class="border p-2"
                                                        >{member.AVF_Grau_Parentesco}</td
                                                    >
                                                    <td class="border p-2"
                                                        >{member.AVF_Nome}</td
                                                    >
                                                    <td class="border p-2"
                                                        >{member.AVF_Mora_Com_Vitima
                                                            ? "Sim"
                                                            : "Não"}</td
                                                    >
                                                    <td class="border p-2"
                                                        >{member.AVF_Rede_Apoio
                                                            ? "Sim"
                                                            : "Não"}</td
                                                    >
                                                </tr>
                                            {/each}
                                        </tbody>
                                    </table>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "situacaoJuridica"}
                        <!-- Add implementation for Situacao Juridica similar to above -->
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Situação Jurídica
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <p>
                                    <strong>REDS:</strong>
                                    {getValue(
                                        caseData.situacaoJuridica?.SJ_REDS,
                                    )}
                                </p>
                                <p>
                                    <strong>IP - PCNet:</strong>
                                    {getValue(
                                        caseData.situacaoJuridica?.SJ_IP_PCNet,
                                    )}
                                </p>
                                <p>
                                    <strong>Auto Judicial:</strong>
                                    {getValue(
                                        caseData.situacaoJuridica
                                            ?.SJ_Auto_Judicial,
                                    )}
                                </p>
                                <p>
                                    <strong>Nº do MPMG:</strong>
                                    {getValue(
                                        caseData.situacaoJuridica?.SJ_Num_MPMG,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "agressor"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Informações do(s) Agressor(es)
                            </h2>
                            {#if !caseData.agressor || caseData.agressor.length === 0}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                                >
                                    <p>Nenhum agressor cadastrado.</p>
                                </div>
                            {:else}
                                {#each caseData.agressor as agressor}
                                    {@const addresses = getAgressorAddresses(
                                        agressor.ID,
                                    )}
                                    <div
                                        class="agressor-item bg-gray-50 p-4 rounded border border-gray-200 mb-4 avoid-break"
                                    >
                                        <h3
                                            class="font-bold text-lg mb-2 text-save-primary"
                                        >
                                            Agressor: {getValue(
                                                agressor.PA_Nome_Civil,
                                            )}
                                        </h3>
                                        <p>
                                            <strong>Tipo:</strong>
                                            {getValue(
                                                agressor.PA_Tipo_Agressor,
                                            )}
                                        </p>

                                        {#if agressor.PA_Tipo_Agressor === "Jurídica"}
                                            <p>
                                                <strong>Razão Social:</strong>
                                                {getValue(
                                                    agressor.PA_Razao_Social,
                                                )}
                                            </p>
                                            <p>
                                                <strong>CNPJ:</strong>
                                                {getValue(agressor.PA_CNPJ)}
                                            </p>
                                        {:else}
                                            <p>
                                                <strong>Apelido:</strong>
                                                {getValue(agressor.PA_Apelido)}
                                            </p>
                                            <p>
                                                <strong>Sexo:</strong>
                                                {getValue(agressor.PA_PPS_Sexo)}
                                            </p>
                                        {/if}

                                        <!-- Addresses Logic -->
                                        <!-- Addresses Logic -->
                                        {#if addresses.length === 0}
                                            <div
                                                class="content-box mt-2 p-2 bg-white border rounded"
                                            >
                                                <p
                                                    class="text-sm text-gray-500"
                                                >
                                                    Nenhum endereço cadastrado
                                                    para este agressor.
                                                </p>
                                            </div>
                                        {:else}
                                            <div class="content-box mt-2">
                                                <h4
                                                    class="font-bold text-sm mb-1"
                                                >
                                                    Endereço(s) do agressor
                                                </h4>
                                                <table
                                                    class="w-full text-xs text-left border-collapse border border-gray-300"
                                                >
                                                    <thead class="bg-gray-100">
                                                        <tr>
                                                            <th
                                                                class="border p-1"
                                                                >Situação</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >Endereço</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >Número</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >Comp.</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >Bairro</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >Cidade</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >UF</th
                                                            >
                                                            <th
                                                                class="border p-1"
                                                                >CEP</th
                                                            >
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {#each addresses as addr}
                                                            <tr>
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Situacao_Moradia,
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Endereco,
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Numero,
                                                                        "S/N",
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Complemento,
                                                                        "-",
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Bairro,
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_Cidade,
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_UF,
                                                                    )}</td
                                                                >
                                                                <td
                                                                    class="border p-1"
                                                                    >{getValue(
                                                                        addr.PAE_CEP,
                                                                    )}</td
                                                                >
                                                            </tr>
                                                        {/each}
                                                    </tbody>
                                                </table>
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    {/if}

                    {#if section.id === "acompanhamento"}
                        <div class="section mb-8">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Acompanhamentos
                            </h2>
                            {#if !caseData.acompanhamentos || caseData.acompanhamentos.length === 0}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                                >
                                    <p>Nenhum acompanhamento registrado.</p>
                                </div>
                            {:else}
                                {#each caseData.acompanhamentos as acomp}
                                    <div
                                        class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4 page-break-inside-avoid"
                                    >
                                        <h4
                                            class="font-bold text-save-primary mb-2"
                                        >
                                            {getAcompanhamentoHeader(
                                                acomp.Data,
                                                acomp.Criado,
                                            )}
                                        </h4>
                                        <p>
                                            <strong>Responsáveis:</strong>
                                            {getValue(acomp.Responsaveis)}
                                        </p>
                                        <p>
                                            <strong>Tipo de atendimento:</strong
                                            >
                                            {getValue(acomp.Tipo_Atendimento)}
                                        </p>
                                        <div class="mt-2">
                                            <strong>Síntese:</strong>
                                            <div
                                                class="bg-white p-2 border rounded mt-1 whitespace-pre-wrap"
                                            >
                                                {stripHtml(
                                                    getValue(
                                                        acomp.Sintese,
                                                        "Nenhuma síntese registrada.",
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <div class="mt-2">
                                            <strong
                                                >Encaminhamento/Observações:</strong
                                            >
                                            <div
                                                class="bg-white p-2 border rounded mt-1 whitespace-pre-wrap"
                                            >
                                                {stripHtml(
                                                    getValue(
                                                        acomp.Encaminhamento,
                                                        "Nenhum encaminhamento registrado.",
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <p class="mt-2">
                                            <strong>Encaminhamento Rede:</strong
                                            >
                                            {getValue(
                                                acomp.Encaminhamento_Rede,
                                            )}
                                        </p>
                                        {#if acomp.Especifique_Encaminhamento}
                                            <p>
                                                <strong>Especificação:</strong>
                                                {acomp.Especifique_Encaminhamento}
                                            </p>
                                        {/if}
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    {/if}

                    {#if section.id === "assistencia"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Assistência
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <p>
                                    <strong>CadÚnico:</strong>
                                    {getValue(caseData.assistencia?.Cad_unico)} ({getValue(
                                        caseData.assistencia?.Status_cad_unico,
                                    )})
                                </p>
                                <p>
                                    <strong>Acesso ao CRAS:</strong>
                                    {getValue(
                                        caseData.assistencia?.SPSB_Acesso_cras,
                                    )}
                                </p>
                                <p>
                                    <strong>Recebe Benefícios?:</strong>
                                    {getValue(
                                        caseData.assistencia
                                            ?.BSA_recebe_beneficios,
                                    )}
                                </p>
                                {#if caseData.assistencia?.BSA_recebe_beneficios === "Sim"}
                                    <p>
                                        <strong>Tipo de Benefício:</strong>
                                        {getValue(
                                            caseData.assistencia
                                                ?.BSA_Tipo_beneficio,
                                        )}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "territorio"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Território
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <p>
                                    <strong>Território:</strong>
                                    {getValue(
                                        caseData.habitacaoTerritorio
                                            ?.Territorio,
                                    )}
                                </p>
                                <p>
                                    <strong>Moradia Regular:</strong>
                                    {caseData.habitacaoTerritorio
                                        ?.Moradia_regular
                                        ? "Sim"
                                        : "Não"}
                                </p>
                                <p>
                                    <strong>Material Predominante:</strong>
                                    {getValue(
                                        caseData.habitacaoTerritorio
                                            ?.Estrutura_Mat_predominante,
                                    )}
                                </p>
                                <p>
                                    <strong>Comunidade Tradicional:</strong>
                                    {getValue(
                                        caseData.habitacaoTerritorio
                                            ?.Comunidade_tradicional,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "saude"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Saúde
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <p>
                                    <strong>Condição de Saúde:</strong>
                                    {getValue(
                                        caseData.saude?.HS_Condicao_saude,
                                    )}
                                </p>
                                <p>
                                    <strong>Uso de Álcool:</strong>
                                    {getValue(caseData.saude?.FR_Alcool)}
                                </p>
                                <p>
                                    <strong>Uso de Cigarro:</strong>
                                    {getValue(caseData.saude?.FR_Cigarro)}
                                </p>
                                <p>
                                    <strong>Uso de Subst. Psicoativas:</strong>
                                    {getValue(
                                        caseData.saude?.FR_Subst_psicoativas,
                                    )}
                                </p>
                                <p>
                                    <strong>Impacto na Saúde:</strong>
                                    {getValue(
                                        caseData.saude?.IV_Houve_Impacto_Saude,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "protecaoSeguranca"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Proteção e Segurança
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <p>
                                    <strong>Natureza da Ameaça:</strong>
                                    {getValue(
                                        caseData.protecaoSeguranca
                                            ?.PS_Natureza_Ameaca,
                                    )}
                                </p>
                                <p>
                                    <strong>Ameaça por Autor/Vítima:</strong>
                                    {getValue(
                                        caseData.protecaoSeguranca
                                            ?.PS_Ameaca_Autor_Vitim,
                                    )}
                                </p>
                                <p>
                                    <strong>Tempo da Ameaça:</strong>
                                    {getValue(
                                        caseData.protecaoSeguranca
                                            ?.PS_Tempo_Ameaca,
                                    )}
                                </p>
                            </div>

                            {#if caseData.ameacadores && caseData.ameacadores.length > 0}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                                >
                                    <h3
                                        class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                    >
                                        Ameaçadores
                                    </h3>
                                    <ul class="list-disc pl-6">
                                        {#each caseData.ameacadores as ameaca}
                                            <li>
                                                {ameaca.PSA_Nome_Ameacadores}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}

                            {#if caseData.adolescentes && caseData.adolescentes.length > 0}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                                >
                                    <h3
                                        class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                    >
                                        Adolescentes Envolvidos
                                    </h3>
                                    <ul class="list-disc pl-6">
                                        {#each caseData.adolescentes as adol}
                                            <li>
                                                {adol.PS_ADOLESCENTE_Nome} (Idade:
                                                {adol.PS_ADOLESCENTE_Idade})
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    {#if section.id === "vitimizacao"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Vitimização Secundária e Terciária
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200 mb-4"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Vitimização Secundária
                                </h3>
                                <p>
                                    <strong>Depoimento Repetitivo:</strong>
                                    {getValue(
                                        caseData.vitimizacao
                                            ?.VST_Dep_repet_reviti,
                                    )}
                                </p>
                                <p>
                                    <strong
                                        >Falta de Atendimento Especializado:</strong
                                    >
                                    {getValue(
                                        caseData.vitimizacao
                                            ?.VST_Falta_atend_esp,
                                    )}
                                </p>
                                <p>
                                    <strong
                                        >Demora no Sistema de Justiça:</strong
                                    >
                                    {getValue(
                                        caseData.vitimizacao
                                            ?.VST_Demora_sist_just,
                                    )}
                                </p>
                            </div>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <h3
                                    class="font-bold text-gray-700 border-b border-dashed border-gray-300 pb-1 mb-2"
                                >
                                    Vitimização Terciária
                                </h3>
                                <p>
                                    <strong>Culpabilização da Vítima:</strong>
                                    {getValue(
                                        caseData.vitimizacao?.VT_Culpa_vit,
                                    )}
                                </p>
                                <p>
                                    <strong>Estigmatização Social:</strong>
                                    {getValue(
                                        caseData.vitimizacao?.VT_Estig_social,
                                    )}
                                </p>
                                <p>
                                    <strong>Falta de Políticas Públicas:</strong
                                    >
                                    {getValue(
                                        caseData.vitimizacao
                                            ?.VT_Falta_Poli_publicas,
                                    )}
                                </p>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "referencias"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Referências
                            </h2>
                            <div
                                class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                            >
                                <ul class="list-decimal pl-6 space-y-2">
                                    <li>
                                        <a
                                            href="https://www.mpmg.mp.br/data/files/33/75/B0/3E/C178391041383A19760849A8/Guia%20Metodologico%20Casa%20Lilian.pdf"
                                            target="_blank"
                                            class="text-blue-600 underline"
                                            >Guia Metodológico PAV</a
                                        >
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.cnmp.mp.br/portal/atos-e-normas/norma/8398/"
                                            target="_blank"
                                            class="text-blue-600 underline"
                                            >Resolução 243/2021 do CNMP</a
                                        >
                                    </li>
                                    <li>
                                        <a
                                            href="https://static1.squarespace.com/static/63585aa01220164be2e387b2/t/65a82ce5e47f867b140872ed/1705520358604/DASH+2009+2024.pdf"
                                            target="_blank"
                                            class="text-blue-600 underline"
                                            >DASH 2009-2024 Risk Identification</a
                                        >
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.frontlinedefenders.org/sites/default/files/workbook_portuguese_0_copy.pdf"
                                            target="_blank"
                                            class="text-blue-600 underline"
                                            >Manual de Segurança para Defensores</a
                                        >
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.gov.br/mdh/pt-br/centrais-de-conteudo/ligue-180/FormulrioFRIDA.pdf/view"
                                            target="_blank"
                                            class="text-blue-600 underline"
                                            >Formulário FRIDA</a
                                        >
                                    </li>
                                </ul>
                            </div>
                        </div>
                    {/if}

                    {#if section.id === "encerramento"}
                        <div class="section mb-8 avoid-break">
                            <h2
                                class="text-xl font-bold border-b-2 border-save-primary pb-2 mb-4 text-center"
                            >
                                Encerramento
                            </h2>
                            {#if !caseData.encerramento || !caseData.encerramento.Data}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                                >
                                    <p>
                                        Dados sobre encerramento não
                                        preenchidos.
                                    </p>
                                </div>
                            {:else}
                                <div
                                    class="content-box bg-gray-50 p-4 rounded border border-gray-200"
                                >
                                    <p>
                                        <strong>Data do Encerramento:</strong>
                                        {formatDate(caseData.encerramento.Data)}
                                    </p>
                                    <p>
                                        <strong>Forma:</strong>
                                        {getValue(
                                            caseData.encerramento
                                                .Forma_Encerramento_Caso,
                                        )}
                                    </p>
                                    {#if caseData.encerramento.Forma_Encerramento_Caso === "Outros"}
                                        <p>
                                            <strong>Especificação:</strong>
                                            {getValue(
                                                caseData.encerramento
                                                    .Especifique_Outros,
                                            )}
                                        </p>
                                    {/if}
                                    <div class="mt-2">
                                        <strong>Observações:</strong>
                                        <div
                                            class="bg-white p-2 border rounded mt-1 whitespace-pre-wrap"
                                        >
                                            {getValue(
                                                caseData.encerramento
                                                    .Observacao,
                                                "Nenhuma observação.",
                                            )}
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
{/if}

<style>
    @media print {
        /* Page settings */
        @page {
            margin: 1.5cm;
            size: A4;
        }

        /* Critical: Reset all container heights to allow natural flow */
        /* Critical: Reset all container heights to allow natural flow */
        :global(html),
        :global(body),
        :global(#app),
        .report-container {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
        }

        /* Hide navigation and controls */
        .no-print,
        button,
        :global(nav),
        :global(header:not(.report-container header)) {
            display: none !important;
        }

        /* Ensure report container takes full width */
        .report-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            display: block !important;
        }

        /* Section pagination */
        .section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
        }

        .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        /* Table handling */
        table {
            width: 100% !important;
            border-collapse: collapse;
            page-break-inside: auto;
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }

        /* Ensure colors print */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        /* Remove shadows and unnecessary decorations */
        * {
            box-shadow: none !important;
            text-shadow: none !important;
        }
    }
</style>
