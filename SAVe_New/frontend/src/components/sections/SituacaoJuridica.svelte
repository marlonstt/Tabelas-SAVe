<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data = {
        SJ_IP_PCNet: "",
        SJ_Auto_Judicial: "",
        SJ_Num_MPMG: "",
        SJ_IP_PCNet_Classe_Tipo: "",
        SJ_Auto_Judicial_Classe_Tipo: "",
        SJ_Num_MPMG_Tipo: "",
        SJ_REDS_Classe_Tipo: "",
        SJ_Obs_Documentacao: "",
        SJ_Medidas_Prot_Cautelar: "Não",
        SJ_REDS: "",
        SJ_Num_Processo: "",
        SJ_Vitima_Intimada: "Não",
        SJ_Agressor_Intimado: "Não",
        SJ_Compartilhado_Rede: "Não",
        SJ_Relato_Descumprimento: "Não",
        SJ_Descumprimento_Especif: "",
        SJ_Autor_Maior_18: "Sim",
        SJ_Promotoria: "",
        SJ_Delegacia: "",
        SJ_Servidor_Referencia: "",
        SJ_Promotor: "",
        SJ_Delegado: "",
        SJ_Juiz: "",
        SJ_Orgao_Julgador: "",
        SJ_Contato_Promotor: "",
        SJ_Contato_Delegado: "",
        SJ_Contato_Juiz: "",
        SJ_Tipo_Penal_Fatos: "",
        SJ_Tipo_Penal_Autuacao_IP: "",
        SJ_Tipo_Penal_Conclusao_IP: "",
        SJ_Tipo_Penal_Denuncia_Repres: "",
        SJ_Tipo_Penal_Audiencia: "",
        SJ_Tipo_Penal_Sentenca: "",
        SJ_Tipo_Penal_Transito_Julgado: "",
        SJ_Data_Fatos: "",
        SJ_Data_Autuacao_IP: "",
        SJ_Data_Conclusao_IP: "",
        SJ_Data_Denuncia_Repres: "",
        SJ_Data_Audiencia: "",
        SJ_Data_Sentenca: "",
        SJ_Data_Transito_Julgado: "",
    };

    let situacaoJuridica2: any = { ID_Caso: 0 };

    let processos: any[] = [];

    let loading = true;
    let saving = false;
    let saveTimeout: any;

    onMount(async () => {
        await loadData();
    });

    async function manualSave() {
        if (saving) return;
        saving = true;

        try {
            const payload = {
                ...data,
                situacaoJuridica2: situacaoJuridica2,
                processos: processos,
            };
            await api.put(`/cases/${caseId}/situacao-juridica`, payload);
            alert("Dados salvos com sucesso!");
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Erro ao salvar dados.");
        } finally {
            saving = false;
        }
    }

    async function loadData() {
        try {
            loading = true;
            const response = await api.get(`/cases/${caseId}`);
            const apiData = response.data;

            if (apiData.situacaoJuridica && apiData.situacaoJuridica.ID_Caso) {
                data = { ...data, ...apiData.situacaoJuridica };
            }
            if (
                apiData.situacaoJuridica2 &&
                apiData.situacaoJuridica2.ID_Caso
            ) {
                situacaoJuridica2 = {
                    ...situacaoJuridica2,
                    ...apiData.situacaoJuridica2,
                };
            }
            if (apiData.processos) {
                processos = apiData.processos;
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            loading = false;
        }
    }

    function autosave() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saving = true;
        saveTimeout = setTimeout(async () => {
            try {
                const payload = {
                    ...data,
                    situacaoJuridica2: situacaoJuridica2,
                    processos: processos,
                };
                await api.put(`/cases/${caseId}/situacao-juridica`, payload);
                saving = false;
            } catch (error) {
                console.error("Error saving data:", error);
                saving = false;
            }
        }, 1000);
    }

    function addProcesso() {
        processos = [...processos, { SJIP_Numero: "", SJIP_Classe_Tipo: "" }];
        autosave();
    }

    function removeProcesso(index: number) {
        processos = processos.filter((_, i) => i !== index);
        autosave();
    }
