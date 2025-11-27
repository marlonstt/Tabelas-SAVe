<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        processos: [],
        demandas: {},
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(
                `/cases/${caseId}/situacao-juridica`,
            );
            data = response.data || { processos: [], demandas: {} };
            if (!data.processos) data.processos = [];
            if (!data.demandas) data.demandas = {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for SituacaoJuridica",
            );
            data = {
                Autor_Maior_18: "Sim",
                Medidas_Protetivas: "Sim",
                Compartilhado_Rede: "Não",
                Relato_Descumprimento: "Não",
                Juiz: "",
                Promotor: "",
                Delegado: "",
                Local_Crime: "",
                Hora_Crime: "",
                Status_Juridico_Autor: "",
                Data_Fato: "",
                Data_Autuacao: "",
                Data_Conclusao_IP: "",
                Data_Denuncia: "",
                Data_Audiencia: "",
                Data_Sentenca: "",
                Data_Transito_Julgado: "",
                Tipos_Penais_Fase_Policial: "",
                Tipos_Penais_Fase_Judicial: "",
                Prisao_Data: "",
                Prisao_Procedimento: "",
                Prisao_Infracao: "",
                processos: [
                    {
                        numero: "1234567-89.2024.8.13.0024",
                        classe: "Medida Protetiva",
                    },
                ],
                demandas: {
                    Divorcio: false,
                    Guarda: true,
                    Pensao: true,
                },
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
                // await api.put(`/cases/${caseId}/situacao-juridica`, data);
                console.log("Autosaving SituacaoJuridica...", data);
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

    function addProcesso() {
        data.processos = [...data.processos, { numero: "", classe: "" }];
        autosave();
    }

    function removeProcesso(index: number) {
        data.processos = data.processos.filter((_, i) => i !== index);
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
            <!-- Informações Gerais -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Informações Gerais
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Autor é maior de 18 anos?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Autor_Maior_18}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Possui Medidas Protetivas?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Medidas_Protetivas}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Caso compartilhado com a rede?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Compartilhado_Rede}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700"
                            >Houve relato de descumprimento?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Relato_Descumprimento}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                </div>
            </div>

            <!-- Detalhes do Crime -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Detalhes do Crime
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Local do Crime</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Local_Crime}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Hora do Crime</span>
                        <input
                            type="time"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Hora_Crime}
                        />
                    </label>
                </div>
            </div>

            <!-- Datas Importantes -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Datas Importantes
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Data do Fato</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Fato}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data da Autuação</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Autuacao}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data Conclusão IP</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Conclusao_IP}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data da Denúncia</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Denuncia}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data da Audiência</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Audiencia}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data da Sentença</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Sentenca}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Trânsito em Julgado</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Transito_Julgado}
                        />
                    </label>
                </div>
            </div>

            <!-- Tipos Penais -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Tipos Penais
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Fase Policial</span>
                        <textarea
                            rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tipos_Penais_Fase_Policial}
                        ></textarea>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Fase Judicial</span>
                        <textarea
                            rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Tipos_Penais_Fase_Judicial}
                        ></textarea>
                    </label>
                </div>
            </div>

            <!-- Autoridades -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Autoridades Envolvidas
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Juiz(a)</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Juiz}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Promotor(a)</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Promotor}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Delegado(a)</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Delegado}
                        />
                    </label>
                </div>
            </div>

            <!-- Status e Prisão -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Status do Autor e Prisão
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Status Jurídico do Autor</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Status_Juridico_Autor}
                        >
                            <option value="">Selecione...</option>
                            <option value="Investigado">Investigado</option>
                            <option value="Indiciado">Indiciado</option>
                            <option value="Denunciado">Denunciado</option>
                            <option value="Réu">Réu</option>
                            <option value="Condenado">Condenado</option>
                            <option value="Absolvido">Absolvido</option>
                        </select>
                    </label>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <label class="block">
                        <span class="text-gray-700">Data da Prisão</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Prisao_Data}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Procedimento</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Prisao_Procedimento}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Infração</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Prisao_Infracao}
                        />
                    </label>
                </div>
            </div>

            <!-- Processos -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Processos / Procedimentos
                </h3>
                {#each data.processos as proc, i}
                    <div class="flex gap-4 mb-2 items-end">
                        <label class="flex-1">
                            <span class="text-xs text-gray-500">Número</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={proc.numero}
                            />
                        </label>
                        <label class="flex-1">
                            <span class="text-xs text-gray-500"
                                >Classe / Tipo</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={proc.classe}
                            />
                        </label>
                        <button
                            class="text-red-500 hover:text-red-700 mb-2"
                            on:click={() => removeProcesso(i)}
                        >
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                {/each}
                <button
                    class="text-sm text-save-primary hover:underline mt-2"
                    on:click={addProcesso}>+ Adicionar Processo</button
                >
            </div>

            <!-- Demandas da Vítima -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Demandas da Vítima
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.demandas.Divorcio}
                        />
                        <span class="ml-2">Divórcio</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.demandas.Guarda}
                        />
                        <span class="ml-2">Guarda</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.demandas.Pensao}
                        />
                        <span class="ml-2">Pensão Alimentícia</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.demandas.Partilha}
                        />
                        <span class="ml-2">Partilha de Bens</span>
                    </label>
                    <!-- Adicionar mais demandas conforme necessário -->
                </div>
            </div>
        </div>
    {/if}
</div>
