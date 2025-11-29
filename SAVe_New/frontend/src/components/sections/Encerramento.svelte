<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    // Reset data when caseId changes
    $: if (caseId) {
        data = {
            Data_Encerramento: "",
            Forma_Encerramento: "",
            Especifique_Outros: "",
            Observacao: "",
            Encaminhamento_Pos_Alta: "",
        };
        loading = true;
        loadData();
    }

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            data = response.data.encerramento || {};
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                console.log(
                    "No data found for Encerramento, initializing empty.",
                );
                data = {
                    Data_Encerramento: "",
                    Forma_Encerramento: "",
                    Especifique_Outros: "",
                    Observacao: "",
                    Encaminhamento_Pos_Alta: "",
                };
            } else {
                console.warn(
                    "Backend unavailable, using Mock Data for Encerramento",
                );
                data = {
                    Data_Encerramento: "",
                    Forma_Encerramento: "",
                    Especifique_Outros: "",
                    Observacao: "",
                    Encaminhamento_Pos_Alta: "",
                };
            }
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    onMount(() => {
        loadData();
    });

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/encerramento`, data);
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
                await api.put(`/cases/${caseId}/encerramento`, data);
                console.log("Autosaving Encerramento...", data);
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

    async function finalizeCase() {
        if (
            !confirm(
                "Tem certeza que deseja encerrar este caso? Esta ação arquivará o caso.",
            )
        ) {
            return;
        }
        // Logic to finalize (e.g., set date if empty and save)
        if (!data.Data_Encerramento) {
            data.Data_Encerramento = new Date().toISOString().split("T")[0];
        }
        await manualSave();
    }
</script>

<div class="space-y-4 p-4">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Encerramento do Caso</h2>
        <!-- Manual Save Button and Status -->
        <div class="flex items-center space-x-4">
            <span
                class="text-sm font-medium"
                class:text-green-600={saveStatus.includes("✅")}
                class:text-red-600={saveStatus.includes("❌")}
                >{saveStatus}</span
            >
            <button
                class="bg-save-primary text-white px-4 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                on:click={manualSave}
                disabled={saving || loading}
            >
                {saving ? "Salvando..." : "Salvar"}
            </button>
        </div>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="grid grid-cols-1 gap-4">
            <label class="block">
                <span class="text-gray-700">Data de Encerramento</span>
                <input
                    type="date"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    bind:value={data.Data_Encerramento}
                    on:input={autosave}
                />
            </label>

            <label class="block">
                <span class="text-gray-700">Forma de Encerramento</span>
                <select
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    bind:value={data.Forma_Encerramento}
                    on:change={autosave}
                >
                    <option value="">Selecione...</option>
                    <option value="Alta">Alta</option>
                    <option value="Evasão">Evasão</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Óbito">Óbito</option>
                    <option value="Outros">Outros</option>
                </select>
            </label>

            {#if data.Forma_Encerramento === "Outros"}
                <label class="block">
                    <span class="text-gray-700">Especifique</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Especifique_Outros}
                        on:input={autosave}
                    />
                </label>
            {/if}

            <label class="block">
                <span class="text-gray-700">Encaminhamento Pós-Alta</span>
                <input
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    bind:value={data.Encaminhamento_Pos_Alta}
                    on:input={autosave}
                />
            </label>

            <label class="block">
                <span class="text-gray-700">Observações Finais</span>
                <textarea
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                    rows="4"
                    bind:value={data.Observacao}
                    on:input={autosave}
                ></textarea>
            </label>
        </div>

        <div class="mt-6 flex justify-end">
            <button
                class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition shadow flex items-center"
                on:click={finalizeCase}
            >
                <span class="material-icons mr-2">lock</span> Encerrar Caso
            </button>
        </div>
    {/if}
</div>
