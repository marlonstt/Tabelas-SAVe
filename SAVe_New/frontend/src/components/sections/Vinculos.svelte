<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        familiares: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/vinculos`);
            data = response.data || { familiares: [] };
            if (!data.familiares) data.familiares = [];
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Vinculos");
            data = {
                Qtd_Pessoas_Familia: 3,
                Qtd_Filhos: 1,
                Renda_Familiar_Total: "2500,00",
                Alteracoes_Familiares: "Separação após o ocorrido",
                Vulnerabilidades: "Dependência financeira",
                familiares: [
                    {
                        Nome: "João Silva",
                        Idade: 10,
                        Parentesco: "Filho",
                        Ocupacao: "Estudante",
                        Telefone: "",
                        Mora_Com_Vitima: true,
                        Presenciou_Violencia: true,
                    },
                ],
            };
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    });

    function autosave() {
        if (loading) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                // await api.put(`/cases/${caseId}/vinculos`, data);
                console.log("Autosaving Vinculos...", data);
                await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    $: if (data) autosave();

    function addFamiliar() {
        data.familiares = [
            ...data.familiares,
            {
                Nome: "",
                Idade: "",
                Parentesco: "",
                Ocupacao: "",
                Telefone: "",
                Mora_Com_Vitima: false,
                Presenciou_Violencia: false,
            },
        ];
        autosave();
    }

    function removeFamiliar(index: number) {
        data.familiares = data.familiares.filter((_, i) => i !== index);
        autosave();
    }
</script>

<div class="bg-white rounded shadow p-6 relative">
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
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Composição Familiar Geral -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Composição Familiar
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Qtd. Pessoas na Família</span
                        >
                        <input
                            type="number"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Pessoas_Familia}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Qtd. Filhos/Enteados</span>
                        <input
                            type="number"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Filhos}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Renda Familiar Total (R$)</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Renda_Familiar_Total}
                        />
                    </label>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Alterações na dinâmica familiar</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Alteracoes_Familiares}
                        ></textarea>
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Vulnerabilidades identificadas</span
                        >
                        <textarea
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            rows="2"
                            bind:value={data.Vulnerabilidades}
                        ></textarea>
                    </label>
                </div>
            </div>

            <!-- Membros da Família -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Membros da Família / Rede de Apoio
                </h3>

                {#each data.familiares as familiar, i}
                    <div class="bg-gray-50 p-4 rounded border mb-4 relative">
                        <button
                            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            on:click={() => removeFamiliar(i)}
                        >
                            <span class="material-icons">delete</span>
                        </button>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="block">
                                <span class="text-xs text-gray-500">Nome</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={familiar.Nome}
                                />
                            </label>
                            <label class="block">
                                <span class="text-xs text-gray-500"
                                    >Parentesco</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={familiar.Parentesco}
                                />
                            </label>
                            <label class="block">
                                <span class="text-xs text-gray-500">Idade</span>
                                <input
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={familiar.Idade}
                                />
                            </label>
                            <label class="block">
                                <span class="text-xs text-gray-500"
                                    >Ocupação</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={familiar.Ocupacao}
                                />
                            </label>
                            <label class="block">
                                <span class="text-xs text-gray-500"
                                    >Telefone</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={familiar.Telefone}
                                />
                            </label>

                            <div
                                class="md:col-span-3 flex items-center gap-4 mt-2"
                            >
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        bind:checked={familiar.Mora_Com_Vitima}
                                    />
                                    <span class="ml-2 text-sm"
                                        >Mora com Vítima</span
                                    >
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        bind:checked={
                                            familiar.Presenciou_Violencia
                                        }
                                    />
                                    <span class="ml-2 text-sm"
                                        >Presenciou Violência</span
                                    >
                                </label>
                            </div>
                        </div>
                    </div>
                {/each}

                <button
                    class="text-sm text-save-primary hover:underline"
                    on:click={addFamiliar}>+ Adicionar Familiar</button
                >
            </div>
        </div>
    {/if}
</div>
