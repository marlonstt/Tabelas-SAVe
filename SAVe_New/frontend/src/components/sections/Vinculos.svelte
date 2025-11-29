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

    function autosave() {
        if (loading) return;

        const currentData = JSON.stringify({
            vinculos: data,
            vinculosApoio: apoioList,
        });
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                await api.put(`/cases/${caseId}/vinculos`, {
                    vinculos: data,
                    vinculosApoio: apoioList,
                });
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

    $: if (data || apoioList) autosave();
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
            <!-- Composição Familiar (Container2_28) -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Composição Familiar
                </h3>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-xs"
                            >Quantidade de pessoas no grupo familiar:</span
                        >
                        <input
                            type="number"
                            min="0"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Pessoas_Fam}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-xs"
                            >Quantidade de filhas/os ou enteadas/os:</span
                        >
                        <input
                            type="number"
                            min="0"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Qtd_Filhos_Ent}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-xs"
                            >Nº de filhas/os dependentes:</span
                        >
                        <input
                            type="number"
                            min="0"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Num_Filhos_Dep}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-xs"
                            >Nº de enteadas/os dependentes:</span
                        >
                        <input
                            type="number"
                            min="0"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Num_Enteados_Dep}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700 font-semibold text-xs"
                            >Renda total (grupo de convivência):</span
                        >
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Renda_Total_Conv}
                        />
                    </label>
                </div>
            </div>

            <!-- Lista de Familiares/Apoio (Container2_30) -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Membros da Família e Rede de Apoio
                </h3>

                <!-- Headers -->
                <div
                    class="hidden md:grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-gray-700 text-center"
                >
                    <div class="col-span-1">Grau Parentesco</div>
                    <div class="col-span-2">Nome</div>
                    <div class="col-span-1">Data Nasc.</div>
                    <div class="col-span-1">Idade</div>
                    <div class="col-span-1">Escolaridade</div>
                    <div class="col-span-1">Ocupação</div>
                    <div class="col-span-1">Renda</div>
                    <div class="col-span-1">Mora com Vítima?</div>
                    <div class="col-span-1">Presenciou Violência?</div>
                    <div class="col-span-1">Conhece Fato?</div>
                    <div class="col-span-1">Rede Apoio?</div>
                </div>

                <div class="space-y-4">
                    {#each apoioList as item, index}
                        <div
                            class="grid grid-cols-1 md:grid-cols-12 gap-2 items-center border p-2 rounded bg-gray-50 relative"
                        >
                            <!-- Delete Button (Top right on mobile, inline on desktop) -->
                            <button
                                class="absolute top-0 right-0 md:relative md:top-auto md:right-auto text-red-500 hover:text-red-700 font-bold p-1"
                                on:click={() => removeApoio(index)}
                                title="Remover"
                            >
                                x
                            </button>

                            <div class="col-span-1">
                                <label class="md:hidden text-xs font-bold"
                                    >Parentesco:</label
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
                                <label class="md:hidden font-bold">Idade:</label
                                >
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
                                    bind:value={
                                        item.AVF_Alt_Vinculo_Pos_Violencia
                                    }
                                    placeholder="Descreva alteração..."
                                />
                            </div>
                        </div>
                    {/each}
                </div>

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
                        <span class="text-gray-700 font-semibold"
                            >Descreva:</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Alt_Fam_Com_Vitim_Descr}
                        />
                    </label>
                {/if}

                <div class="block mt-4">
                    <span class="text-gray-700 font-semibold block mb-1"
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
                        <span class="text-gray-700 font-semibold"
                            >Descreva:</span
                        >
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
        </div>
    {/if}
</div>
