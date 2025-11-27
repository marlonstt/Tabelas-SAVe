<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        agressores: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/agressor`);
            data = response.data || { agressores: [] };
            if (!data.agressores) data.agressores = [];
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Agressor");
            data = {
                agressores: [
                    {
                        Tipo: "Pessoa Física",
                        Nome: "Carlos Souza",
                        Apelido: "Carlão",
                        Idade: 35,
                        Sexo: "Masculino",
                        Raca: "Parda",
                        Relacao: "Ex-marido",
                        Ocupacao: "Pedreiro",
                        Renda: "2000,00",
                        Escolaridade: "Ensino Médio",
                        Endereco: "Rua B, 123 - Bairro X",
                        Antecedentes: "Sim",
                        Uso_Drogas: "Álcool",
                        Porte_Arma: "Não",
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
                // await api.put(`/cases/${caseId}/agressor`, data);
                console.log("Autosaving Agressor...", data);
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

    function addAgressor() {
        data.agressores = [
            ...data.agressores,
            { Tipo: "Pessoa Física", Nome: "", Endereco: "" },
        ];
        autosave();
    }

    function removeAgressor(index: number) {
        data.agressores = data.agressores.filter((_, i) => i !== index);
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
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
                Perfil do(s) Agressor(es)
            </h3>

            {#each data.agressores as agressor, i}
                <div class="bg-gray-50 p-4 rounded border mb-4 relative">
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        on:click={() => removeAgressor(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Tipo de Agressor</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Tipo}
                            >
                                <option value="Pessoa Física"
                                    >Pessoa Física</option
                                >
                                <option value="Pessoa Jurídica"
                                    >Pessoa Jurídica</option
                                >
                            </select>
                        </label>

                        {#if agressor.Tipo === "Pessoa Física"}
                            <label class="block">
                                <span class="text-gray-700">Nome Civil</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Nome}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Apelido / Alcunha</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Apelido}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Idade Aproximada</span
                                >
                                <input
                                    type="number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Idade}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Sexo</span>
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Sexo}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Raça/Cor</span>
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Raca}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Branca">Branca</option>
                                    <option value="Preta">Preta</option>
                                    <option value="Parda">Parda</option>
                                    <option value="Amarela">Amarela</option>
                                    <option value="Indígena">Indígena</option>
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Relação com a Vítima</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Relacao}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Ocupação</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Ocupacao}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Renda Aproximada</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Renda}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Escolaridade</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Escolaridade}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Antecedentes Criminais?</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Antecedentes}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Uso de Álcool/Drogas?</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Uso_Drogas}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Porte de Arma?</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Porte_Arma}
                                />
                            </label>
                        {:else}
                            <label class="block">
                                <span class="text-gray-700">Razão Social</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.Nome}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">CNPJ</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.CNPJ}
                                />
                            </label>
                        {/if}

                        <label class="block md:col-span-2">
                            <span class="text-gray-700"
                                >Endereço / Localização</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Endereco}
                            />
                        </label>
                    </div>
                </div>
            {/each}

            <button
                class="text-sm text-save-primary hover:underline"
                on:click={addAgressor}>+ Adicionar Agressor</button
            >
        </div>
    {/if}
</div>
