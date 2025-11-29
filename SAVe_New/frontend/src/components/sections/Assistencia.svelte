<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    const initialData = {
        Possui_CadUnico: "",
        NIS: "",
        Status_cad_unico: "",
        SPSB_Acesso_cras: "",
        SPSB_Servicos_acessados: "",
        SPSB_Servicos_acessados_esp: "",
        SPSB_Contato_cras_nome: "",
        SPSB_Contato_cras_tel: "",
        SPSB_Contato_cras_email: "",
        SPSB_Nome_servico: "",
        SPSB_Endereco_servico: "",
        SPSEMC_Acesso_creas: "",
        SPSEMC_Servicos_acessados: "",
        SPSEMC_Servicos_acessados_esp: "",
        SPSEMC_Contato_creas_nome: "",
        SPSEMC_Contato_creas_tel: "",
        SPSEMC_Contato_creas_email: "",
        SPSEMC_Nome_servico: "",
        SPSEMC_Endereco_servico: "",
        SPSEAC_Inserido_acolhimentoInst: "",
        SPSEAC_Modalidade_acolhimentoInst: "",
        SPSEAC_Inserido_acolhimentorep: "",
        SPSEAC_acolhimentorep_desc: "",
        SPSEAC_Inserido_familia: "",
        SPSEAC_nome_familia: "",
        SPSEAC_Inserido_calamidade: "",
        SPSEAC_desc_calamidade: "",
        SPSEAC_tec_ref_nome: "",
        SPSEAC_tec_ref_tel: "",
        SPSEAC_tec_ref_email: "",
        SPSEAC_nome_servico: "",
        SPSEAC_endereco_servico: "",
        BSA_recebe_beneficios: "",
        BSA_Tipo_beneficio: "",
        BSA_transf_renda_inf: "",
        BSA_Ben_trab_inf: "",
        BSA_Ben_hab_inf: "",
        BSA_Ben_as_inf: "",
        BSA_Ben_educ_inf: "",
        BSA_Ben_atr_inf: "",
        BSA_Ben_pdi_inf: "",
        BSA_Ben_emer_inf: "",
        BSA_transf_renda_esp: "",
        BSA_Ben_trab_esp: "",
        BSA_Ben_hab_esp: "",
        BSA_Ben_as_esp: "",
        BSA_Ben_educ_esp: "",
        BSA_Ben_atr_esp: "",
        BSA_Ben_pdi_esp: "",
        BSA_Ben_emer_esp: "",
        BSA_outras_formas: "",
        BSA_direito_beneficios: "",
        BSA_direito_beneficios_esp: "",
        BSA_demandas_assist: "",
        BSA_demandas_assist_desc: "",
        BSA_tec_ref_nome: "",
        BSA_tec_ref_tel: "",
        BSA_tec_ref_email: "",
        BSA_seg_alimentar: "",
        Beneficios: {},
    };

    let data: any = { ...initialData };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/assistencia`);
            data = { ...initialData, ...response.data };
            if (!data.Beneficios) data.Beneficios = {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Assistencia",
            );
            data = {
                ...initialData,
                Possui_CadUnico: "Sim",
                NIS: "12345678901",
                Status_cad_unico: "Atualizado",
                SPSB_Acesso_cras: "Sim",
                BSA_recebe_beneficios: "Sim",
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
                await api.put(`/cases/${caseId}/assistencia`, data);
                await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    function toggleBenefit(benefit: string, checked: boolean) {
        let benefits = data.BSA_Tipo_beneficio
            ? data.BSA_Tipo_beneficio.split(";").map((b: string) => b.trim())
            : [];

        if (checked) {
            if (!benefits.includes(benefit)) {
                benefits.push(benefit);
            }
        } else {
            benefits = benefits.filter((b: string) => b !== benefit);
            // Clear related fields when unchecked
            if (benefit === "Renda") {
                data.BSA_transf_renda_inf = "";
                data.BSA_transf_renda_esp = "";
            }
            if (benefit === "Trabalhistas") {
                data.BSA_Ben_trab_inf = "";
                data.BSA_Ben_trab_esp = "";
            }
            if (benefit === "Habitacionais") {
                data.BSA_Ben_hab_inf = "";
                data.BSA_Ben_hab_esp = "";
            }
            if (benefit === "Área de Saúde") {
                data.BSA_Ben_as_inf = "";
                data.BSA_Ben_as_esp = "";
            }
            if (benefit === "Educacionais") {
                data.BSA_Ben_educ_inf = "";
                data.BSA_Ben_educ_esp = "";
            }
            if (benefit === "Trabalhadores Rurais") {
                data.BSA_Ben_atr_inf = "";
                data.BSA_Ben_atr_esp = "";
            }
            if (benefit === "PCD ou Idosos") {
                data.BSA_Ben_pdi_inf = "";
                data.BSA_Ben_pdi_esp = "";
            }
            if (benefit === "Emergenciais") {
                data.BSA_Ben_emer_inf = "";
                data.BSA_Ben_emer_esp = "";
            }
            if (benefit === "Outras Formas") {
                data.BSA_outras_formas = "";
            }
        }

        data.BSA_Tipo_beneficio = benefits.join("; ");
        autosave();
    }

    function toggleSPSBService(service: string, checked: boolean) {
        let services = data.SPSB_Servicos_acessados
            ? data.SPSB_Servicos_acessados.split(";").map((s: string) =>
                  s.trim(),
              )
            : [];

        if (checked) {
            if (!services.includes(service)) {
                services.push(service);
            }
        } else {
            services = services.filter((s: string) => s !== service);
            // Clear related fields when unchecked
            if (service === "Outros") {
                data.SPSB_Servicos_acessados_esp = "";
            }
        }

        data.SPSB_Servicos_acessados = services.join("; ");
        autosave();
    }

    function toggleSPSEMCService(service: string, checked: boolean) {
        let services = data.SPSEMC_Servicos_acessados
            ? data.SPSEMC_Servicos_acessados.split(";").map((s: string) =>
                  s.trim(),
              )
            : [];

        if (checked) {
            if (!services.includes(service)) {
                services.push(service);
            }
        } else {
            services = services.filter((s: string) => s !== service);
            // Clear related fields when unchecked
            if (service === "SPSMCOutros") {
                data.SPSEMC_Servicos_acessados_esp = "";
            }
        }

        data.SPSEMC_Servicos_acessados = services.join("; ");
        autosave();
    }

    function handleSPSEACChange() {
        if (data.SPSEAC_Inserido_acolhimentoInst === "Sim") {
            // Logic adapted from PowerApps: If inserted in Institutional Shelter (Alta Complexidade),
            // we assume Media Complexidade services (like PAEFI) are not applicable or superseded.
            // PowerApps logic was: If(Sim, Focus, Patch(..., {SPSEMC: Blank()})).
            // We interpret this as mutual exclusion for now.
            data.SPSEMC_Servicos_acessados = "";
            data.SPSEMC_Servicos_acessados_esp = "";
        }
        autosave();
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </select>
                    </label>

                    {#if data.Possui_CadUnico === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">NIS</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.NIS}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Status</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Status_cad_unico}
                            >
                                <option value="">Selecione...</option>
                                <option value="Atualizado">Atualizado</option>
                                <option value="Desatualizado"
                                    >Desatualizado</option
                                >
                            </select>
                        </label>
                    {/if}
                </div>
            </div>

            <!-- Serviços de Proteção Social Básica -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Serviços de Proteção Social Básica
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700">Acesso ao CRAS?</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSB_Acesso_cras}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSB_Acesso_cras === "Sim"}
                        <div
                            class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <label class="block">
                                <span class="text-gray-700"
                                    >Quais serviços acessou ou está acessando?</span
                                >
                                <div class="mt-2 space-y-2">
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "PAIF",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "PAIF",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço de Proteção e Atendimento
                                            Integral à Família (PAIF)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "SCFV",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "SCFV",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço de Convivência e
                                            Fortalecimento de Vínculos (SCFV)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "SPSBDomicilio",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "SPSBDomicilio",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço de Proteção Social Básica
                                            no Domicílio</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "BPC",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "BPC",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Benefício de Prestação Continuada
                                            (BPC)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "ACUnicoBFamilia",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "ACUnicoBFamilia",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Atendimento do Cadastro Único/Bolsa
                                            Família</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSB_Servicos_acessados?.includes(
                                                "Outros",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSBService(
                                                    "Outros",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2">Outros</span>
                                    </label>
                                </div>
                            </label>
                            {#if data.SPSB_Servicos_acessados?.includes("Outros")}
                                <label class="block">
                                    <span class="text-gray-700"
                                        >Especifique</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={
                                            data.SPSB_Servicos_acessados_esp
                                        }
                                    />
                                </label>
                            {/if}
                            <label class="block">
                                <span class="text-gray-700"
                                    >Nome do Contato no CRAS</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.SPSB_Contato_cras_nome}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Telefone do CRAS</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.SPSB_Contato_cras_tel}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700">Email do CRAS</span>
                                <input
                                    type="email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.SPSB_Contato_cras_email}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Nome do Serviço</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.SPSB_Nome_servico}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700"
                                    >Endereço do Serviço</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.SPSB_Endereco_servico}
                                />
                            </label>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Serviços de Proteção Social Especial de Média Complexidade -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Serviços de Proteção Social Especial de Média Complexidade
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Tem acesso ao Centro de Referência Especializado de
                            Assistência Social (CREAS)?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSEMC_Acesso_creas}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSEMC_Acesso_creas === "Sim"}
                        <div
                            class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <label class="block">
                                <span class="text-gray-700"
                                    >Quais serviços acessou ou está acessando?</span
                                >
                                <div class="mt-2 space-y-2">
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "PAEFI",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "PAEFI",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço de Proteção e Atendimento
                                            Especializado a Famílias e
                                            Indivíduos (PAEFI)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "SEASocial",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "SEASocial",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço Especializado em Abordagem
                                            Social</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "LA",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "LA",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço para Adolescentes em
                                            Medidas Socioeducativas - Liberdade
                                            assistida (LA)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "PSC",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "PSC",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço para Adolescentes em
                                            Medidas Socioeducativas - Prestação
                                            de Serviço à Comunidade (PSC)</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "SPDISRisco",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "SPDISRisco",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço para Pessoas com
                                            Deficiência e Idosos em Situação de
                                            Risco</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "SMSViolencia",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "SMSViolencia",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço para Mulheres em Situação
                                            de Violência</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "SCAVVESexual",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "SCAVVESexual",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2"
                                            >Serviço para Crianças e
                                            Adolescentes Vítimas de Violência ou
                                            Exploração Sexual</span
                                        >
                                    </label>
                                    <label
                                        class="inline-flex items-center block"
                                    >
                                        <input
                                            type="checkbox"
                                            class="rounded border-gray-300 text-save-primary shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            checked={data.SPSEMC_Servicos_acessados?.includes(
                                                "SPSMCOutros",
                                            )}
                                            on:change={(e) =>
                                                toggleSPSEMCService(
                                                    "SPSMCOutros",
                                                    e.currentTarget.checked,
                                                )}
                                        />
                                        <span class="ml-2">Outros</span>
                                    </label>
                                </div>
                            </label>
                            {#if data.SPSEMC_Servicos_acessados?.includes("SPSMCOutros")}
                                <label class="block">
                                    <span class="text-gray-700"
                                        >Especifique:</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={
                                            data.SPSEMC_Servicos_acessados_esp
                                        }
                                    />
                                </label>
                            {/if}
                            <div class="md:col-span-2 mt-4">
                                <span
                                    class="block text-gray-700 font-semibold mb-2"
                                    >Contato técnico de referência do serviço
                                    referenciado:</span
                                >
                                <div
                                    class="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-gray-700">Nome:</span>
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.SPSEMC_Contato_creas_nome
                                            }
                                        />
                                    </label>
                                    <label class="block">
                                        <span class="text-gray-700"
                                            >Telefone:</span
                                        >
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.SPSEMC_Contato_creas_tel
                                            }
                                        />
                                    </label>
                                    <label class="block">
                                        <span class="text-gray-700">Email:</span
                                        >
                                        <input
                                            type="email"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.SPSEMC_Contato_creas_email
                                            }
                                        />
                                    </label>
                                </div>
                            </div>

                            <div class="md:col-span-2 mt-4">
                                <span
                                    class="block text-gray-700 font-semibold mb-2"
                                    >Nome e endereço do Serviço:</span
                                >
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-gray-700">Nome:</span>
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.SPSEMC_Nome_servico
                                            }
                                        />
                                    </label>
                                    <label class="block">
                                        <span class="text-gray-700"
                                            >Endereço:</span
                                        >
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.SPSEMC_Endereco_servico
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Serviços de Proteção Social Especial de Alta Complexidade -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Serviços de Proteção Social Especial de Alta Complexidade
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Inserido em Serviço de Acolhimento Institucional?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSEAC_Inserido_acolhimentoInst}
                            on:change={handleSPSEACChange}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSEAC_Inserido_acolhimentoInst === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">Modalidade</span>
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={
                                    data.SPSEAC_Modalidade_acolhimentoInst
                                }
                            >
                                <option value="">Selecione...</option>
                                <option value="Abrigo Institucional"
                                    >Abrigo Institucional</option
                                >
                                <option value="Casa-Lar">Casa-Lar</option>
                                <option value="Casa de Passagem"
                                    >Casa de Passagem</option
                                >
                                <option value="Residência Inclusiva"
                                    >Residência Inclusiva</option
                                >
                                <option
                                    value="Instituição de Longa Permanência (ILPI)"
                                    >Instituição de Longa Permanência (ILPI)</option
                                >
                                <option value="Outras">Outras</option>
                            </select>
                        </label>
                    {/if}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Inserido em Serviço de Acolhimento em República?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSEAC_Inserido_acolhimentorep}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSEAC_Inserido_acolhimentorep === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">Qual serviço?</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_acolhimentorep_desc}
                            />
                        </label>
                    {/if}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Inserido em Serviço de Acolhimento em Família
                            Acolhedora?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSEAC_Inserido_familia}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSEAC_Inserido_familia === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">Nome:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_nome_familia}
                            />
                        </label>
                    {/if}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Inserido em Serviço de Proteção em Situações de
                            Calamidades Públicas e de Emergências?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.SPSEAC_Inserido_calamidade}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                    {#if data.SPSEAC_Inserido_calamidade === "Sim"}
                        <label class="block">
                            <span class="text-gray-700">Qual serviço?</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_desc_calamidade}
                            />
                        </label>
                    {/if}
                </div>

                {#if data.SPSEAC_Inserido_acolhimentoInst === "Sim" || data.SPSEAC_Inserido_acolhimentorep === "Sim" || data.SPSEAC_Inserido_familia === "Sim" || data.SPSEAC_Inserido_calamidade === "Sim"}
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t pt-4"
                    >
                        <label class="block">
                            <span class="text-gray-700"
                                >Técnico de Referência</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_tec_ref_nome}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Telefone</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_tec_ref_tel}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Email</span>
                            <input
                                type="email"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_tec_ref_email}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Nome do Serviço</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_nome_servico}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700"
                                >Endereço do Serviço</span
                            >
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.SPSEAC_endereco_servico}
                            />
                        </label>
                    </div>
                {/if}
            </div>

            <!-- Benefícios Socioassistenciais -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Benefícios Socioassistenciais
                </h3>

                <div class="mb-4">
                    <label class="block">
                        <span class="text-gray-700"
                            >Recebe benefícios socioassistenciais?</span
                        >
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.BSA_recebe_beneficios}
                        >
                            <option value="">Selecione...</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </label>
                </div>

                {#if data.BSA_recebe_beneficios === "Sim"}
                    <div class="space-y-4 border p-4 rounded-md bg-gray-50">
                        <h4 class="font-semibold text-gray-700">
                            Tipos de Benefícios
                        </h4>

                        <!-- Transferência de Renda -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Renda")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Renda",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2">Transferencia de renda</span>
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Renda")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={
                                                data.BSA_transf_renda_inf
                                            }
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Bolsa Família"
                                                >Bolsa Família</option
                                            >
                                            <option
                                                value="Benefício de Prestação Continuada (BPC)"
                                                >Benefício de Prestação
                                                Continuada (BPC)</option
                                            >
                                            <option
                                                value="Pensão especial em razão do crime de feminicídio"
                                                >Pensão especial em razão do
                                                crime de feminicídio</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_transf_renda_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_transf_renda_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios Trabalhistas -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Trabalhistas")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Trabalhistas",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2">Benefícios Trabalhistas</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Trabalhistas")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_trab_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Seguro-Desemprego"
                                                >Seguro-Desemprego</option
                                            >
                                            <option
                                                value="Fundo de Garantia do Tempo de Serviço (FGTS)"
                                                >Fundo de Garantia do Tempo de
                                                Serviço (FGTS)</option
                                            >
                                            <option
                                                value="Abono Salarial (PIS/PASEP)"
                                                >Abono Salarial (PIS/PASEP)</option
                                            >
                                            <option value="Salário-Maternidade"
                                                >Salário-Maternidade</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_trab_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_trab_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios Habitacionais -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Habitacionais")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Habitacionais",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2"
                                    >Benefícios Habitacionais</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Habitacionais")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_hab_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option
                                                value="Minha Casa, Minha Vida"
                                                >Minha Casa, Minha Vida</option
                                            >
                                            <option value="Auxílio Moradia"
                                                >Auxílio Moradia</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_hab_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_hab_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios na Área de Saúde -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Área de Saúde")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Área de Saúde",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2"
                                    >Benefícios na Área de Saúde</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Área de Saúde")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_as_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option
                                                value="Medicamentos Gratuitos (Farmácia Popular)"
                                                >Medicamentos Gratuitos
                                                (Farmácia Popular)</option
                                            >
                                            <option
                                                value="Tratamento Fora de Domicílio (TFD)"
                                                >Tratamento Fora de Domicílio
                                                (TFD)</option
                                            >
                                            <option
                                                value="Isenção de Impostos para Medicamentos Específicos"
                                                >Isenção de Impostos para
                                                Medicamentos Específicos</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_as_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={data.BSA_Ben_as_esp}
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios Educacionais -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Educacionais")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Educacionais",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2">Benefícios Educacionais</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Educacionais")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_educ_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option
                                                value="Auxílio-Transporte Escolar"
                                                >Auxílio-Transporte Escolar</option
                                            >
                                            <option value="Bolsa Permanência"
                                                >Bolsa Permanência</option
                                            >
                                            <option
                                                value="FIES (Fundo de Financiamento Estudantil)"
                                                >FIES (Fundo de Financiamento
                                                Estudantil)</option
                                            >
                                            <option value="ProUni"
                                                >ProUni</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_educ_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_educ_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios para Agricultores e Trabalhadores Rurais -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Trabalhadores Rurais")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Trabalhadores Rurais",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2"
                                    >Benefícios para Agricultores e
                                    Trabalhadores Rurais</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Trabalhadores Rurais")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_atr_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Garantia-Safra"
                                                >Garantia-Safra</option
                                            >
                                            <option
                                                value="Programa Nacional de Fortalecimento da Agricultura Familiar (PRONAF)"
                                                >Programa Nacional de
                                                Fortalecimento da Agricultura
                                                Familiar (PRONAF)</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_atr_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_atr_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios para Pessoas com Deficiência ou Idosos -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("PCD ou Idosos")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "PCD ou Idosos",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2"
                                    >Benefícios para Pessoas com Deficiência ou
                                    Idosos</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("PCD ou Idosos")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_pdi_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Passe Livre"
                                                >Passe Livre</option
                                            >
                                            <option value="Isenção de Impostos"
                                                >Isenção de Impostos</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_pdi_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_pdi_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Benefícios Emergenciais -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Emergenciais")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Emergenciais",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2">Benefícios Emergenciais</span
                                >
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Emergenciais")}
                                <div
                                    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Informe:</span
                                        >
                                        <select
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_Ben_emer_inf}
                                        >
                                            <option value=""
                                                >Selecione...</option
                                            >
                                            <option value="Cesta básica"
                                                >Cesta básica</option
                                            >
                                            <option value="Outros"
                                                >Outros</option
                                            >
                                        </select>
                                    </label>
                                    {#if data.BSA_Ben_emer_inf === "Outros"}
                                        <label class="block">
                                            <span class="text-sm text-gray-600"
                                                >Especifique:</span
                                            >
                                            <input
                                                type="text"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                                bind:value={
                                                    data.BSA_Ben_emer_esp
                                                }
                                            />
                                        </label>
                                    {/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Outras Formas -->
                        <div
                            class="flex flex-col md:flex-row md:items-start gap-4"
                        >
                            <label
                                class="inline-flex items-center mt-2 min-w-[250px]"
                            >
                                <input
                                    type="checkbox"
                                    class="form-checkbox text-save-primary"
                                    checked={(
                                        data.BSA_Tipo_beneficio || ""
                                    ).includes("Outras Formas")}
                                    on:change={(e) =>
                                        toggleBenefit(
                                            "Outras Formas",
                                            e.currentTarget.checked,
                                        )}
                                />
                                <span class="ml-2">Outras formas</span>
                            </label>
                            {#if (data.BSA_Tipo_beneficio || "").includes("Outras Formas")}
                                <div class="flex-1">
                                    <label class="block">
                                        <span class="text-sm text-gray-600"
                                            >Especifique:</span
                                        >
                                        <input
                                            type="text"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                            bind:value={data.BSA_outras_formas}
                                        />
                                    </label>
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else if data.BSA_recebe_beneficios === "Não"}
                    <div class="mb-4">
                        <label class="block">
                            <span class="text-gray-700"
                                >Se não, tem direito a receber benefícios?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_direito_beneficios}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>
                        {#if data.BSA_direito_beneficios === "Sim"}
                            <label class="block mt-2">
                                <span class="text-gray-700">Especifique:</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.BSA_direito_beneficios_esp}
                                />
                            </label>
                        {/if}
                    </div>
                {/if}

                <!-- Impactos da vitimização -->
                <div class="mt-6 border-t pt-4">
                    <h4 class="font-semibold text-gray-700 mb-2">
                        Impactos da vitimização
                    </h4>
                    <div class="mb-4">
                        <label class="block">
                            <span class="text-gray-700"
                                >Demandas assistenciais?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_demandas_assist}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>
                        {#if data.BSA_demandas_assist === "Sim"}
                            <label class="block mt-2">
                                <span class="text-gray-700"
                                    >Descreva a demanda de benefícios sociais:</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={data.BSA_demandas_assist_desc}
                                />
                            </label>
                        {/if}
                    </div>
                </div>

                <!-- Contato Técnico -->
                <div class="mt-6 border-t pt-4">
                    <h4 class="font-semibold text-gray-700 mb-2">
                        Contato técnico de referência do serviço referenciado:
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Nome:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_tec_ref_nome}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Telefone:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_tec_ref_tel}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Email:</span>
                            <input
                                type="email"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_tec_ref_email}
                            />
                        </label>
                    </div>
                </div>

                <!-- Segurança Alimentar -->
                <div class="mt-6 border-t pt-4">
                    <h4 class="font-semibold text-gray-700 mb-2">
                        Segurança alimentar e nutricional
                    </h4>
                    <div class="mb-4">
                        <label class="block">
                            <span class="text-gray-700"
                                >Relata dificuldade para ter acesso ou comprar
                                alimentos?</span
                            >
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.BSA_seg_alimentar}
                            >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim</option>
                                <option value="Não">Não</option>
                            </select>
                        </label>
                        <p class="text-xs text-red-600 mt-1 font-semibold">
                            (Verificar se está sem situação de insegurança
                            alimentar e nutricional)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
