<script lang="ts">
  import { onMount } from "svelte";
  import api from "../lib/api";
  import { isGlobalSaving } from "../lib/stores";
  import ConfirmModal from "../components/ConfirmModal.svelte";

  // Import Section Components
  import DadosEntrada from "../components/sections/DadosEntrada.svelte";
  import Identificacao from "../components/sections/Identificacao.svelte";
  import SituacaoJuridica from "../components/sections/SituacaoJuridica.svelte";
  import Saude from "../components/sections/Saude.svelte";
  import Territorio from "../components/sections/Territorio.svelte";
  import Assistencia from "../components/sections/Assistencia.svelte";
  import EnsinoTrabRenda from "../components/sections/EnsinoTrabRenda.svelte";
  import Vinculos from "../components/sections/Vinculos.svelte";
  import ProtecaoSeguranca from "../components/sections/ProtecaoSeguranca.svelte";
  import Agressor from "../components/sections/Agressor.svelte";
  import Vitimizacao from "../components/sections/Vitimizacao.svelte";
  import SinteseAnalitica from "../components/sections/SinteseAnalitica.svelte";
  import Acompanhamento from "../components/sections/Acompanhamento.svelte";
  import Encerramento from "../components/sections/Encerramento.svelte";
  import MatrizRisco from "../components/sections/MatrizRisco.svelte";
  import Referencias from "../components/sections/Referencias.svelte";

  export let id: string; // Prop from router

  let caseData: any = null;
  let loading = true;
  let activeTab = "dadosEntrada";
  let error = "";
  let formType: "breve" | "completo" = "breve";

  // Define all available sections matching formSteps.ts
  const allSections = [
    { id: "dadosEntrada", label: "Dados de Entrada", component: DadosEntrada },
    { id: "identificacao", label: "Identificação", component: Identificacao },
    {
      id: "ensinoTrabRenda",
      label: "Ensino, Trabalho e Renda",
      component: EnsinoTrabRenda,
    },
    { id: "assistencia", label: "Assistência", component: Assistencia },
    {
      id: "territorio",
      label: "Habitação e Território",
      component: Territorio,
    },
    { id: "saude", label: "Saúde", component: Saude },
    { id: "vinculos", label: "Vínculos", component: Vinculos },
    {
      id: "situacaoJuridica",
      label: "Situação Jurídica",
      component: SituacaoJuridica,
    },
    { id: "agressor", label: "Agressor", component: Agressor },
    {
      id: "protecaoSeguranca",
      label: "Proteção e Segurança",
      component: ProtecaoSeguranca,
    },
    { id: "vitimizacao", label: "Vitimização", component: Vitimizacao },
    {
      id: "sinteseAnalitica",
      label: "Síntese Analítica",
      component: SinteseAnalitica,
    },
    {
      id: "acompanhamento",
      label: "Acompanhamento",
      component: Acompanhamento,
    },
    { id: "encerramento", label: "Encerramento", component: Encerramento },
    { id: "matrizRisco", label: "Matriz de Risco", component: MatrizRisco },
    { id: "referencias", label: "Referências", component: Referencias },
  ];

  // Define allowed tabs for Brief version based on formSteps.ts
  const briefTabs = [
    "dadosEntrada",
    "identificacao",
    "situacaoJuridica",
    "protecaoSeguranca",
    "vitimizacao",
  ];

  // Filter sections based on form type
  $: visibleSections =
    formType === "breve"
      ? allSections.filter((s) => briefTabs.includes(s.id))
      : allSections;

  let visitedPages: string[] = [];
  let canDelete = false;
  let showConfirmModal = false;

  // Reactive variable to check if case is archived
  $: isArchived = caseData?.geral?.Encerrado === "Sim";

  function deleteCase() {
    showConfirmModal = true;
  }

  async function confirmDeleteCase() {
    try {
      await api.delete(`/cases/${id}`);
      alert("Caso excluído com sucesso!");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Erro ao excluir caso:", err);
      alert(
        "Erro ao excluir caso: " + (err.response?.data?.error || err.message),
      );
      showConfirmModal = false;
    }
  }

  onMount(async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    canDelete = user.email === "admin@mpmg.mp.br";
    try {
      const response = await api.get(`/cases/${id}`);
      caseData = response.data;
      if (caseData?.geral?.Tipo_Form) {
        const tipo = caseData.geral.Tipo_Form.toLowerCase();
        formType =
          tipo === "completo" ||
          tipo === "versão completa" ||
          tipo === "versao completa"
            ? "completo"
            : "breve";
      }

      // Initialize visited pages
      if (caseData?.geral?.Paginas_Visitadas) {
        visitedPages = caseData.geral.Paginas_Visitadas.split(";").filter(
          (p: string) => p,
        );
      }

      // Mark initial tab as visited
      markPageAsVisited(activeTab);
    } catch (err) {
      console.warn("Backend unavailable, using Mock Data");
      caseData = {
        geral: {
          Nome: "Maria Silva",
          Tipo_Form: "Breve",
        },
      };
    } finally {
      loading = false;
    }
  });

  async function markPageAsVisited(pageId: string) {
    if (!visitedPages.includes(pageId)) {
      visitedPages = [...visitedPages, pageId];
      try {
        await api.put(`/cases/${id}/geral`, {
          Paginas_Visitadas: visitedPages.join(";"),
        });
      } catch (err) {
        console.error("Error saving visited pages:", err);
      }
    }
  }

  async function setFormType(type: "breve" | "completo") {
    const oldType = formType;
    formType = type;

    // If switching to brief and current tab is not allowed, switch to first allowed tab
    if (type === "breve" && !briefTabs.includes(activeTab)) {
      activeTab = "dadosEntrada";
      markPageAsVisited(activeTab);
    }

    try {
      // Persist to backend
      // Map "breve" -> "Breve", "completo" -> "Completo" for backend consistency if needed
      // But backend just saves string, so lowercase is fine if consistent.
      // However, existing data seems to use Title Case ("Breve", "Completo").
      // Let's send Title Case to be safe.
      const typeTitleCase = type.charAt(0).toUpperCase() + type.slice(1);
      await api.put(`/cases/${id}/geral`, { Tipo_Form: typeTitleCase });
    } catch (err) {
      console.error("Error updating form type:", err);
      // Revert on error
      formType = oldType;
      alert("Erro ao salvar tipo de formulário");
    }
  }

  async function reopenCase() {
    if (!confirm("Tem certeza que deseja reabrir este caso?")) {
      return;
    }

    try {
      await api.put(`/cases/${id}/reopen`);
      alert("Caso reaberto com sucesso!");
      window.location.reload();
    } catch (err) {
      console.error("Error reopening case:", err);
      alert("Erro ao reabrir caso");
    }
  }

  function generateReport() {
    window.location.href = `/case/${id}/report`;
  }
