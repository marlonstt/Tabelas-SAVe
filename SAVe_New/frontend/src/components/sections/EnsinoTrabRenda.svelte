<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {};
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(
                `/cases/${caseId}/ensino-trab-renda`,
            );
            data = response.data || {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for EnsinoTrabRenda",
            );
            data = {
                Grau_escolaridade: "",
                Estuda_atualmente: "",
                Nome_instituicao: "",
                Tipo_instituicao: "",
                Retorno_estudos: "",
                Situacao_trabalho: "",
                Esta_Afastado: "",
                Motivo_afastamento: "",
                Motivo_Afastamento_Detalhado: "",
                Valor_renda: "",
                Valor_renda_esp: "",
                TR_Prejuizo_trabalho: "",
                TR_tipo_prejuizo: "",
                TR_descricao_prejuizo: "",
                PT_prejuizo_patrimonio: "",
                PT_Descricao_pp: "",
                VE_prejuizo_escolar: "",
                VE_tipo_PE: "",
                VE_descricao_pe: "",
                Demanda_educacional: false,
                Desc_demanda_educacional: "",
                Demanda_trabalhista: false,
                Desc_demanda_trabalhista: "",
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
                await api.put(`/cases/${caseId}/ensino-trab-renda`, data);
                console.log("Autosaving EnsinoTrabRenda...", data);
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
            <!-- Educação (Container2_7) -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Educação
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Grau de Escolaridade -->
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Grau de escolaridade:</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Grau_escolaridade}
                        >
                            <option value="">Selecione...</option>
                            <option value="Analfabeto">Analfabeto</option>
                            <option value="Analfabeto Funcional"
                                >Analfabeto Funcional</option
                            >
                            <option value="E. Fund. Incompleto"
                                >E. Fund. Incompleto</option
                            >
                            <option value="E. Fund. Completo"
                                >E. Fund. Completo</option
                            >
                            <option value="E. Médio Incompleto"
                                >E. Médio Incompleto</option
                            >
                            <option value="E. Médio Completo"
                                >E. Médio Completo</option
                            >
                            <option value="Superior Incompleto"
                                >Superior Incompleto</option
                            >
                            <option value="Superior Completo"
                                >Superior Completo</option
                            >
                            <option value="Pós graduação">Pós graduação</option>
                            <option
                                value="Curso profissionalizante ou treinamento"
                                >Curso profissionalizante ou treinamento</option
                            >
                        </select>
                    </label>

                    <!-- Estuda Atualmente? -->
                    <div class="block">
                        <span class="text-gray-700 font-semibold block mb-1"
                            >Estuda atualmente?</span
                        >
                        <div class="flex space-x-4">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    class="form-radio text-save-primary"
                                    bind:group={data.Estuda_atualmente}
                                    value="Sim"
                                />
                                <span class="ml-2">Sim</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    class="form-radio text-save-primary"
                                    bind:group={data.Estuda_atualmente}
                                    value="Não"
                                />
                                <span class="ml-2">Não</span>
                            </label>
                        </div>
                    </div>

                    <!-- Deseja retornar aos estudos? (Se Estuda_atualmente == "Não") -->
                    {#if data.Estuda_atualmente === "Não"}
                        <div class="block">
                            <span class="text-gray-700 font-semibold block mb-1"
                                >Deseja retornar aos estudos?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={data.Retorno_estudos}
                                        value="Sim"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={data.Retorno_estudos}
                                        value="Não"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>
                    {/if}

                    <!-- Tipo de Instituição (Se Estuda_atualmente == "Sim") -->
                    {#if data.Estuda_atualmente === "Sim"}
                        <label class="block">
                            <span class="text-gray-700 font-semibold"
                                >Tipo de instituição:</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Tipo_instituicao}
                            >
                                <option value="">Selecione...</option>
                                <option value="Privada">Privada</option>
                                <option value="Pública">Pública</option>
                            </select>
                        </label>

                        <label class="block">
                            <span class="text-gray-700 font-semibold"
                                >Nome da instituição:</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Nome_instituicao}
                            />
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Trabalho e Renda (Container2_8) -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Trabalho e Renda
                </h3>
                <div class="space-y-4">
                    <!-- Situação ocupacional de trabalho -->
                    <label class="block">
                        <span class="text-gray-700 font-semibold"
                            >Situação ocupacional de trabalho:</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Situacao_trabalho}
                        >
                            <option value="">Selecione...</option>
                            <option value="Trabalhador/a formal"
                                >Trabalhador/a formal</option
                            >
                            <option value="Desempregado/a"
                                >Desempregado/a</option
                            >
                            <option value="Trabalhador/a informal"
                                >Trabalhador/a informal</option
                            >
                            <option value="Inativo/a">Inativo/a</option>
                            <option value="Trabalhador/a doméstico/a"
                                >Trabalhador/a doméstico/a</option
                            >
                            <option value="Aposentado/a">Aposentado/a</option>
                            <option value="Servidor/a público/a"
                                >Servidor/a público/a</option
                            >
                            <option
                                value="Estudante/Mestrando/Doutorando/Bolsista"
                                >Estudante/Mestrando/Doutorando/Bolsista</option
                            >
                        </select>
                    </label>

                    <!-- Está afastado do trabalho? -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="block">
                            <span class="text-gray-700 font-semibold block mb-1"
                                >Está afastado do trabalho?</span
                            >
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={data.Esta_Afastado}
                                        value="Sim"
                                    />
                                    <span class="ml-2">Sim</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary"
                                        bind:group={data.Esta_Afastado}
                                        value="Não"
                                    />
                                    <span class="ml-2">Não</span>
                                </label>
                            </div>
                        </div>

                        {#if data.Esta_Afastado === "Sim"}
                            <label class="block">
                                <span class="text-gray-700 font-semibold"
                                    >Motivo do afastamento:</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.Motivo_afastamento}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Afastamento Médico"
                                        >Afastamento Médico</option
                                    >
                                    <option
                                        value="Afastamento por Motivo Pessoal ou Profissional"
                                        >Afastamento por Motivo Pessoal ou
                                        Profissional</option
                                    >
                                    <option value="Outro">Outro</option>
                                </select>
                            </label>
                        {/if}
                    </div>

                    {#if data.Esta_Afastado === "Sim" && data.Motivo_afastamento}
                        {#if data.Motivo_afastamento === "Outro"}
                            <label class="block">
                                <span class="text-gray-700 font-semibold"
                                    >Especificar motivo do afastamento:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.Motivo_Afastamento_Detalhado
                                    }
                                />
                            </label>
                        {:else}
                            <label class="block">
                                <span class="text-gray-700 font-semibold"
                                    >Motivo detalhado do afastamento:</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        data.Motivo_Afastamento_Detalhado
                                    }
                                >
                                    <option value="">Selecione...</option>
                                    {#if data.Motivo_afastamento === "Afastamento Médico"}
                                        <option
                                            value="Afastamento por Incapacidade Temporária"
                                            >Afastamento por Incapacidade
                                            Temporária</option
                                        >
                                        <option value="Licença Médica"
                                            >Licença Médica</option
                                        >
                                        <option
                                            value="Afastamento por Acidente de Trabalho"
                                            >Afastamento por Acidente de
                                            Trabalho</option
                                        >
                                    {:else if data.Motivo_afastamento === "Afastamento por Motivo Pessoal ou Profissional"}
                                        <option
                                            value="Licença por Motivo de Interesse Particular (LIP) Servidor/a"
                                            >Licença por Motivo de Interesse
                                            Particular (LIP) Servidor/a</option
                                        >
                                        <option
                                            value="Licença-Maternidade/Paternidade"
                                            >Licença-Maternidade/Paternidade</option
                                        >
                                        <option
                                            value="Licença por Motivo de Saúde Familiar"
                                            >Licença por Motivo de Saúde
                                            Familiar</option
                                        >
                                        <option
                                            value="Afastamento para Capacitação ou Estudos"
                                            >Afastamento para Capacitação ou
                                            Estudos</option
                                        >
                                    {/if}
                                </select>
                            </label>
                        {/if}
                    {/if}
                </div>
            </div>

            <!-- Renda, Prejuízos, Patrimônio, Vida Escolar, Demandas (Container2_10) -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Renda e Prejuízos
                </h3>
                <div class="space-y-6">
                    <!-- Renda -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700 font-semibold"
                                >Valor da Renda:</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Valor_renda}
                            >
                                <option value="">Selecione...</option>
                                <option value="Menos de um salário mínimo"
                                    >Menos de um salário mínimo</option
                                >
                                <option value="de 1 a 2 salários mínimos"
                                    >de 1 a 2 salários mínimos</option
                                >
                                <option value="de 2 a 5 salários mínimos"
                                    >de 2 a 5 salários mínimos</option
                                >
                                <option value="de 5 a 10 salários mínimos"
                                    >de 5 a 10 salários mínimos</option
                                >
                                <option value="Acima de 10 salaríos mínimos"
                                    >Acima de 10 salaríos mínimos</option
                                >
                                <option value="Outro valor">Outro valor</option>
                            </select>
                        </label>

                        {#if data.Valor_renda === "Outro valor"}
                            <label class="block">
                                <span class="text-gray-700 font-semibold"
                                    >Especifique o valor:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.Valor_renda_esp}
                                />
                            </label>
                        {/if}
                    </div>

                    <!-- Prejuízo ao Trabalho -->
                    <div class="border-t pt-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="block">
                                <span
                                    class="text-gray-700 font-semibold block mb-1"
                                    >Houve prejuízo ao trabalho e/ou renda em
                                    razão da vitimização?</span
                                >
                                <div class="flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.TR_Prejuizo_trabalho
                                            }
                                            value="Sim"
                                        />
                                        <span class="ml-2">Sim</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.TR_Prejuizo_trabalho
                                            }
                                            value="Não"
                                        />
                                        <span class="ml-2">Não</span>
                                    </label>
                                </div>
                            </div>

                            {#if data.TR_Prejuizo_trabalho === "Sim"}
                                <label class="block">
                                    <span class="text-gray-700 font-semibold"
                                        >Prejuízo:</span
                                    >
                                    <select
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={data.TR_tipo_prejuizo}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Afastamento do trabalho"
                                            >Afastamento do trabalho</option
                                        >
                                        <option value="Desemprego"
                                            >Desemprego</option
                                        >
                                        <option
                                            value="Redução ou perda salarial/renda"
                                            >Redução ou perda salarial/renda</option
                                        >
                                        <option value="Discriminação ou bullyng"
                                            >Discriminação ou bullyng</option
                                        >
                                        <option
                                            value="Outras formas de violência"
                                            >Outras formas de violência</option
                                        >
                                    </select>
                                </label>

                                <label class="block md:col-span-2">
                                    <span class="text-gray-700 font-semibold"
                                        >Descrição do prejuízo no trabalho e
                                        renda:</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={data.TR_descricao_prejuizo}
                                    />
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Patrimônio -->
                    <div class="border-t pt-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="block">
                                <span
                                    class="text-gray-700 font-semibold block mb-1"
                                    >Houve perda de ordem patrimonial ou
                                    material decorrente do fato vitimizante?</span
                                >
                                <div class="flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.PT_prejuizo_patrimonio
                                            }
                                            value="Sim"
                                        />
                                        <span class="ml-2">Sim</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.PT_prejuizo_patrimonio
                                            }
                                            value="Não"
                                        />
                                        <span class="ml-2">Não</span>
                                    </label>
                                </div>
                            </div>

                            {#if data.PT_prejuizo_patrimonio === "Sim"}
                                <label class="block md:col-span-2">
                                    <span class="text-gray-700 font-semibold"
                                        >Descrição do prejuízo no patrimônio:</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={data.PT_Descricao_pp}
                                    />
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Vida Escolar -->
                    <div class="border-t pt-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="block">
                                <span
                                    class="text-gray-700 font-semibold block mb-1"
                                    >O fato vitimizante gerou prejuízo na vida
                                    escolar ou acadêmica da vítima?</span
                                >
                                <div class="flex space-x-4">
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.VE_prejuizo_escolar
                                            }
                                            value="Sim"
                                        />
                                        <span class="ml-2">Sim</span>
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input
                                            type="radio"
                                            class="form-radio text-save-primary"
                                            bind:group={
                                                data.VE_prejuizo_escolar
                                            }
                                            value="Não"
                                        />
                                        <span class="ml-2">Não</span>
                                    </label>
                                </div>
                            </div>

                            {#if data.VE_prejuizo_escolar === "Sim"}
                                <label class="block">
                                    <span class="text-gray-700 font-semibold"
                                        >Prejuízo:</span
                                    >
                                    <select
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={data.VE_tipo_PE}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Afastamento escolar"
                                            >Afastamento escolar</option
                                        >
                                        <option value="Evasão escolar"
                                            >Evasão escolar</option
                                        >
                                        <option
                                            value="Discriminação ou bullying"
                                            >Discriminação ou bullying</option
                                        >
                                        <option
                                            value="Outras formas de violência"
                                            >Outras formas de violência</option
                                        >
                                    </select>
                                </label>

                                <label class="block md:col-span-2">
                                    <span class="text-gray-700 font-semibold"
                                        >Descrição do prejuízo na vida escolar
                                        ou acadêmica:</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={data.VE_descricao_pe}
                                    />
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Demandas -->
                    <div class="border-t pt-4">
                        <h4 class="text-md font-semibold text-gray-700 mb-2">
                            Demandas
                        </h4>
                        <div class="space-y-4">
                            <!-- Demanda Educacional -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        bind:checked={data.Demanda_educacional}
                                    />
                                    <span
                                        class="ml-2 font-semibold text-gray-700"
                                        >Demandas educacionais</span
                                    >
                                </label>
                                {#if data.Demanda_educacional}
                                    <label class="block mt-2">
                                        <span class="text-gray-700"
                                            >Descreva a demanda educacional:</span
                                        >
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.Desc_demanda_educacional
                                            }
                                        />
                                    </label>
                                {/if}
                            </div>

                            <!-- Demanda Trabalhista -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        bind:checked={data.Demanda_trabalhista}
                                    />
                                    <span
                                        class="ml-2 font-semibold text-gray-700"
                                        >Demandas trabalhistas</span
                                    >
                                </label>
                                {#if data.Demanda_trabalhista}
                                    <label class="block mt-2">
                                        <span class="text-gray-700"
                                            >Descreva a demanda trabalhista:</span
                                        >
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.Desc_demanda_trabalhista
                                            }
                                        />
                                    </label>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
