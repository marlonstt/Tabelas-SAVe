<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        Secundaria: {},
        Terciaria: {},
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    // Reactive loading when caseId changes
    $: if (caseId) {
        loading = true;
        loadData();
    }

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            const backendData = response.data.vitimizacao || {};

            console.log("Vitimizacao Backend Data:", backendData);

            // Map FLAT backend data to NESTED frontend structure
            data = {
                Secundaria: {
                    VST_Dep_repet_reviti: backendData.VST_Dep_repet_reviti,
                    VST_Espec_Dep_repet_reviti:
                        backendData.VST_Espec_Dep_repet_reviti,
                    VST_Falta_atend_esp: backendData.VST_Falta_atend_esp,
                    VST_Espec_Falta_atend_esp:
                        backendData.VST_Espec_Falta_atend_esp,
                    VST_Falta_info: backendData.VST_Falta_info,
                    VST_Espec_Falta_info: backendData.VST_Espec_Falta_info,
                    VST_Demora_sist_just: backendData.VST_Demora_sist_just,
                    VST_Espec_Demora_sist_just:
                        backendData.VST_Espec_Demora_sist_just,
                    VST_Expos_vitima: backendData.VST_Expos_vitima,
                    VST_Espec_Expos_vitima: backendData.VST_Espec_Expos_vitima,
                    VST_Neg_part_proc: backendData.VST_Neg_part_proc,
                    VST_Espec_Neg_part_proc:
                        backendData.VST_Espec_Neg_part_proc,
                    VST_Neg_apres_prova: backendData.VST_Neg_apres_prova,
                    VST_Espec_Neg_apres_prova:
                        backendData.VST_Espec_Neg_apres_prova,
                    VST_Neg_acesso_dir: backendData.VST_Neg_acesso_dir,
                    VST_Espec_Neg_acesso_dir:
                        backendData.VST_Espec_Neg_acesso_dir,
                    VST_Desresp_sigilo: backendData.VST_Desresp_sigilo,
                    VST_Espec_Desresp_sigilo:
                        backendData.VST_Espec_Desresp_sigilo,
                    VST_Desresp_nome_soc: backendData.VST_Desresp_nome_soc,
                    VST_Espec_Desresp_nome_soc:
                        backendData.VST_Espec_Desresp_nome_soc,
                    VST_Outras_vit: backendData.VST_Outras_vit,
                    VST_Espec_Outras_vit: backendData.VST_Espec_Outras_vit,
                },
                Terciaria: {
                    VT_Culpa_vit: backendData.VT_Culpa_vit,
                    VT_Espec_Culpa_vit: backendData.VT_Espec_Culpa_vit,
                    VT_Estig_social: backendData.VT_Estig_social,
                    VT_Espec_Estig_social: backendData.VT_Espec_Estig_social,
                    VT_Falta_Poli_publicas: backendData.VT_Falta_Poli_publicas,
                    VT_Espec_Falta_Poli_publicas:
                        backendData.VT_Espec_Falta_Poli_publicas,
                    VT_Explo_midiatica: backendData.VT_Explo_midiatica,
                    VT_Espec_Explo_midiatica:
                        backendData.VT_Espec_Explo_midiatica,
                    VT_Outras_vit: backendData.VT_Outras_vit,
                    VT_Espec_Outras_vit: backendData.VT_Espec_Outras_vit,
                },
            };
        } catch (err) {
            console.warn(
                "Backend unavailable or error, using Mock Data for Vitimizacao",
            );
            // Keep empty or set default if needed
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    async function manualSave() {
        if (saving || loading) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/vitimizacao`, data);
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
                await api.put(`/cases/${caseId}/vitimizacao`, data);
                console.log("Autosaving Vitimizacao...", data);
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
</script>

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

    <!--<h2 class="text-xl font-bold text-gray-800 mb-4">Vitimização</h2>  -->

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Vitimização Secundária -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Vitimização Secundária
                </h3>

                <div class="space-y-6">
                    <!-- Helper to render item -->
                    {#each [{ key: "VST_Dep_repet_reviti", label: "Depoimentos repetitivos e revitimização", specKey: "VST_Espec_Dep_repet_reviti" }, { key: "VST_Falta_atend_esp", label: "Falta de atendimento especializado", specKey: "VST_Espec_Falta_atend_esp" }, { key: "VST_Falta_info", label: "Falta de informação", specKey: "VST_Espec_Falta_info" }, { key: "VST_Demora_sist_just", label: "Demora no sistema de justiça", specKey: "VST_Espec_Demora_sist_just" }, { key: "VST_Expos_vitima", label: "Exposição desnecessária da vítima", specKey: "VST_Espec_Expos_vitima" }, { key: "VST_Neg_part_proc", label: "Negativa de participação em atos processuais", specKey: "VST_Espec_Neg_part_proc" }, { key: "VST_Neg_apres_prova", label: "Negativa de apresentar elementos de prova", specKey: "VST_Espec_Neg_apres_prova" }, { key: "VST_Neg_acesso_dir", label: "Negativa de acesso à direitos", specKey: "VST_Espec_Neg_acesso_dir" }, { key: "VST_Desresp_sigilo", label: "Desrespeito ao sigilo", specKey: "VST_Espec_Desresp_sigilo" }, { key: "VST_Desresp_nome_soc", label: "Desrespeito ao nome social", specKey: "VST_Espec_Desresp_nome_soc" }, { key: "VST_Outras_vit", label: "Outras vitimizações", specKey: "VST_Espec_Outras_vit" }] as item}
                        <div
                            class="flex flex-col md:flex-row gap-4 items-start"
                        >
                            <div class="w-full md:w-[400px] flex-shrink-0 pt-6">
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary h-5 w-5"
                                        checked={data.Secundaria[item.key] ===
                                            item.label}
                                        on:change={(e) => {
                                            data.Secundaria[item.key] = e
                                                .currentTarget.checked
                                                ? item.label
                                                : "";
                                            if (!e.currentTarget.checked)
                                                data.Secundaria[item.specKey] =
                                                    "";
                                        }}
                                    />
                                    <span
                                        class="ml-2 font-semibold text-gray-700"
                                        >{item.label}</span
                                    >
                                </label>
                            </div>

                            {#if data.Secundaria[item.key] === item.label}
                                <div class="flex-grow w-full">
                                    <label
                                        class="block text-sm font-semibold text-gray-700 mb-1"
                                        >Se sim, especifique</label
                                    >
                                    <input
                                        type="text"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        bind:value={
                                            data.Secundaria[item.specKey]
                                        }
                                    />
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <!-- Vitimização Terciária -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Vitimização Terciária
                </h3>

                <div class="space-y-6">
                    {#each [{ key: "VT_Culpa_vit", label: "Culpabilização da vítima", specKey: "VT_Espec_Culpa_vit" }, { key: "VT_Estig_social", label: "Estigmatização social", specKey: "VT_Espec_Estig_social" }, { key: "VT_Falta_Poli_publicas", label: "Falta de políticas públicas eficientes", specKey: "VT_Espec_Falta_Poli_publicas" }, { key: "VT_Explo_midiatica", label: "Exploração midiática", specKey: "VT_Espec_Explo_midiatica" }, { key: "VT_Outras_vit", label: "Outras vitimizações", specKey: "VT_Espec_Outras_vit" }] as item}
                        <div
                            class="flex flex-col md:flex-row gap-4 items-start"
                        >
                            <div class="w-full md:w-[400px] flex-shrink-0 pt-6">
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary h-5 w-5"
                                        checked={data.Terciaria[item.key] ===
                                            item.label}
                                        on:change={(e) => {
                                            data.Terciaria[item.key] = e
                                                .currentTarget.checked
                                                ? item.label
                                                : "";
                                            if (!e.currentTarget.checked)
                                                data.Terciaria[item.specKey] =
                                                    "";
                                        }}
                                    />
                                    <span
                                        class="ml-2 font-semibold text-gray-700"
                                        >{item.label}</span
                                    >
                                </label>
                            </div>

                            {#if data.Terciaria[item.key] === item.label}
                                <div class="flex-grow w-full">
                                    <label
                                        class="block text-sm font-semibold text-gray-700 mb-1"
                                        >Se sim, especifique</label
                                    >
                                    <input
                                        type="text"
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        bind:value={
                                            data.Terciaria[item.specKey]
                                        }
                                    />
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
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
