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
            // Renda_Total_Conv is string in model but number input in UI.
            // If it comes as string "1000", it's fine. If empty, maybe "0".
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
            if (saving) return; // Double check
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
        apoioList = apoioList.filter((_, i) => i !== index);
        autosave();
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
        return isNaN(age) ? "" : age + " anos";
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

    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
            Vínculos e Rede de Apoio
        </h2>
        <!-- Manual Save Button -->
        <div class="flex items-center space-x-4">
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
        <div class="space-y-4">
            <!-- Header Row (Desktop) -->
            <div
                class="hidden md:grid grid-cols-12 gap-2 font-bold text-xs text-gray-600 border-b pb-2"
            >
                <div class="col-span-2">Grau Parentesco</div>
                <div class="col-span-2">Nome</div>
                <div class="col-span-1">Data Nasc</div>
                <div class="col-span-1 text-center">Idade</div>
                <div class="col-span-1">Escolaridade</div>
                <div class="col-span-1">Ocupação</div>
                <div class="col-span-1">Renda</div>
                <div class="col-span-1 text-center">Mora c/ Vítima</div>
                <div class="col-span-1 text-center">Presenciou Viol.</div>
                <div class="col-span-1 text-center">Ações</div>
            </div>

            {#each apoioList as item, i}
                <div
                    class="border rounded p-2 md:border-none md:p-0 bg-gray-50 md:bg-transparent mb-2 md:mb-0"
                >
                    <div
                        class="grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
                    >
                        <div class="col-span-2">
                            <label class="md:hidden text-xs font-bold"
                                >Grau Parentesco:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Grau_Parentesco}
                                placeholder="Parentesco"
                            />
                        </div>
                        <div class="col-span-2">
                            <label class="md:hidden text-xs font-bold"
                                >Nome:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Nome}
                                placeholder="Nome"
                            />
                        </div>
                        <div class="col-span-1">
                            <label class="md:hidden text-xs font-bold"
                                >Data Nasc:</label
                            >
                            <input
                                type="date"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Data_Nasc}
                            />
                        </div>
                        <div class="col-span-1 text-center text-xs">
                            <label class="md:hidden font-bold">Idade:</label>
                            {calculateAge(item.AVF_Data_Nasc)}
                        </div>
                        <div class="col-span-1">
                            <label class="md:hidden text-xs font-bold"
                                >Escolaridade:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Escolaridade}
                                placeholder="Escolaridade"
                            />
                        </div>
                        <div class="col-span-1">
                            <label class="md:hidden text-xs font-bold"
                                >Ocupação:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Ocupacao}
                                placeholder="Ocupação"
                            />
                        </div>
                        <div class="col-span-1">
                            <label class="md:hidden text-xs font-bold"
                                >Renda:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Renda}
                                placeholder="Renda"
                            />
                        </div>

                        <!-- Toggles -->
                        <div class="col-span-1 flex flex-col items-center">
                            <label class="md:hidden text-xs font-bold"
                                >Mora c/ Vítima?</label
                            >
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={item.AVF_Mora_Com_Vitima}
                            />
                        </div>
                        <div class="col-span-1 flex flex-col items-center">
                            <label class="md:hidden text-xs font-bold"
                                >Presenciou?</label
                            >
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={item.AVF_Presenciou_Violencia}
                            />
                        </div>
                        <div class="col-span-1 flex flex-col items-center">
                            <label class="md:hidden text-xs font-bold"
                                >Conhece Fato?</label
                            >
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={item.AVF_Conhecimento_Fato}
                            />
                        </div>
                        <div class="col-span-1 flex flex-col items-center">
                            <label class="md:hidden text-xs font-bold"
                                >Rede Apoio?</label
                            >
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                bind:checked={item.AVF_Rede_Apoio}
                            />
                        </div>

                        <!-- Alteração de Vínculo (Full width row inside item) -->
                        <div class="col-span-1 md:col-span-12 mt-2">
                            <label class="text-xs font-bold block"
                                >Alteração de vínculo pós violência:</label
                            >
                            <input
                                type="text"
                                class="w-full text-xs rounded border-gray-300"
                                bind:value={item.AVF_Alt_Vinculo_Pos_Violencia}
                                placeholder="Descreva alteração..."
                            />
                        </div>
                    </div>
                </div>
            {/each}

            <button
                class="mt-4 bg-save-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                on:click={addApoio}
            >
                + Incluir pessoa
            </button>
        </div>

        <!-- Alterações no Sistema Familiar (Container2_29) -->
        <div class="border-b pb-4">
            <div class="block">
                <span class="text-gray-700 font-semibold block mb-1"
                    >Houve alterações no sistema familiar e comunitário em razão
                    da vitimização ou a ela relacionadas?</span
                >
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            bind:group={data.Alt_Fam_Com_Vitim}
                            value="Sim"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            bind:group={data.Alt_Fam_Com_Vitim}
                            value="Não"
                            on:change={() =>
                                (data.Alt_Fam_Com_Vitim_Descr = "")}
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.Alt_Fam_Com_Vitim === "Sim"}
                <label class="block mt-2">
                    <span class="text-gray-700 font-semibold">Descreva:</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Alt_Fam_Com_Vitim_Descr}
                    />
                </label>
            {/if}

            <div class="block mt-4">
                <span class="text-gray-700 font-semibold block mb-1"
                    >Foi identificada vulnerabilidade relacionada aos vínculos
                    familiares e comunitários?</span
                >
                <div class="flex space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            bind:group={data.Vulnerab_Vinculos_Fam}
                            value="Sim"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            bind:group={data.Vulnerab_Vinculos_Fam}
                            value="Não"
                            on:change={() =>
                                (data.Vulnerab_Vinculos_Fam_Descr = "")}
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>
            {#if data.Vulnerab_Vinculos_Fam === "Sim"}
                <label class="block mt-2">
                    <span class="text-gray-700 font-semibold">Descreva:</span>
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Vulnerab_Vinculos_Fam_Descr}
                    />
                </label>
            {/if}
        </div>

        <!-- Vitimização Secundária e Terciária (Container2_31) -->
        <div>
            <div class="block">
                <span class="text-gray-700 font-semibold block mb-1"
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
                            }}
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>

            {#if data.Vulnerab_Vitim_Sec_Ter === "Sim"}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Qual é o tipo de vitimização?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tipo_Vitim}
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
                        />
                    </label>
                </div>
            {/if}
        </div>
    {/if}
</div>
