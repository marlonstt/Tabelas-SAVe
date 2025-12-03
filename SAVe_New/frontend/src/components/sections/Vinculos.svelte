<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let apoioList: any[] = [];
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            data = response.data.vinculos || {};
            apoioList = response.data.vinculosApoio || [];

            // Initialize default values if empty
            if (!data.Qtd_Pessoas_Fam) data.Qtd_Pessoas_Fam = 0;
            if (!data.Qtd_Filhos_Ent) data.Qtd_Filhos_Ent = 0;
            if (!data.Num_Filhos_Dep) data.Num_Filhos_Dep = 0;
            if (!data.Num_Enteados_Dep) data.Num_Enteados_Dep = 0;
            if (!data.Renda_Total_Conv) data.Renda_Total_Conv = 0;
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Vinculos");
            data = {};
            apoioList = [];
        } finally {
            loading = false;
            lastSavedData = JSON.stringify({
                vinculos: data,
                vinculosApoio: apoioList,
            });
        }
    });

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/vinculos`, {
                vinculos: data,
                vinculosApoio: apoioList,
            });
            saveStatus = "Salvo com sucesso! ✅";
            lastSavedData = JSON.stringify({
                vinculos: data,
                vinculosApoio: apoioList,
            });
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

        const currentData = JSON.stringify({
            vinculos: data,
            vinculosApoio: apoioList,
        });
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            if (saving) return;
            saving = true;
            saveStatus = "Salvando...";
            try {
                await api.put(`/cases/${caseId}/vinculos`, {
                    vinculos: data,
                    vinculosApoio: apoioList,
                });
                console.log("Autosaving Vinculos...", data);
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

    function addApoio() {
        apoioList = [
            ...apoioList,
            {
                AVF_Grau_Parentesco: "",
                AVF_Nome: "",
                AVF_Data_Nasc: "",
                AVF_Escolaridade: "",
                AVF_Ocupacao: "",
                AVF_Renda: "",
                AVF_Mora_Com_Vitima: false,
                AVF_Presenciou_Violencia: false,
                AVF_Conhecimento_Fato: false,
                AVF_Alt_Vinculo_Pos_Violencia: "",
                AVF_Rede_Apoio: false,
            },
        ];
        autosave();
    }

    function removeApoio(index: number) {
        if (apoioList.length > 1) {
            apoioList = apoioList.filter((_, i) => i !== index);
            autosave();
        }
    }

    function calculateAge(dateString: string) {
        if (!dateString) return "";
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return isNaN(age) ? "" : age;
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
        <h2 class="text-xl font-bold text-gray-800">
            Vínculos e Rede de Apoio
        </h2>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Container2_28: Dados Numéricos -->
            <div class="border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-sm"
                            >Quantidade de pessoas no grupo familiar:</span
                        >
                        <input
                            type="number"
                            min="0"
                            max="99"
                            class="md:col-span-2 md:w-[270px] block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Pessoas_Fam}
                            on:input={autosave}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-sm"
                            >Quantidade de filhas/os ou enteadas/os:</span
                        >
                        <input
                            type="number"
                            min="0"
                            max="99"
                            class="md:col-span-2 md:w-[270px] block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Filhos_Ent}
                            on:input={autosave}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-sm"
                            >Nº de filhas/os dependentes:</span
                        >
                        <input
                            type="number"
                            min="0"
                            max="99"
                            class="md:col-span-2 md:w-[270px] block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Num_Filhos_Dep}
                            on:input={autosave}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-sm"
                            >Nº de enteadas/os dependentes:</span
                        >
                        <input
                            type="number"
                            min="0"
                            max="99"
                            class="md:col-span-2 md:w-[270px] block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Num_Enteados_Dep}
                            on:input={autosave}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-sm"
                            >Renda total (grupo de convivência):</span
                        >
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            class="md:col-span-2 md:w-[270px] block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Renda_Total_Conv}
                            on:input={autosave}
                        />
                    </label>
                </div>
            </div>

            <!-- Container2_30: Galeria de Pessoas (Apoio Familiar) -->
            <div class="border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    Grupo Familiar e Rede de Apoio
                </h3>

                {#each apoioList as item, i}
                    <div
                        class="border-2 border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
                    >
                        <!-- Linha 1: Dados Básicos -->
                        <div class="mb-3">
                            <div class="grid grid-cols-1 md:grid-cols-8 gap-3">
                                <!-- Número -->
                                <div class="md:col-span-2 md:w-[50px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Nº</label
                                    >
                                    <div
                                        class="text-center text-sm font-semibold bg-white rounded p-2 border border-gray-300"
                                    >
                                        {i + 1}
                                    </div>
                                </div>

                                <!-- Nome -->
                                <div class="md:col-span-2">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Nome</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Nome}
                                        on:input={autosave}
                                        placeholder="Nome completo"
                                    />
                                </div>

                                <!-- Grau Parentesco -->
                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Grau de parentesco</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Grau_Parentesco}
                                        on:input={autosave}
                                        placeholder="Parentesco"
                                    />
                                </div>

                                <!-- Data Nascimento -->
                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Data de nascimento</label
                                    >
                                    <input
                                        type="date"
                                        class="w-full text-sm text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Data_Nasc}
                                        on:change={autosave}
                                    />
                                </div>

                                <!-- Idade -->
                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Idade</label
                                    >
                                    <div
                                        class="text-center text-sm bg-white rounded p-2 border border-gray-300"
                                    >
                                        {calculateAge(item.AVF_Data_Nasc) ||
                                            "-"}
                                    </div>
                                </div>

                                <!-- Escolaridade -->
                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Escolaridade</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Escolaridade}
                                        on:input={autosave}
                                        placeholder="Escolaridade"
                                    />
                                </div>

                                <!-- Ocupação -->
                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Ocupação</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Ocupacao}
                                        on:input={autosave}
                                        placeholder="Ocupação"
                                    />
                                </div>

                                <div class="md:col-span-2 md:w-[150px]">
                                    <label
                                        class="block text-xs font-bold text-gray-700 mb-1"
                                        >Renda</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={item.AVF_Renda}
                                        on:input={autosave}
                                        placeholder="R$ 0,00"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Linha 2: Checkboxes e Campos Adicionais -->
                        <div class="border-t pt-3">
                            <div
                                class="grid grid-cols-1 md:grid-cols-5 gap-3 items-start"
                            >
                                <!-- Mora com Vítima -->
                                <div class="flex flex-col">
                                    <label
                                        class="text-xs font-bold text-gray-700 mb-2"
                                        >Mora com a vítima?</label
                                    >
                                    <div
                                        class="flex items-center justify-left h-10"
                                    >
                                        <input
                                            type="checkbox"
                                            class="form-checkbox text-save-primary w-5 h-5"
                                            bind:checked={
                                                item.AVF_Mora_Com_Vitima
                                            }
                                            on:change={autosave}
                                        />
                                    </div>
                                </div>

                                <!-- Presenciou Violência -->
                                <div class="flex flex-col">
                                    <label
                                        class="text-xs font-bold text-gray-700 mb-2"
                                        >Presenciou a violência?</label
                                    >
                                    <div
                                        class="flex items-center justify-left h-10"
                                    >
                                        <input
                                            type="checkbox"
                                            class="form-checkbox text-save-primary w-5 h-5"
                                            bind:checked={
                                                item.AVF_Presenciou_Violencia
                                            }
                                            on:change={autosave}
                                        />
                                    </div>
                                </div>

                                <!-- Conhecimento Fato -->
                                <div class="flex flex-col">
                                    <label
                                        class="text-xs font-bold text-gray-700 mb-2"
                                        >Conhecimento do fato?</label
                                    >
                                    <div
                                        class="flex items-center justify-left h-10"
                                    >
                                        <input
                                            type="checkbox"
                                            class="form-checkbox text-save-primary w-5 h-5"
                                            bind:checked={
                                                item.AVF_Conhecimento_Fato
                                            }
                                            on:change={autosave}
                                        />
                                    </div>
                                </div>
                                <!-- Rede Apoio -->
                                <div class="flex flex-col">
                                    <label
                                        class="text-xs font-bold text-gray-700 mb-2"
                                        >É rede de apoio?</label
                                    >
                                    <div
                                        class="flex items-center justify-left h-10"
                                    >
                                        <input
                                            type="checkbox"
                                            class="form-checkbox text-save-primary w-5 h-5"
                                            bind:checked={item.AVF_Rede_Apoio}
                                            on:change={autosave}
                                        />
                                    </div>
                                </div>

                                <!-- Alteração Vínculo -->
                                <div class="flex flex-col md:col-span-1">
                                    <label
                                        class="text-xs font-bold text-gray-700 mb-2"
                                        >Alteração de vínculo pós violência</label
                                    >
                                    <input
                                        type="text"
                                        class="w-full text-sm rounded border-gray-300"
                                        bind:value={
                                            item.AVF_Alt_Vinculo_Pos_Violencia
                                        }
                                        on:input={autosave}
                                        placeholder="Descreva..."
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Botão Remover -->
                        {#if apoioList.length > 1}
                            <div class="flex justify-end mt-3">
                                <button
                                    class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                    on:click={() => removeApoio(i)}
                                >
                                    × Remover pessoa
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}

                <button
                    class="mt-4 bg-save-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                    on:click={addApoio}
                >
                    Incluir pessoa
                </button>
            </div>

            <!-- Container2_29: Alterações no Sistema Familiar -->
            <div class="border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                <div class="block">
                    <span class="text-gray-700 font-semibold block mb-2"
                        >Houve alterações no sistema familiar e comunitário em
                        razão da vitimização ou a ela relacionadas?</span
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Alt_Fam_Com_Vitim}
                                value="Sim"
                                on:change={autosave}
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Alt_Fam_Com_Vitim}
                                value="Não"
                                on:change={() => {
                                    data.Alt_Fam_Com_Vitim_Descr = "";
                                    autosave();
                                }}
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>
                {#if data.Alt_Fam_Com_Vitim === "Sim"}
                    <label class="block mt-3">
                        <span class="text-gray-700 font-semibold"
                            >Descreva:</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Alt_Fam_Com_Vitim_Descr}
                            on:input={autosave}
                        />
                    </label>
                {/if}

                <div class="block mt-4">
                    <span class="text-gray-700 font-semibold block mb-2"
                        >Foi identificada vulnerabilidade relacionada aos
                        vínculos familiares e comunitários?</span
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Vulnerab_Vinculos_Fam}
                                value="Sim"
                                on:change={autosave}
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Vulnerab_Vinculos_Fam}
                                value="Não"
                                on:change={() => {
                                    data.Vulnerab_Vinculos_Fam_Descr = "";
                                    autosave();
                                }}
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>
                {#if data.Vulnerab_Vinculos_Fam === "Sim"}
                    <label class="block mt-3">
                        <span class="text-gray-700 font-semibold"
                            >Descreva:</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Vulnerab_Vinculos_Fam_Descr}
                            on:input={autosave}
                        />
                    </label>
                {/if}
            </div>

            <!-- Container2_31: Vitimização Secundária e Terciária -->
            <div class="border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                <div class="block">
                    <span class="text-gray-700 font-semibold block mb-2"
                        >Vítima identificada como vulnerável à vitimização
                        secundária e terciária?</span
                    >
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Vulnerab_Vitim_Sec_Ter}
                                value="Sim"
                                on:change={autosave}
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                bind:group={data.Vulnerab_Vitim_Sec_Ter}
                                value="Não"
                                on:change={() => {
                                    data.Tipo_Vitim = "";
                                    data.Tipo_Vitim_Descr = "";
                                    autosave();
                                }}
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                {#if data.Vulnerab_Vitim_Sec_Ter === "Sim"}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <label class="block">
                            <span class="text-gray-700 font-semibold"
                                >Qual é o tipo de vitimização?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Tipo_Vitim}
                                on:change={autosave}
                            >
                                <option value="">Selecione...</option>
                                <option value="Secundária">Secundária</option>
                                <option value="Terciária">Terciária</option>
                            </select>
                        </label>
                        <label class="block">
                            <span class="text-gray-700 font-semibold"
                                >Descreva:</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Tipo_Vitim_Descr}
                                on:input={autosave}
                            />
                        </label>
                    </div>
                {/if}
            </div>

            <!-- Manual Save Button -->
            <div class="flex justify-end mt-6">
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
