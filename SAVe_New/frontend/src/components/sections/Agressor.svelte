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
    let saveStatus = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            data = { agressores: response.data.agressor || [] };
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

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/agressor`, data);
            saveStatus = "Salvo com sucesso! ✅";
            lastSavedData = JSON.stringify(data);
            setTimeout(() => (saveStatus = ""), 3000);
        } catch (err) {
            console.error("Error saving data:", err);
            saveStatus = "Erro ao salvar ❌";
        } finally {
            saving = false;
        }
    }

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            if (saving) return; // Double check
            saving = true;
            saveStatus = "Salvando...";
            try {
                await api.put(`/cases/${caseId}/agressor`, data);
                console.log("Autosaving Agressor...", data);
                saveStatus = "Salvo! ✅";
                lastSavedData = currentData;
                setTimeout(() => (saveStatus = ""), 2000);
            } catch (err) {
                console.error("Error autosaving", err);
                saveStatus = "Erro ao salvar ❌";
            } finally {
                saving = false;
            }
        }, 2000);
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
        data.agressores = data.agressores.filter(
            (_: any, i: number) => i !== index,
        );
        autosave();
    }
</script>

<!-- Autosave Indicator -->
<div class="relative p-4 space-y-4">
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
            {saveStatus || "Salvo"}
        </span>
    </div>

    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
            Dados do(s) Suposto(s) Autor(es) da Violência
        </h2>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            {#each data.agressores as agressor, i}
                <div class="border p-4 rounded bg-gray-50 relative">
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        on:click={() => removeAgressor(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Nome</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Nome}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Apelido</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Apelido}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Idade</span>
                            <input
                                type="number"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Idade}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Sexo</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Sexo}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Raça/Cor</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Raca}
                                on:change={autosave}
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
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Ocupação</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Ocupacao}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Renda Aproximada</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Renda}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Escolaridade</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Escolaridade}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Fundamental Incompleto"
                                    >Fundamental Incompleto</option
                                >
                                <option value="Fundamental Completo"
                                    >Fundamental Completo</option
                                >
                                <option value="Médio Incompleto"
                                    >Médio Incompleto</option
                                >
                                <option value="Médio Completo"
                                    >Médio Completo</option
                                >
                                <option value="Superior Incompleto"
                                    >Superior Incompleto</option
                                >
                                <option value="Superior Completo"
                                    >Superior Completo</option
                                >
                            </select>
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Endereço</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Endereco}
                                on:input={autosave}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700"
                                >Antecedentes Criminais?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Antecedentes}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não Sabe">Não Sabe</option>
                            </select>
                        </label>
                        <label class="block">
                            <span class="text-gray-700"
                                >Uso de Álcool/Drogas?</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Uso_Drogas}
                                on:input={autosave}
                                placeholder="Especifique se houver"
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Porte de Arma?</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={agressor.Porte_Arma}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                                <option value="Não Sabe">Não Sabe</option>
                            </select>
                        </label>
                    </div>
                </div>
            {/each}

            <button
                class="text-save-primary hover:underline font-medium"
                on:click={addAgressor}
            >
                + Adicionar Agressor
            </button>

            <!-- Manual Save Button -->
            <div class="flex justify-end mt-4">
                <button
                    class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                    on:click={manualSave}
                    disabled={saving || loading}
                >
                    {saving ? "Salvando..." : "Salvar Dados"}
                </button>
            </div>
        </div>
    {/if}
</div>