</script>

{#if loading}
  <div class="flex items-center justify-center h-screen bg-save-surface">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-save-primary mx-auto mb-4"
      ></div>
      <p class="text-xl text-gray-500 font-medium">
        Carregando detalhes do caso...
      </p>
    </div>
  </div>
{:else if error}
  <div
    class="p-6 bg-red-50 text-red-700 h-screen flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg border border-red-200">
      <h3 class="text-lg font-bold mb-2 flex items-center">
        <span class="material-icons mr-2">error</span> Erro
      </h3>
      <p>{error}</p>
    </div>
  </div>
{:else if caseData}
  <div class="flex flex-col h-screen bg-save-surface font-sans">
    <!-- Archived Case Warning Banner -->
    {#if isArchived}
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 px-6 py-3 flex items-center justify-between"
      >
        <div class="flex items-center">
          <span class="material-icons text-yellow-600 mr-3">lock</span>
          <div>
            <p class="text-yellow-800 font-semibold">
              Caso Arquivado - Somente Leitura
            </p>
            <p class="text-yellow-700 text-sm">
              Este caso foi encerrado e não pode ser editado. Um administrador
              pode reabrir o caso se necessário.
            </p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Header with Gradient -->
    <div
      class="bg-gradient-to-r from-[#464775] to-save-secondary shadow-md px-6 py-4 flex justify-between items-center text-white"
    >
      <div>
        <h2 class="text-2xl font-bold tracking-tight flex items-center">
          <span class="material-icons mr-3 bg-white/20 p-2 rounded-full"
            >article</span
          >
          {caseData.geral?.Nome || "Caso #" + id}
        </h2>
        <p class="text-blue-100 text-sm mt-1 ml-14 opacity-90">
          ID do Caso: {id}
        </p>
      </div>

      <div class="flex items-center gap-3">
        {#if caseData.geral?.Encerrado === "Sim"}
          <button
            on:click={reopenCase}
            class="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 shadow-sm flex items-center gap-1"
          >
            <span class="material-icons text-sm">lock_open</span>
            Reabrir Caso
          </button>
        {/if}

        {#if canDelete}
          <button
            type="button"
            on:click={deleteCase}
            class="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-sm flex items-center gap-1 ml-2"
          >
            <span class="material-icons text-sm">delete</span>
            Excluir
          </button>
        {/if}

        <div class="flex flex-col items-end gap-1.5">
          <button
            on:click={generateReport}
            class="px-3 py-1 text-xs font-bold rounded bg-white/100 hover:bg-white/50 text-save-primary transition-all duration-200 shadow-sm flex items-center justify-center gap-1 w-full"
            style="min-width: 140px;"
          >
            <span class="material-icons text-sm">assignment_turned_in</span>
            Gerar Relatório
          </button>

          <div
            class="flex items-center bg-white/10 backdrop-blur-sm p-0.5 rounded-lg border border-white/20"
          >
            <button
              on:click={() => setFormType("breve")}
              class="px-3 py-1 text-xs rounded-md transition-all duration-200 {formType ===
              'breve'
                ? 'bg-white text-save-primary font-bold shadow-sm'
                : 'text-blue-100 hover:bg-white/10'}"
            >
              Versão Breve
            </button>
            <button
              on:click={() => setFormType("completo")}
              class="px-3 py-1 text-xs rounded-md transition-all duration-200 {formType ===
              'completo'
                ? 'bg-white text-save-primary font-bold shadow-sm'
                : 'text-blue-100 hover:bg-white/10'}"
            >
              Versão Completa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Horizontal Navigation Bar -->
    <div
      class="bg-white border-b border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap px-4 sticky top-0 z-10"
    >
      <nav class="flex space-x-1 py-3">
        {#each visibleSections as section}
          <button
            disabled={$isGlobalSaving}
            on:click={() => {
              if ($isGlobalSaving) return;
              activeTab = section.id;
              markPageAsVisited(section.id);
            }}
            class="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent flex flex-col items-center
                   {activeTab === section.id
              ? 'bg-save-primary text-white shadow-md transform scale-105'
              : 'text-gray-600 hover:bg-gray-100 hover:text-save-primary hover:border-gray-200'}
                   {$isGlobalSaving ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            {section.label}
            {#if visitedPages.includes(section.id)}
              <span
                class="absolute -bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full"
              ></span>
            {/if}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto p-6 bg-save-surface scroll-smooth">
      {#each visibleSections as section}
        {#if activeTab === section.id}
          <div
            class="max-w-6xl mx-auto transition-opacity duration-300 ease-in-out animate-fade-in"
          >
            <!-- Section Header for Print/Context -->
            <div class="mb-6 flex items-center text-gray-700">
              <div class="h-8 w-1 bg-save-accent rounded-full mr-3"></div>
              <h3 class="text-xl font-bold text-gray-800">{section.label}</h3>
            </div>
            {#key id}
              <svelte:component
                this={section.component}
                caseId={id}
                {caseData}
                {isArchived}
              />
            {/key}
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <ConfirmModal
    isOpen={showConfirmModal}
    title="Excluir Caso"
    message="Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita."
    confirmText="Excluir"
    on:close={() => (showConfirmModal = false)}
    on:confirm={confirmDeleteCase}
  />
{/if}

<style>
  /* Custom scrollbar for better aesthetics */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
