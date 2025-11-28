<script lang="ts">
  import { onMount } from "svelte";
  import api from "../lib/api";

  let cases: any[] = [];
  let loading = true;
  let error = "";
  let sortOrder: "asc" | "desc" = "desc";

  let searchId = "";
  let showArchived = false;

  let user = JSON.parse(localStorage.getItem("user") || "{}");

  // Reactive filtering and sorting
  $: filteredCases = cases
    .filter((c) => {
      const matchesId = searchId
        ? c.ID_Caso.toString().includes(searchId)
        : true;
      // If showArchived is true, show all. If false, show only NOT Encerrado (Encerrado !== "Sim")
      const isArchived = c.Encerrado === "Sim";
      const matchesStatus = showArchived ? true : !isArchived;
      return matchesId && matchesStatus;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.ID_Caso - b.ID_Caso
        : b.ID_Caso - a.ID_Caso;
    });

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
      console.error(err);
      alert("Erro ao criar caso. Tente novamente.");
    }
  }

  async function deleteCase(id: number) {
    if (
      !confirm(
        "Tem certeza que deseja excluir este caso? Esta ação apagará todos os dados relacionados e não pode ser desfeita.",
      )
    ) {
      return;
    }
    try {
      await api.delete(`/cases/${id}`);
      cases = cases.filter((c) => c.ID_Caso !== id);
    } catch (err: any) {
      alert(
        "Erro ao excluir caso: " + (err.response?.data?.error || err.message),
      );
    }
  }

  function toggleSort() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    // Sorting is handled by the reactive statement above
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
        Painel de Casos
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Gerencie os atendimentos e acompanhamentos
      </p>
    </div>
    <button
      on:click={createCase}
      class="text-white px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity shadow-sm"
      style="background-color: #6264A7"
    >
      Novo Caso
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center p-20">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-save-primary"
      ></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      {error}
    </div>
  {:else}
    <div
      class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={toggleSort}
              >
                <div class="flex items-center space-x-1">
                  <span>ID</span>
                  <span class="text-xs text-gray-500">
                    {sortOrder === "asc" ? "▲" : "▼"}
                  </span>
                </div>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vítima
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredCases as c (c.ID_Caso)}
              <tr class="hover:bg-gray-50 transition-colors">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  #{c.ID_Caso}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3 text-xs"
                    >
                      {c.Nome ? c.Nome.charAt(0).toUpperCase() : "?"}
                    </div>
                    {c.Nome || "Não informado"}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {c.Data || "N/A"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {c.Tipo_Vitima || "N/A"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      c.Encerrado === "Sim"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {c.Encerrado === "Sim" ? "Arquivado" : "Em Aberto"}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <a
                    href={`/case/${c.ID_Caso}`}
                    class="text-save-primary hover:text-save-secondary font-semibold hover:underline"
                  >
                    Editar
                  </a>
                  {#if user.role === "Admin" || user.role === "admin"}
                    <button
                      on:click={() => deleteCase(c.ID_Caso)}
                      class="text-red-600 hover:text-red-900 ml-4 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Excluir
                    </button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if filteredCases.length === 0}
        <div class="text-center py-12 text-gray-500">
          Nenhum caso encontrado.
        </div>
      {/if}
    </div>

    <!-- Bottom Filters -->
    <div
      class="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center w-full md:w-auto mb-4 md:mb-0">
        <span class="material-icons text-gray-400 mr-2">search</span>
        <input
          type="text"
          placeholder="Pesquisar ID..."
          class="border-gray-300 rounded-md shadow-sm focus:ring-save-primary focus:border-save-primary px-3 py-2 w-full md:w-64"
          bind:value={searchId}
        />
      </div>

      <label class="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          class="form-checkbox text-save-primary h-5 w-5 rounded border-gray-300 focus:ring-save-primary"
          bind:checked={showArchived}
        />
        <span class="ml-2 text-gray-700 font-medium"
          >Mostrar casos Arquivados</span
        >
      </label>
    </div>
  {/if}
</div>
