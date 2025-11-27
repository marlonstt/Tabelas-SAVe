<script lang="ts">
  import { onMount } from "svelte";
  import api from "../lib/api";

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
      id: "situacaoJuridica",
      label: "Situação Jurídica",
      component: SituacaoJuridica,
    },
    { id: "saude", label: "Saúde", component: Saude },
    {
      id: "territorio",
      label: "Habitação e Território",
      component: Territorio,
    },
    { id: "assistencia", label: "Assistência", component: Assistencia },
    {
      id: "ensinoTrabRenda",
      label: "Ensino, Trabalho e Renda",
      component: EnsinoTrabRenda,
    },
    { id: "vinculos", label: "Vínculos", component: Vinculos },
    {
      id: "protecaoSeguranca",
      label: "Proteção e Segurança",
      component: ProtecaoSeguranca,
    },
    { id: "agressor", label: "Agressor", component: Agressor },
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

  onMount(async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      caseData = response.data;
      if (caseData?.geral?.Tipo_Form) {
        formType =
          caseData.geral.Tipo_Form.toLowerCase() === "completo"
            ? "completo"
            : "breve";
      }
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

  function toggleFormType() {
    formType = formType === "breve" ? "completo" : "breve";
    // If current tab is not in brief mode, switch to first available
    if (formType === "breve" && !briefTabs.includes(activeTab)) {
      activeTab = "dadosEntrada";
    }
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
    <!-- Header with Gradient -->
    <div
      class="bg-gradient-to-r from-save-primary to-save-secondary shadow-md px-6 py-4 flex justify-between items-center text-white"
    >
      <div>
        <h2 class="text-2xl font-bold tracking-tight flex items-center">
          <span class="material-icons mr-3 bg-white/20 p-2 rounded-full"
            >folder_shared</span
          >
          {caseData.geral?.Nome || "Caso #" + id}
        </h2>
        <p class="text-blue-100 text-sm mt-1 ml-14 opacity-90">
          ID do Caso: {id}
        </p>
      </div>

      <div
        class="flex items-center bg-white/10 backdrop-blur-sm p-1 rounded-lg border border-white/20"
      >
        <button
          on:click={() => (formType = "breve")}
          class="px-4 py-1.5 text-sm rounded-md transition-all duration-200 {formType ===
          'breve'
            ? 'bg-white text-save-primary font-bold shadow-sm'
            : 'text-blue-100 hover:bg-white/10'}"
        >
          Versão Breve
        </button>
        <button
          on:click={() => (formType = "completo")}
          class="px-4 py-1.5 text-sm rounded-md transition-all duration-200 {formType ===
          'completo'
            ? 'bg-white text-save-primary font-bold shadow-sm'
            : 'text-blue-100 hover:bg-white/10'}"
        >
          Versão Completa
        </button>
      </div>
    </div>

    <!-- Horizontal Navigation Bar -->
    <div
      class="bg-white border-b border-gray-200 shadow-sm overflow-x-auto whitespace-nowrap px-4 sticky top-0 z-10"
    >
      <nav class="flex space-x-1 py-3">
        {#each visibleSections as section}
          <button
            on:click={() => (activeTab = section.id)}
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent
                   {activeTab === section.id
              ? 'bg-save-primary text-white shadow-md transform scale-105'
              : 'text-gray-600 hover:bg-gray-100 hover:text-save-primary hover:border-gray-200'}"
          >
            {section.label}
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
            <svelte:component this={section.component} caseId={id} />
          </div>
        {/if}
      {/each}
    </div>
  </div>
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
