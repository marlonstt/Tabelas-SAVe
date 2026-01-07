<script lang="ts">
  import { onMount } from "svelte";
  import api from "../lib/api";
  import CaseTypeSelection from "../components/CaseTypeSelection.svelte";

  let cases: any[] = [];
  let loading = true;
  let error = "";
  let sortOrder: "asc" | "desc" = "desc";

  let searchId = "";
  let searchProcessNumber = false;
  let showArchived = false;
  let showCaseTypeSelection = false;

  function openCaseSelection() {
    showCaseTypeSelection = true;
  }

  function closeCaseSelection() {
    showCaseTypeSelection = false;
  }

  async function handleCaseTypeSelect(event: CustomEvent) {
    const type = event.detail; // "Breve" or "Completo"
    closeCaseSelection();

    try {
      const response = await api.post("/cases", { Tipo_Form: type });
      window.location.href = `/case/${response.data.id}`;
    } catch (err: any) {
      console.error(err);
      alert(
        "Erro ao criar caso: " + (err.response?.data?.error || err.message),
      );
    }
  }

  let user = JSON.parse(localStorage.getItem("user") || "{}");

  let sortField = "ID_Caso";

  // Reactive filtering and sorting
  $: filteredCases = cases
    .filter((c) => {
      const matchesId = searchId
        ? c.ID_Caso.toString() === searchId ||
          (c.Nome && c.Nome.toLowerCase().includes(searchId.toLowerCase())) ||
          (searchProcessNumber &&
            c.Num_Processo &&
            c.Num_Processo.includes(searchId))
        : true;
      // If showArchived is true, show all. If false, show only NOT Encerrado (Encerrado !== "Sim")
      const isArchived = c.Encerrado === "Sim";
      const matchesStatus = showArchived ? true : !isArchived;

      // Debug log for case 333
      if (c.ID_Caso === 333) {
        console.log(
          `[FILTRO] Caso 333: Encerrado="${c.Encerrado}", isArchived=${isArchived}, showArchived=${showArchived}, matchesStatus=${matchesStatus}`,
        );
      }

      return matchesId && matchesStatus;
    })
    .sort((a, b) => {
      const fieldA = a[sortField] || "";
      const fieldB = b[sortField] || "";

      if (sortOrder === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
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
          Num_Processo: "12345",
          Comarca: "São Paulo",
          Tipo_Crime: "Violência Doméstica",
        },
        {
          ID_Caso: 2,
          Nome: "João Souza",
          Data: "24/11/2025",
          Encerrado: "Sim",
          Tipo_Vitima: "Idoso",
          Num_Processo: "67890",
          Comarca: "Rio de Janeiro",
          Tipo_Crime: "Abandono",
        },
      ];
    } finally {
      loading = false;
    }
  });

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

  function toggleSort(field: string) {
    if (sortField === field) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortOrder = "asc";
    }
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
      on:click={openCaseSelection}
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
      class="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
    >
      <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("ID_Caso")}
              >
                <div class="flex items-center space-x-1">
                  <span>ID</span>
                  {#if sortField === "ID_Caso"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Num_Processo")}
              >
                <div class="flex items-center space-x-1">
                  <span>N° PROCESSO</span>
                  {#if sortField === "Num_Processo"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Nome")}
              >
                <div class="flex items-center space-x-1">
                  <span>NOME</span>
                  {#if sortField === "Nome"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Comarca")}
              >
                <div class="flex items-center space-x-1">
                  <span>COMARCA</span>
                  {#if sortField === "Comarca"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RESP. PSICOSSOCIAL
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RESP. JURÍDICO
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Tipo_Vitima")}
              >
                <div class="flex items-center space-x-1">
                  <span>TIPO DE VÍTIMA</span>
                  {#if sortField === "Tipo_Vitima"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Tipo_Crime")}
              >
                <div class="flex items-center space-x-1">
                  <span>TIPO DE CRIME</span>
                  {#if sortField === "Tipo_Crime"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                on:click={() => toggleSort("Data")}
              >
                <div class="flex items-center space-x-1">
                  <span>DATA</span>
                  {#if sortField === "Data"}
                    <span class="text-xs text-gray-500">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  {/if}
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredCases as c (c.ID_Caso)}
              <tr
                class="hover:bg-gray-50 transition-colors cursor-pointer {c.Encerrado ===
                'Sim'
                  ? 'bg-gray-300'
                  : ''}"
                on:click={() => (window.location.href = `/case/${c.ID_Caso}`)}
              >
                <td
                  class="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900"
                >
                  #{c.ID_Caso}
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                  {c.Num_Processo || "-"}
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-700">
                  <div class="flex items-center">
                    <div
                      class="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-2 text-xs"
                    >
                      {c.Nome ? c.Nome.charAt(0).toUpperCase() : "?"}
                    </div>
                    {c.Nome || "Não informado"}
                  </div>
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                  {c.Comarca || "-"}
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                  <div
                    class="w-48 max-h-12 overflow-y-auto whitespace-normal break-words bg-gray-50 rounded p-1 border border-gray-100 text-xs"
                  >
                    {c.RespPsicossocial || "-"}
                  </div>
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                  <div
                    class="w-48 max-h-12 overflow-y-auto whitespace-normal break-words bg-gray-50 rounded p-1 border border-gray-100 text-xs"
                  >
                    {c.RespJuridico || "-"}
                  </div>
                </td>
                <td class="px-2 py-1 text-xs text-gray-500">
                  <div
                    class="w-48 max-h-12 overflow-y-auto whitespace-normal break-words bg-gray-50 rounded p-1 border border-gray-100 text-xs"
                  >
                    {c.Tipo_Vitima || "-"}
                  </div>
                </td>
                <td class="px-2 py-1 text-xs text-gray-500">
                  <div
                    class="w-48 max-h-12 overflow-y-auto whitespace-normal break-words bg-gray-50 rounded p-1 border border-gray-100 text-xs"
                  >
                    {c.Tipo_Crime || "-"}
                  </div>
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
                  {c.Data || "-"}
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
      class="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-2xl border border-gray-200"
    >
      <div class="flex items-center w-full md:w-auto mb-4 md:mb-0 space-x-4">
        <div class="relative">
          <span class="material-icons absolute left-3 top-2.5 text-gray-400"
            >search</span
          >
          <input
            type="text"
            placeholder="Pesquisar..."
            class="pl-10 border-gray-300 rounded-md shadow-sm focus:ring-save-primary focus:border-save-primary px-3 py-2 w-full md:w-64 transition-all"
            bind:value={searchId}
          />
        </div>

        <label class="flex items-center cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            class="form-checkbox text-save-primary h-4 w-4 rounded border-gray-300 focus:ring-save-primary"
            bind:checked={searchProcessNumber}
          />
          <span class="ml-2 text-gray-600">Pesquisar nº processo?</span>
        </label>
      </div>

      <label class="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          class="form-checkbox text-save-primary h-5 w-5 rounded border-gray-300 focus:ring-save-primary"
          bind:checked={showArchived}
          on:change={() => {
            console.log(
              `[FILTRO] Checkbox alterado: showArchived = ${showArchived}`,
            );
          }}
        />
        <span class="ml-2 text-gray-700 font-medium"
          >Mostrar casos Arquivados ({showArchived ? "ATIVO" : "INATIVO"})</span
        >
      </label>
    </div>
  {/if}
</div>

{#if showCaseTypeSelection}
  <CaseTypeSelection
    on:select={handleCaseTypeSelect}
    on:close={closeCaseSelection}
  />
{/if}
