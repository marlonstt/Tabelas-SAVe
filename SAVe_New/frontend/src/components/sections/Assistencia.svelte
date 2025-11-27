<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        Beneficios: {},
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/assistencia`);
            data = response.data || {};
            if (!data.Beneficios) data.Beneficios = {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Assistencia",
            );
            data = {
                Possui_CadUnico: "Sim",
                NIS: "12345678901",
                Acesso_CRAS: "Sim",
                CRAS_Referencia: "CRAS Centro",
                CRAS_Tecnico: "",
                CRAS_Telefone: "",
                CRAS_Email: "",
                Acesso_CREAS: "Não",
                CREAS_Referencia: "",
                CREAS_Tecnico: "",
                CREAS_Telefone: "",
                CREAS_Email: "",
                Acolhimento: "Não",
                Beneficios: {
                    Bolsa_Familia: true,
                    BPC: false,
                    Auxilio_Gas: false,
                    Outros: false,
                },
                Seguranca_Alimentar: "Regular",
                Demandas_Assistencia: "Cesta Básica",
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
                // await api.put(`/cases/${caseId}/assistencia`, data);
                console.log("Autosaving Assistencia...", data);
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
            <!-- Cadastro Único -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Cadastro Único
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Possui Cadastro Único?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Possui_CadUnico}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                            <option value="Desatualizado">Desatualizado</option>
                        </select>
                    </label>

                    {#if data.Possui_CadUnico === "Sim" || data.Possui_CadUnico === "Desatualizado"}
                        <label class="block">
                            <span class="text-gray-700">NIS</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.NIS}
                            />
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Rede Socioassistencial -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Rede Socioassistencial
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700">Acompanhado pelo CRAS?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Acesso_CRAS}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.Acesso_CRAS === "Sim"}
                        <div
                            class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <label class="block">
                                <span class="text-gray-700"
                                    >CRAS de Referência</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CRAS_Referencia}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Técnico de Referência</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CRAS_Tecnico}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Telefone</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CRAS_Telefone}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Email</span>
                                <input
                                    type="email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CRAS_Email}
                                />
                            </label>
                        </div>
                    {/if}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Acompanhado pelo CREAS?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Acesso_CREAS}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.Acesso_CREAS === "Sim"}
                        <div
                            class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <label class="block">
                                <span class="text-gray-700"
                                    >CREAS de Referência</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CREAS_Referencia}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Técnico de Referência</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CREAS_Tecnico}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Telefone</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CREAS_Telefone}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Email</span>
                                <input
                                    type="email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.CREAS_Email}
                                />
                            </label>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Benefícios -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Benefícios Sociais
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Beneficios.Bolsa_Familia}
                        />
                        <span class="ml-2">Bolsa Família</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Beneficios.BPC}
                        />
                        <span class="ml-2">BPC / LOAS</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Beneficios.Auxilio_Gas}
                        />
                        <span class="ml-2">Auxílio Gás</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            type="checkbox"
                            class="form-checkbox text-save-primary"
                            bind:checked={data.Beneficios.Outros}
                        />
                        <span class="ml-2">Outros</span>
                    </label>
                </div>
            </div>

            <!-- Acolhimento e Segurança Alimentar -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Outras Informações
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Acolhimento Institucional?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Acolhimento}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>

                    <label class="block">
                        <span class="text-gray-700">Segurança Alimentar</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Seguranca_Alimentar}
                        >
                            <option value="">Selecione...</option>
                            <option value="Segura">Segura</option>
                            <option value="Insegurança Leve"
                                >Insegurança Leve</option
                            >
                            <option value="Insegurança Moderada"
                                >Insegurança Moderada</option
                            >
                            <option value="Insegurança Grave"
                                >Insegurança Grave (Fome)</option
                            >
                        </select>
                    </label>
                </div>

                <label class="block">
                    <span class="text-gray-700">Demandas de Assistência</span>
                    <textarea
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        rows="2"
                        bind:value={data.Demandas_Assistencia}
                    ></textarea>
                </label>
            </div>
        </div>
    {/if}
</div>