</script>

<div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Situação Jurídica</h2>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Identificação dos Procedimentos -->
            <div class="col-span-2">
                <h3
                    class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2"
                >
                    Identificação dos Procedimentos
                </h3>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Nº IP / PCNet
                    <input
                        type="text"
                        bind:value={data.SJ_IP_PCNet}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Classe / Tipo (IP)
                    <input
                        type="text"
                        bind:value={data.SJ_IP_PCNet_Classe_Tipo}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Nº Autos Judiciais
                    <input
                        type="text"
                        bind:value={data.SJ_Auto_Judicial}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Classe / Tipo (Judicial)
                    <input
                        type="text"
                        bind:value={data.SJ_Auto_Judicial_Classe_Tipo}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Nº MPMG
                    <input
                        type="text"
                        bind:value={data.SJ_Num_MPMG}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo (MPMG)
                    <input
                        type="text"
                        bind:value={data.SJ_Num_MPMG_Tipo}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Nº REDS
                    <input
                        type="text"
                        bind:value={data.SJ_REDS}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Classe / Tipo (REDS)
                    <input
                        type="text"
                        bind:value={data.SJ_REDS_Classe_Tipo}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                    >Observações sobre Documentação</label
                >
                <textarea
                    bind:value={data.SJ_Obs_Documentacao}
                    on:input={autosave}
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <!-- Medidas Protetivas -->
            <div class="col-span-2 mt-6">
                <h3
                    class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2"
                >
                    Medidas Protetivas
                </h3>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Medidas Protetivas / Cautelar?</label
                >
                <div class="mt-2 space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Medidas_Prot_Cautelar}
                            value="Sim"
                            on:change={autosave}
                            class="form-radio text-indigo-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Medidas_Prot_Cautelar}
                            value="Não"
                            on:change={autosave}
                            class="form-radio text-indigo-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>

            {#if data.SJ_Medidas_Prot_Cautelar === "Sim"}
                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700">
                        Nº Processo
                        <input
                            type="text"
                            bind:value={data.SJ_Num_Processo}
                            on:input={autosave}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </label>
                </div>

                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700"
                        >Vítima Intimada?</label
                    >
                    <div class="mt-2 space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Vitima_Intimada}
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Vitima_Intimada}
                                value="Não"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700"
                        >Agressor Intimado?</label
                    >
                    <div class="mt-2 space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Agressor_Intimado}
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Agressor_Intimado}
                                value="Não"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700"
                        >Compartilhado com a Rede?</label
                    >
                    <div class="mt-2 space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Compartilhado_Rede}
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Compartilhado_Rede}
                                value="Não"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700"
                        >Relato de Descumprimento?</label
                    >
                    <div class="mt-2 space-x-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Relato_Descumprimento}
                                value="Sim"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Sim</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                bind:group={data.SJ_Relato_Descumprimento}
                                value="Não"
                                on:change={autosave}
                                class="form-radio text-indigo-600"
                            />
                            <span class="ml-2">Não</span>
                        </label>
                    </div>
                </div>

                {#if data.SJ_Relato_Descumprimento === "Sim"}
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700"
                            >Especifique o Descumprimento</label
                        >
                        <textarea
                            bind:value={data.SJ_Descumprimento_Especif}
                            on:input={autosave}
                            rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                {/if}
            {/if}

            <!-- Outros Processos -->
            <div class="col-span-2 mt-6">
                <h3
                    class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2"
                >
                    Outros Processos
                </h3>

                {#each processos as processo, index}
                    <div
                        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded bg-gray-50"
                    >
                        <div class="form-group">
                            <label
                                class="block text-sm font-medium text-gray-700"
                            >
                                Número
                                <input
                                    type="text"
                                    bind:value={processo.SJIP_Numero}
                                    on:input={autosave}
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </label>
                        </div>
                        <div class="form-group">
                            <label
                                class="block text-sm font-medium text-gray-700"
                            >
                                Classe / Tipo
                                <input
                                    type="text"
                                    bind:value={processo.SJIP_Classe_Tipo}
                                    on:input={autosave}
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </label>
                        </div>
                        <div class="flex items-end">
                            <button
                                on:click={() => removeProcesso(index)}
                                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >Remover</button
                            >
                        </div>
                    </div>
                {/each}

                <button
                    on:click={addProcesso}
                    class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >Incluir Processo</button
                >
            </div>

            <!-- Datas e Tipos Penais -->
            <div class="col-span-2 mt-6">
                <h3
                    class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2"
                >
                    Datas e Tipos Penais
                </h3>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Data dos Fatos
                    <input
                        type="date"
                        bind:value={data.SJ_Data_Fatos}
                        on:change={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo Penal (Fatos)
                    <input
                        type="text"
                        bind:value={data.SJ_Tipo_Penal_Fatos}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Data Autuação IP
                    <input
                        type="date"
                        bind:value={data.SJ_Data_Autuacao_IP}
                        on:change={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo Penal (Autuação IP)
                    <input
                        type="text"
                        bind:value={data.SJ_Tipo_Penal_Autuacao_IP}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Data Conclusão IP
                    <input
                        type="date"
                        bind:value={data.SJ_Data_Conclusao_IP}
                        on:change={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo Penal (Conclusão IP)
                    <input
                        type="text"
                        bind:value={data.SJ_Tipo_Penal_Conclusao_IP}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Data Denúncia/Repres.
                    <input
                        type="date"
                        bind:value={data.SJ_Data_Denuncia_Repres}
                        on:change={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo Penal (Denúncia)
                    <input
                        type="text"
                        bind:value={data.SJ_Tipo_Penal_Denuncia_Repres}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Data Audiência
                    <input
                        type="date"
                        bind:value={data.SJ_Data_Audiencia}
                        on:change={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700">
                    Tipo Penal (Audiência)
                    <input
                        type="text"
                        bind:value={data.SJ_Tipo_Penal_Audiencia}
                        on:input={autosave}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </label>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Data Sentença</label
                >
                <input
                    type="date"
                    bind:value={data.SJ_Data_Sentenca}
                    on:change={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Tipo Penal (Sentença)</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Tipo_Penal_Sentenca}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Data Trânsito Julgado</label
                >
                <input
                    type="date"
                    bind:value={data.SJ_Data_Transito_Julgado}
                    on:change={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Tipo Penal (Trânsito)</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Tipo_Penal_Transito_Julgado}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <!-- Outras Informações -->
            <div class="col-span-2 mt-6">
                <h3
                    class="text-lg font-semibold mb-4 text-gray-700 border-b pb-2"
                >
                    Outras Informações
                </h3>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Autor Maior de 18?</label
                >
                <div class="mt-2 space-x-4">
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Autor_Maior_18}
                            value="Sim"
                            on:change={autosave}
                            class="form-radio text-indigo-600"
                        />
                        <span class="ml-2">Sim</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="radio"
                            bind:group={data.SJ_Autor_Maior_18}
                            value="Não"
                            on:change={autosave}
                            class="form-radio text-indigo-600"
                        />
                        <span class="ml-2">Não</span>
                    </label>
                </div>
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Promotoria</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Promotoria}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Delegacia</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Delegacia}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Servidor Referência</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Servidor_Referencia}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div class="form-group">
                <label class="block text-sm font-medium text-gray-700"
                    >Órgão Julgador</label
                >
                <input
                    type="text"
                    bind:value={data.SJ_Orgao_Julgador}
                    on:input={autosave}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
        </div>
        <!-- Manual Save Button -->
        <div class="md:col-span-2 flex justify-end mt-4">
            <button
                class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                on:click={manualSave}
                disabled={saving || loading}
            >
                {saving ? "Salvando..." : "Salvar Dados"}
            </button>
        </div>
    {/if}
</div>
