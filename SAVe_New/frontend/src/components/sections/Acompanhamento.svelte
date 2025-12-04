<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        acompanhamentos: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    let responsaveisList: any[] = [];

    onMount(async () => {
        loadResponsaveis();
        try {
            const response = await api.get(`/cases/${caseId}`);
            const loadedAcompanhamentos = response.data.acompanhamentos || [];

            // Format date to YYYY-MM-DD for input type="date"
            data = {
                acompanhamentos: loadedAcompanhamentos.map((a: any) => ({
                    ...a,
                    Data: a.Data ? a.Data.split("T")[0] : "",
                    Sintese: stripHtml(a.Sintese || ""),
                    Encaminhamento: stripHtml(a.Encaminhamento || ""),
                    _ResponsaveisList: a.Responsaveis
                        ? a.Responsaveis.split(",").filter(
                              (s: string) => s.trim() !== "",
                          )
                        : [],
                })),
            };
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Acompanhamento",
            );
            data = {
                acompanhamentos: [
                    {
                        Data: "2025-11-20",
                        Tipo_Atendimento: "Presencial",
                        Sintese:
                            "Atendimento inicial realizado. Vítima relata medo.",
                        Encaminhamento: "Psicologia",
                        Responsaveis: "Assistente Social Ana",
                    },
                ],
            };
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    });

    function stripHtml(html: string) {
        if (!html) return "";
        // Create a temporary element to use browser's parsing
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || "";
        // Remove extra whitespace
        return text.replace(/\s+/g, " ").trim();
    }

    async function loadResponsaveis() {
        try {
            const response = await api.get("/admin/responsaveis");
            responsaveisList = response.data;
        } catch (error) {
            console.error("Error loading responsaveis:", error);
        }
    }

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/acompanhamentos`, data);
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
                await api.put(`/cases/${caseId}/acompanhamentos`, data);
                console.log("Autosaving Acompanhamento...", data);
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

    function addAcompanhamento() {
        data.acompanhamentos = [
            ...data.acompanhamentos,
            {
                Data: new Date().toISOString().split("T")[0],
                Tipo_Atendimento: "Presencial",
                Sintese: "",
                Encaminhamento: "",
                Encaminhamento_Rede: "",
                Especifique_Encaminhamento: "",
                Responsaveis: "",
                _ResponsaveisList: [],
            },
        ];
        autosave();
    }

    function removeAcompanhamento(index: number) {
        data.acompanhamentos = data.acompanhamentos.filter(
            (_: any, i: number) => i !== index,
        );
        autosave();
    }
</script>

<!-- Main Container with Card Style -->
<div class="bg-white rounded shadow p-10 relative">
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

    <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Acompanhamentos</h2>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Lista de Acompanhamentos -->
            {#each data.acompanhamentos as acomp, i}
                <div class="border p-4 rounded bg-gray-50 relative">
                    <button
                        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        on:click={() => removeAcompanhamento(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Data</span>
                            <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Data}
                                on:input={autosave}
                            />
                        </label>

                        <label class="block">
                            <span class="text-gray-700"
                                >Tipo de Atendimento</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={acomp.Tipo_Atendimento}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Acolhimento emergencial"
                                    >Acolhimento emergencial</option
                                >
                                <option value="Atendimento inicial"
                                    >Atendimento inicial</option
                                >
                                <option value="Atendimentos de acompanhamento"
                                    >Atendimentos de acompanhamento</option
                                >
                                <option value="Orientação">Orientação</option>
                                <option
                                    value="Reuniões para discussão dos casos (interna ou externa)"
                                    >Reuniões para discussão dos casos (interna
                                    ou externa)</option
                                >
                                <option
                                    value="Diligências de articulação de rede (para inclusão e/ou acompanhamento)"
                                    >Diligências de articulação de rede (para
                                    inclusão e/ou acompanhamento)</option
                                >
                                <option
                                    value="Acompanhamento em audiências judiciais"
                                    >Acompanhamento em audiências judiciais</option
                                >
                                <option value="Relatórios multidisciplinares"
                                    >Relatórios multidisciplinares</option
                                >
                                <option
                                    value="Consulta aos autos/diligência jurídica"
                                    >Consulta aos autos/diligência jurídica</option
                                >
                            </select>
                        </label>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700">Síntese</span>
                                <textarea
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    rows="3"
                                    bind:value={acomp.Sintese}
                                    on:input={autosave}
                                ></textarea>
                            </label>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700"
                                    >Encaminhamento para Rede</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={acomp.Encaminhamento_Rede}
                                    on:change={() => {
                                        if (
                                            acomp.Encaminhamento_Rede !==
                                            "Outros"
                                        ) {
                                            acomp.Especifique_Encaminhamento =
                                                "";
                                        }
                                        autosave();
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Rede de proteção à mulher"
                                        >Rede de proteção à mulher</option
                                    >
                                    <option
                                        value="Rede de proteção à criança e adolescente"
                                        >Rede de proteção à criança e
                                        adolescente</option
                                    >
                                    <option value="Rede de proteção social"
                                        >Rede de proteção social</option
                                    >
                                    <option value="Rede de saúde"
                                        >Rede de saúde</option
                                    >
                                    <option value="PROVITA">PROVITA</option>
                                    <option value="PPCAAM">PPCAAM</option>
                                    <option value="PPDDH">PPDDH</option>
                                    <option value="Defensoria pública"
                                        >Defensoria pública</option
                                    >
                                    <option value="Outros">Outros</option>
                                </select>
                            </label>
                        </div>

                        {#if acomp.Encaminhamento_Rede === "Outros"}
                            <div class="md:col-span-2">
                                <label class="block">
                                    <span class="text-gray-700"
                                        >Especifique Encaminhamento</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={
                                            acomp.Especifique_Encaminhamento
                                        }
                                        on:input={autosave}
                                    />
                                </label>
                            </div>
                        {/if}

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700"
                                    >Encaminhamentos</span
                                >
                                <textarea
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    rows="3"
                                    bind:value={acomp.Encaminhamento}
                                    on:input={autosave}
                                ></textarea>
                            </label>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block">
                                <span class="text-gray-700">Responsáveis</span>

                                <!-- Selected Responsibles Tags -->
                                <div class="flex flex-wrap gap-2 mb-2">
                                    {#each acomp._ResponsaveisList as respName, j}
                                        <span
                                            class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded flex items-center"
                                        >
                                            {respName}
                                            <button
                                                type="button"
                                                class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                                on:click={() => {
                                                    acomp._ResponsaveisList.splice(
                                                        j,
                                                        1,
                                                    );
                                                    acomp._ResponsaveisList =
                                                        acomp._ResponsaveisList; // Trigger reactivity
                                                    acomp.Responsaveis =
                                                        acomp._ResponsaveisList.join(
                                                            ",",
                                                        );
                                                    autosave();
                                                }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    {/each}
                                </div>

                                <!-- Add Responsible Dropdown -->
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    value=""
                                    on:change={(e) => {
                                        const selectedName =
                                            e.currentTarget.value;
                                        if (
                                            selectedName &&
                                            !acomp._ResponsaveisList.includes(
                                                selectedName,
                                            )
                                        ) {
                                            acomp._ResponsaveisList = [
                                                ...acomp._ResponsaveisList,
                                                selectedName,
                                            ];
                                            acomp.Responsaveis =
                                                acomp._ResponsaveisList.join(
                                                    ",",
                                                );
                                            autosave();
                                        }
                                        e.currentTarget.value = ""; // Reset dropdown
                                    }}
                                >
                                    <option value=""
                                        >+ Adicionar Responsável...</option
                                    >
                                    {#each responsaveisList as resp}
                                        {#if !acomp._ResponsaveisList.includes(resp.Nome)}
                                            <option value={resp.Nome}>
                                                {resp.Nome} - {resp.Cargo}
                                            </option>
                                        {/if}
                                    {/each}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            {/each}

            <button
                class="text-save-primary hover:underline font-medium"
                on:click={addAcompanhamento}
            >
                + Adicionar Acompanhamento
            </button>

            <!-- Manual Save Button -->
            <div class="flex justify-end mt-4">
                <div class="flex flex-col items-center">
                    <button
                        class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                        on:click={manualSave}
                        disabled={saving || loading}
                    >
                        {saving ? "Salvando..." : "Salvar Dados"}
                    </button>
                    {#if saveStatus.includes("Salvo")}
                        <span class="text-green-600 font-medium mt-2 text-sm"
                            >Salvo com sucesso!</span
                        >
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
