<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import api from "../lib/api";

  let cases: any[] = [];
  let loading = true;
  let error = "";

  onMount(async () => {
    try {
      const response = await api.get("/cases");
      cases = response.data;
    } catch (err) {
      console.warn("Backend unavailable, using Mock Data");
      cases = [
        {
          ID_Caso: 1,
          Nome: "Maria Silva",
          Data: "25/11/2025",
          Encerrado: "Não",
          Tipo_Vitima: "Mulher",
        },
        {
          ID_Caso: 2,
          Nome: "João Souza",
          Data: "24/11/2025",
          Encerrado: "Sim",
          Tipo_Vitima: "Idoso",
        },
        {
          ID_Caso: 3,
          Nome: "Ana Pereira",
          Data: "23/11/2025",
          Encerrado: "Não",
          Tipo_Vitima: "Criança",
        },
      ];
    } finally {
      loading = false;
    }
  });

  async function createCase() {
    try {
      const response = await api.post("/cases", {});
      window.location.href = `/case/${response.data.id}`;
    } catch (err) {
      // Demo create
      const newId = cases.length + 1;
      window.location.href = `/case/${newId}`;
    }
  }
</script>

<div>
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight">
        Painel de Casos
      </h1>
      <p class="text-gray-500 mt-1">
        Gerencie os atendimentos e acompanhamentos
      </p>
    </div>
    <button
      on:click={createCase}
      class="bg-save-primary text-white px-5 py-2.5 rounded-lg hover:bg-save-secondary transition-all shadow-md flex items-center font-medium"
    >
      <span class="material-icons mr-2 text-sm">add</span> Novo Caso
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center p-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-save-primary"
      ></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      {error}
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each cases as c}
        <div
          class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-save-primary font-bold mr-3 group-hover:bg-save-primary group-hover:text-white transition-colors"
              >
                {c.ID_Caso}
              </div>
              <div>
                <h3
                  class="text-lg font-bold text-gray-800 group-hover:text-save-primary transition-colors"
                >
                  Caso #{c.ID_Caso}
                </h3>
              </div>
            </div>
            <span
              class={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${c.Encerrado === "Sim" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`}
            >
              {c.Encerrado === "Sim" ? "Encerrado" : "Em Aberto"}
            </span>
          </div>

          <div class="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-600 text-sm flex justify-between">
              <span class="font-medium text-gray-500">Vítima:</span>
              <span class="font-semibold text-gray-800"
                >{c.Nome || "Não informado"}</span
              >
            </p>
            <p class="text-gray-600 text-sm flex justify-between">
              <span class="font-medium text-gray-500">Data:</span>
              <span>{c.Data || "N/A"}</span>
            </p>
            <p class="text-gray-600 text-sm flex justify-between">
              <span class="font-medium text-gray-500">Tipo:</span>
              <span>{c.Tipo_Vitima || "N/A"}</span>
            </p>
          </div>

          <Link
            to={`/case/${c.ID_Caso}`}
            class="block w-full text-center bg-white border border-save-primary text-save-primary py-2.5 rounded-lg hover:bg-save-primary hover:text-white transition-all font-bold shadow-sm"
          >
            Ver Detalhes
          </Link>
        </div>
      {/each}
    </div>
  {/if}
</div>
