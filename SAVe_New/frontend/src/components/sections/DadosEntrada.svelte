<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        casosRelacionados: [],
        crimes: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/dados-entrada`);
            data = response.data || {};
            // Ensure arrays exist
            if (!data.casosRelacionados) data.casosRelacionados = [];
            if (!data.crimes) data.crimes = [];
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                // Case exists but no data for this section yet -> Init empty
                console.log(
                    "No data found for this section, initializing empty.",
                );
                data = {
                    Data: new Date().toISOString().split("T")[0],
                    Comarca_origem: "",
                    N_procedimento_MPE: "",
                    Precisa_Atendimento_Esp: "Não",
                    Quem_encaminha: "",
                    PE_nome: "",
                    PE_telefone: "",
                    PE_email: "",
                    PE_cargo: "",
                    Possui_Relacionado: "Não",
                    casosRelacionados: [],
                    Tipo_Vitima: "",
                    crimes: [],
                    Observacao: "",
                };
            } else {
                console.warn(
                    "Backend unavailable or error, using Mock Data for DadosEntrada",
                );
                data = {
                    Data: new Date().toISOString().split("T")[0],
                    Comarca_origem: "Belo Horizonte",
                    N_procedimento_MPE: "",
                    Precisa_Atendimento_Esp: "Não",
                    Quem_encaminha: "MPMG",
                    PE_nome: "",
                    PE_telefone: "",
                    PE_email: "",
                    PE_cargo: "",
                    Possui_Relacionado: "Não",
                    casosRelacionados: [],
                    Tipo_Vitima: "",
                    crimes: [], // Will store selected crimes
                    Observacao: "",
                };
            }
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
                // await api.put(`/cases/${caseId}/dados-entrada`, data);
                console.log("Autosaving...", data);
                // Simulate network delay
                await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000); // Debounce 1s
    }

    // Reactive statement to trigger autosave on data change
    $: if (data) autosave();

    function addCasoRelacionado() {
        data.casosRelacionados = [
            ...data.casosRelacionados,
            { id: "", motivo: "" },
        ];
        autosave();
    }

    function removeCasoRelacionado(index: number) {
        data.casosRelacionados = data.casosRelacionados.filter(
            (_, i) => i !== index,
        );
        autosave();
    }

    function toggleCrime(crime: string) {
        if (data.crimes.includes(crime)) {
            data.crimes = data.crimes.filter((c) => c !== crime);
        } else {
            data.crimes = [...data.crimes, crime];
        }
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Seção 1: Informações Básicas -->
            <div class="md:col-span-2 border-b pb-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Informações Básicas
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Data de Entrada</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Comarca de Origem</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Comarca_origem}
                        >
                            <option value="">Selecione...</option>
                            <option value="Belo Horizonte"
                                >Belo Horizonte</option
                            >
                            <option value="Contagem">Contagem</option>
                            <option value="Uberlândia">Uberlândia</option>
                            <option value="Juiz de Fora">Juiz de Fora</option>
                            <option value="Betim">Betim</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Nº Procedimento / Sistema MPE</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.N_procedimento_MPE}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Tipo de Vítima</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tipo_Vitima}
                        >
                            <option value="">Selecione...</option>
                            <option value="Mulher">Mulher</option>
                            <option value="Criança/Adolescente"
                                >Criança/Adolescente</option
                            >
                            <option value="Idoso">Idoso</option>
                            <option value="Pessoa com Deficiência"
                                >Pessoa com Deficiência</option
                            >
                            <option value="Outros">Outros</option>
                        </select>
                    </label>
                </div>
            </div>

            <!-- Atendimento Especial -->
            <div class="md:col-span-2 border-b pb-4 mb-4">
                <label class="block font-medium text-gray-700 mb-2"
                    >Precisa de atendimento especial?</label
                >
                <div class="flex gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            name="atendimentoEspecial"
                            value="Sim"
                            bind:group={data.Precisa_Atendimento_Esp}
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            class="form-radio text-save-primary"
                            name="atendimentoEspecial"
                            value="Não"
                            bind:group={data.Precisa_Atendimento_Esp}
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>

                {#if data.Precisa_Atendimento_Esp === "Sim"}
                    <div class="mt-4">
                        <label class="block">
                            <span class="text-gray-700"
                                >Qual tipo de atendimento?</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Atendimento_Especial}
                            />
                        </label>
                    </div>
                {/if}
            </div>

            <!-- Seção 2: Quem Encaminha -->
            <div class="md:col-span-2 border-b pb-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Quem Encaminha
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Instituição</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Quem_encaminha}
                        >
                            <option value="">Selecione...</option>
                            <option value="MPMG">MPMG</option>
                            <option value="Polícia Civil">Polícia Civil</option>
                            <option value="Polícia Militar"
                                >Polícia Militar</option
                            >
                            <option value="Defensoria Pública"
                                >Defensoria Pública</option
                            >
                            <option value="CRAS/CREAS">CRAS/CREAS</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Demanda Espontânea"
                                >Demanda Espontânea</option
                            >
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Nome do Profissional</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.PE_nome}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Cargo/Função</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.PE_cargo}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Telefone</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.PE_telefone}
                        />
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Email</span>
                        <input
                            type="email"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.PE_email}
                        />
                    </label>
                </div>
            </div>

            <!-- Casos Relacionados -->
            <div class="md:col-span-2 border-b pb-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Casos Relacionados
                </h3>
                <div class="mb-4">
                    <label class="block font-medium text-gray-700 mb-2"
                        >Possui relação com outro caso?</label
                    >
                    <div class="flex gap-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                name="relacionado"
                                value="Sim"
                                bind:group={data.Possui_Relacionado}
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary"
                                name="relacionado"
                                value="Não"
                                bind:group={data.Possui_Relacionado}
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                {#if data.Possui_Relacionado === "Sim"}
                    <div class="bg-gray-50 p-4 rounded border">
                        {#each data.casosRelacionados as caso, i}
                            <div class="flex gap-4 mb-2 items-end">
                                <label class="flex-1">
                                    <span class="text-xs text-gray-500"
                                        >ID do Caso Vinculado</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={caso.id}
                                        placeholder="Ex: 1234"
                                    />
                                </label>
                                <label class="flex-1">
                                    <span class="text-xs text-gray-500"
                                        >Motivo do Vínculo</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={caso.motivo}
                                        placeholder="Ex: Mesmo agressor"
                                    />
                                </label>
                                <button
                                    class="text-red-500 hover:text-red-700 mb-2"
                                    on:click={() => removeCasoRelacionado(i)}
                                >
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        {/each}
                        <button
                            class="text-sm text-save-primary hover:underline mt-2"
                            on:click={addCasoRelacionado}
                            >+ Adicionar Caso Relacionado</button
                        >
                    </div>
                {/if}
            </div>

            <!-- Classificação do Crime -->
            <div class="md:col-span-2 border-b pb-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Classificação do Crime / Violência
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each ["Homicídio", "Feminicídio", "Lesão Corporal", "Ameaça", "Estupro", "Assédio Sexual", "Cárcere Privado", "Violência Psicológica", "Violência Patrimonial", "Stalking"] as crime}
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                class="form-checkbox text-save-primary"
                                checked={data.crimes.includes(crime)}
                                on:change={() => toggleCrime(crime)}
                            />
                            <span class="ml-2">{crime}</span>
                        </label>
                    {/each}
                </div>
            </div>

            <!-- Observações -->
            <div class="md:col-span-2">
                <label class="block">
                    <span class="text-gray-700">Observações Gerais</span>
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="4"
                        bind:value={data.Observacao}
                    ></textarea>
                </label>
            </div>
        </div>
    {/if}
</div>
