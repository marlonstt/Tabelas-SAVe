<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        casosRelacionados: [],
        crimes: [],
        specificCrimes: [],
    };
    let loading = true;
    let saving = false;
    let saveStatus = "";
    let saveTimeout: any;
    let lastSavedData: string = "";

    // Reset data when caseId changes
    $: if (caseId) {
        // Reset to empty state immediately to prevent showing old data
        data = {
            casosRelacionados: [],
            crimes: [],
            specificCrimes: [],
            Data: new Date().toISOString().split("T")[0],
            Comarca_origem: "",
            N_procedimento_MPE: "",
            Precisa_Atendimento_Esp: "Não",
            Atendimento_Especial: "",
            Quem_encaminha: "",
            PE_nome: "",
            PE_telefone: "",
            PE_email: "",
            PE_cargo: "",
            Possui_Relacionado: "Não",
            Tipo_Vitima: "",
            Classificacao_vitima: "",
            Vitimizacao: "",
            Vit_Terciaria_Origem: "",
            Classificacao_crime: "",
            Observacao: "",
        };
        loading = true;
        loadData();
    }

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            // Merge response data
            const backendData = response.data.dadosEntrada || {};
            console.log("Backend Data Loaded:", backendData);
            const casosVinculadosData = response.data.casosVinculados || {};

            data = { ...data, ...backendData };

            // Parse Casos Relacionados
            if (casosVinculadosData.Casos_Relacionados) {
                try {
                    data.casosRelacionados = JSON.parse(
                        casosVinculadosData.Casos_Relacionados,
                    );
                } catch (e) {
                    console.error("Error parsing Casos_Relacionados", e);
                    data.casosRelacionados = [];
                }
            } else {
                data.casosRelacionados = [];
            }

            // Parse Crimes Categories (Crime_relacionado)
            if (data.Crime_relacionado) {
                data.crimes = data.Crime_relacionado.split(";")
                    .map((c: string) => c.trim())
                    .filter((c: string) => c !== "");
            } else {
                data.crimes = [];
            }
            // Parse Specific Crimes (Crime_relacionado_especifico)
            if (data.Crime_relacionado_especifico) {
                data.specificCrimes = data.Crime_relacionado_especifico.split(
                    "; ",
                ).filter((c: string) => c.trim() !== "");
            } else {
                data.specificCrimes = [];
            }
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                console.log(
                    "No data found for this section, initializing empty.",
                );
            } else {
                console.warn(
                    "Backend unavailable or error, using Mock Data for DadosEntrada",
                );
            }
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    onMount(() => {
        if (caseId) {
            loadData();
        }
    });

    function autosave() {
        if (loading || saving) return;

        // Update Crime_relacionado_especifico before saving
        data.Crime_relacionado_especifico = data.specificCrimes.join("; ");

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(async () => {
            if (saving) return;
            saving = true;
            try {
                const payload = { ...data };
                await api.put(`/cases/${caseId}/dados-entrada`, payload);
                console.log("Autosaving...", payload);
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    $: if (data) autosave();

    function addCasoRelacionado() {
        data.casosRelacionados = [...data.casosRelacionados, { id_vitima: "" }];
        autosave();
    }

    function removeCasoRelacionado(index: number) {
        data.casosRelacionados = data.casosRelacionados.filter(
            (_, i) => i !== index,
        );
        autosave();
    }

    function toggleCrimeCategory(category: string) {
        if (data.crimes.includes(category)) {
            data.crimes = data.crimes.filter((c: string) => c !== category);
            // Also remove specific crimes belonging to this category?
            // For simplicity, we keep them or we could define a map of category -> specific crimes to clear them.
            // Given the PowerApps logic, unchecking a category might imply clearing its specific crimes.
            // But let's stick to simple toggle for now unless specified.
            // Actually, looking at PowerApps snippet:
            // OnUncheck of category: it removes the category from varCrimesTotais.
            // It doesn't seem to explicitly clear specific crimes in the snippet provided for OnUncheck,
            // but the UI would hide them.
        } else {
            data.crimes = [...data.crimes, category];
        }
        autosave();
    }

    function toggleSpecificCrime(crime: string) {
        if (data.specificCrimes.includes(crime)) {
            data.specificCrimes = data.specificCrimes.filter(
                (c: string) => c !== crime,
            );
        } else {
            data.specificCrimes = [...data.specificCrimes, crime];
        }
        autosave();
    }

    async function manualSave() {
        if (loading || saving) return;

        clearTimeout(saveTimeout);
        saving = true;
        saveStatus = "Salvando...";

        // Update Crime_relacionado_especifico before saving
        data.Crime_relacionado_especifico = data.specificCrimes.join("; ");

        try {
            await api.put(`/cases/${caseId}/dados-entrada`, data);
            lastSavedData = JSON.stringify(data);
            saveStatus = "Salvo com sucesso! ✅";
            setTimeout(() => (saveStatus = ""), 3000);
        } catch (err) {
            console.error("Error saving", err);
            saveStatus = "Erro ao salvar ❌";
        } finally {
            saving = false;
        }
    }
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
            class="flex items-center {lastSavedData &&
            JSON.parse(lastSavedData).error
                ? 'text-red-600'
                : 'text-green-600'}"
        >
            <span class="material-icons text-sm mr-1">check</span>
            Salvo
        </span>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Container1_7: Related Cases (Bottom) -->
            <div class="border border-gray-300 rounded-lg p-4 shadow-sm">
                <div class="flex items-center gap-4 mb-4">
                    <label class="text-sm font-semibold text-gray-700"
                        >Possui caso(s) relacionado?</label
                    >
                    <div class="flex gap-4">
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary h-5 w-5"
                                name="relacionado"
                                value="Não"
                                bind:group={data.Possui_Relacionado}
                            />
                            <span class="ml-2 text-sm">Não</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input
                                type="radio"
                                class="form-radio text-save-primary h-5 w-5"
                                name="relacionado"
                                value="Sim"
                                bind:group={data.Possui_Relacionado}
                            />
                            <span class="ml-2 text-sm">Sim</span>
                        </label>
                    </div>
                    <button
                        type="button"
                        class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        on:click={() => (data.Possui_Relacionado = "")}
                        title="Limpar seleção"
                    >
                        <span class="material-icons text-sm">close</span>
                    </button>
                </div>

                {#if data.Possui_Relacionado === "Sim"}
                    <div class="flex gap-8 items-start">
                        <button
                            class="bg-green-600 text-white px-4 py-1 rounded shadow hover:bg-green-700 transition-colors text-xs font-semibold h-8"
                            on:click={addCasoRelacionado}
                        >
                            Vincular caso
                        </button>

                        <div class="flex-1">
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-2"
                                >Casos vinculados:</label
                            >
                            {#if data.casosRelacionados.length === 0}
                                <div class="text-sm text-gray-500 italic">
                                    Não possui casos relacionados
                                </div>
                            {:else}
                                <div class="space-y-2">
                                    {#each data.casosRelacionados as caso, i}
                                        <div class="flex items-center gap-2">
                                            <input
                                                type="text"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                bind:value={caso.id_vitima}
                                                placeholder="ID do caso ou nome da vítima"
                                            />
                                            <button
                                                class="text-red-500 hover:text-red-700"
                                                on:click={() =>
                                                    removeCasoRelacionado(i)}
                                            >
                                                <span
                                                    class="material-icons text-lg"
                                                    >cancel</span
                                                >
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Container1_5: Case Info (Left) -->
                <div
                    class="flex-1 border border-gray-300 rounded-lg p-4 shadow-sm relative"
                >
                    <div class="space-y-4">
                        <!-- Data -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Data:</label
                            >
                            <input
                                type="date"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                bind:value={data.Data}
                            />
                        </div>

                        <!-- Comarca -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Comarca de origem:</label
                            >
                            <select
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                bind:value={data.Comarca_origem}
                            >
                                <option value="">Selecione...</option>
                                {#each ["ABAETE", "ABRE CAMPO", "ACUCENA", "AGUA BOA", "AGUAS FORMOSAS", "AIMORES", "AIURUOCA", "ALEM PARAIBA", "ALFENAS", "ALMENARA", "ALPINOPOLIS", "ALTO RIO DOCE", "ALVINOPOLIS", "ANDRADAS", "ANDRELANDIA", "ARACUAI", "ARAGUARI", "ARAXA", "ARCOS", "AREADO", "ARINOS", "BAEPENDI", "BAMBUI", "BARAO DE COCAIS", "BARBACENA", "BARROSO", "BELO HORIZONTE", "BELO ORIENTE", "BELO VALE", "BETIM", "BICAS", "BOA ESPERANCA", "BOCAIUVA", "BOM DESPACHO", "BOM JESUS DO GALHO", "BOM SUCESSO", "BONFIM", "BONFINOPOLIS DE MINAS", "BORDA DA MATA", "BOTELHOS", "BRASILIA DE MINAS", "BRAZÓPOLIS", "BRUMADINHO", "BUENO BRANDAO", "BUENOPOLIS", "BURITIS", "CABO VERDE", "CACHOEIRA DE MINAS", "CAETE", "CALDAS", "CAMANDUCAIA", "CAMBUÍ", "CAMBUQUIRA", "CAMPANHA", "CAMPESTRE", "CAMPINA VERDE", "CAMPO BELO", "CAMPOS ALTOS", "CAMPOS GERAIS", "CANAPOLIS", "CANDEIAS", "CAPELINHA", "CAPINOPOLIS", "CARANDAI", "CARANGOLA", "CARATINGA", "CARLOS CHAGAS", "CARMO DA MATA", "CARMO DE MINAS", "CARMO DO CAJURU", "CARMO DO PARANAIBA", "CARMO DO RIO CLARO", "CARMOPOLIS DE MINAS", "CARNEIRINHO", "CASSIA", "CATAGUASES", "CAXAMBU", "CLAUDIO", "CONCEICAO DAS ALAGOAS", "CONCEICAO DO MATO DENTRO", "CONCEICAO DO RIO VERDE", "CONGONHAS", "CONQUISTA", "CONSELHEIRO LAFAIETE", "CONSELHEIRO PENA", "CONTAGEM", "CORACAO DE JESUS", "CORINTO", "COROACI", "COROMANDEL", "CORONEL FABRICIANO", "CRISTINA", "CRUZILIA", "CURVELO", "DIAMANTINA", "DIVINO", "DIVINOPOLIS", "DORES DO INDAIA", "ELOI MENDES", "ENTRE RIOS DE MINAS", "ERVALIA", "ESMERALDAS", "ESPERA FELIZ", "ESPINOSA", "ESTRELA DO SUL", "EUGENOPOLIS", "EXTREMA", "FERROS", "FORMIGA", "FRANCISCO SA", "FRONTEIRA", "FRUTAL", "GALILEIA", "GOVERNADOR VALADARES", "GRAO MOGOL", "GUANHAES", "GUAPE", "GUARANESIA", "GUARANI", "GUAXUPE", "IBIA", "IBIRACI", "IBIRITE", "IGARAPE", "IGUATAMA", "INHAPIM", "IPANEMA", "IPATINGA", "ITABIRA", "ITABIRINHA", "ITABIRITO", "ITAGUARA", "ITAJUBA", "ITAMARANDIBA", "ITAMBACURI", "ITAMOGI", "ITAMONTE", "ITANHANDU", "ITANHOMI", "ITAOBIM", "ITAPAGIPE", "ITAPECERICA", "ITAUNA", "ITUIUTABA", "ITUMIRIM", "ITURAMA", "JABOTICATUBAS", "JACINTO", "JACUI", "JACUTINGA", "JAIBA", "JANAUBA", "JANUARIA", "JEQUERI", "JEQUITINHONHA", "JOAIMA", "JOAO MONLEVADE", "JOAO PINHEIRO", "JUATUBA", "JUIZ DE FORA", "LAGOA DA PRATA", "LAGOA DOURADA", "LAGOA SANTA", "LAJINHA", "LAMBARI", "LAVRAS", "LEOPOLDINA", "LIMA DUARTE", "LUZ", "MACHADO", "MALACACHETA", "MANGA", "MANHUACU", "MANHUMIRIM", "MANTENA", "MAR DE ESPANHA", "MARIANA", "MARTINHO CAMPOS", "MATEUS LEME", "MATIAS BARBOSA", "MATO VERDE", "MATOZINHOS", "MEDINA", "MERCES", "MESQUITA", "MINAS NOVAS", "MIRABELA", "MIRADOURO", "MIRAI", "MONTALVANIA", "MONTE ALEGRE DE MINAS", "MONTE AZUL", "MONTE BELO", "MONTE CARMELO", "MONTE SANTO DE MINAS", "MONTE SIAO", "MONTES CLAROS", "MORADA NOVA DE MINAS", "MURIAE", "MUTUM", "MUZAMBINHO", "NANUQUE", "NATERCIA", "NEPOMUCENO", "NOVA ERA", "NOVA LIMA", "NOVA PONTE", "NOVA RESENDE", "NOVA SERRANA", "NOVO CRUZEIRO", "OLIVEIRA", "OURO BRANCO", "OURO FINO", "OURO PRETO", "PADRE PARAISO", "PAINS", "PALMA", "PAPAGAIOS", "PARA DE MINAS", "PARACATU", "PARAGUACU", "PARAISOPOLIS", "PARAOPEBA", "PASSA QUATRO", "PASSA TEMPO", "PASSOS", "PATOS DE MINAS", "PATROCINIO", "PECANHA", "PEDRA AZUL", "PEDRALVA", "PEDRO LEOPOLDO", "PERDIZES", "PERDOES", "PIRANGA", "PIRAPETINGA", "PIRAPORA", "PITANGUI", "PIUMHI", "POCO FUNDO", "POCOS DE CALDAS", "POMPEU", "PONTE NOVA", "PORTEIRINHA", "POUSO ALEGRE", "PRADOS", "PRATA", "PRATAPOLIS", "PRESIDENTE OLEGARIO", "RAUL SOARES", "RESENDE COSTA", "RESPLENDOR", "RIBEIRAO DAS NEVES", "RIO CASCA", "RIO NOVO", "RIO PARANAIBA", "RIO PARDO DE MINAS", "RIO PIRACICABA", "RIO POMBA", "RIO PRETO", "RIO VERMELHO", "RUBIM", "SABARA", "SABINOPOLIS", "SACRAMENTO", "SALINAS", "SANTA BARBARA", "SANTA LUZIA", "SANTA MARIA DE ITABIRA", "SANTA MARIA DO SUACUI", "SANTA RITA DE CALDAS", "SANTA RITA DO SAPUCAI", "SANTA VITORIA", "SANTO ANTONIO DO AMPARO", "SANTO ANTONIO DO MONTE", "SANTOS DUMONT", "SAO DOMINGOS DO PRATA", "SAO FRANCISCO", "SAO GONCALO DO ABAETE", "SAO GONCALO DO PARA", "SAO GONCALO DO SAPUCAI", "SAO GOTARDO", "SAO JOAO DA PONTE", "SAO JOAO DEL REI", "SAO JOAO DO PARAISO", "SAO JOAO EVANGELISTA", "SAO JOAO NEPOMUCENO", "SAO LOURENCO", "SAO ROMAO", "SAO ROQUE DE MINAS", "SAO SEBASTIAO DO PARAISO", "SAO TOMAS DE AQUINO", "SENADOR FIRMINO", "SERRO", "SETE LAGOAS", "SILVIANOPOLIS", "TAIOBEIRAS", "TARUMIRIM", "TEIXEIRAS", "TEOFILO OTONI", "TIMOTEO", "TIROS", "TOCANTINS", "TOMBOS", "TRES CORACOES", "TRES MARIAS", "TRES PONTAS", "TUPACIGUARA", "TURMALINA", "UBA", "UBERABA", "UBERLANDIA", "UNAI", "VARGINHA", "VARZEA DA PALMA", "VAZANTE", "VESPASIANO", "VICOSA", "VIRGINOPOLIS", "VISCONDE DO RIO BRANCO"] as comarca}
                                    <option value={comarca}>{comarca}</option>
                                {/each}
                            </select>
                        </div>

                        <!-- Num Procedimento -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Nº do Procedimento / Sistema MPE:</label
                            >
                            <input
                                type="text"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                bind:value={data.N_procedimento_MPE}
                            />
                        </div>

                        <!-- Atendimento Especial -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Precisa de atendimento especial?</label
                            >
                            <div class="flex gap-4 mt-2">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary h-5 w-5"
                                        name="atendimentoEspecial"
                                        value="Não"
                                        bind:group={
                                            data.Precisa_Atendimento_Esp
                                        }
                                    />
                                    <span class="ml-2 text-[15px]">Não</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        class="form-radio text-save-primary h-5 w-5"
                                        name="atendimentoEspecial"
                                        value="Sim"
                                        bind:group={
                                            data.Precisa_Atendimento_Esp
                                        }
                                    />
                                    <span class="ml-2 text-[15px]">Sim</span>
                                </label>
                            </div>
                            <button
                                type="button"
                                class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                on:click={() =>
                                    (data.Precisa_Atendimento_Esp = "")}
                                title="Limpar seleção"
                            >
                                <span class="material-icons text-sm">close</span
                                >
                            </button>
                        </div>

                        {#if data.Precisa_Atendimento_Esp === "Sim"}
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Qual tipo de atendimento?</label
                                >
                                <input
                                    type="text"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    placeholder="Descreva o tipo de atendimento especial"
                                    bind:value={data.Atendimento_Especial}
                                />
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Container1_6: Contact Info (Right) -->
                <div
                    class="flex-1 border border-gray-300 rounded-lg p-4 shadow-sm relative"
                >
                    <div class="space-y-4">
                        <!-- Quem encaminha -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Quem encaminha:</label
                            >
                            <select
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                bind:value={data.Quem_encaminha}
                            >
                                <option value="">Selecione...</option>
                                {#each ["MPMG", "Ministério Público (outros)", "Poder Judiciário", "DPMG", "Polícia Civil", "Polícia Militar", "Poder legislativo", "Sociedade Civil", "Serviço Público", "Demanda espontânea"] as item}
                                    <option value={item}>{item}</option>
                                {/each}
                            </select>
                        </div>

                        <!-- Contatos Header -->
                        <div>
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Contatos da porta de entrada</label
                            >
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Nome -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Nome:</label
                                >
                                <input
                                    type="text"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.PE_nome}
                                />
                            </div>

                            <!-- Telefone -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Telefone:</label
                                >
                                <input
                                    type="text"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.PE_telefone}
                                />
                            </div>

                            <!-- Email -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >E-mail:</label
                                >
                                <input
                                    type="email"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.PE_email}
                                />
                            </div>

                            <!-- Cargo -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Cargo/função:</label
                                >
                                <input
                                    type="text"
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.PE_cargo}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- containerBgData_2: Observações, Vitimização, Crimes -->
            <div
                class="border border-gray-300 rounded-lg p-4 shadow-sm relative"
                style="height: auto;"
            >
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >Crimes ou ato infracional que está relacionado</label
                >
                <div class="flex flex-col lg:flex-row gap-6">
                    <!-- Left Column: Crimes -->
                    <div class="w-full lg:w-1/3">
                        <div class="space-y-2">
                            <!-- Classificação do Crime -->
                            <div class="mt-4">
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Classificação do crime ou ato infracional:</label
                                >
                                <select
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.Classificacao_crime}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Consumado">Consumado</option>
                                    <option value="Tentado">Tentado</option>
                                </select>
                            </div>
                            <!-- Crimes contra a vida -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        checked={data.crimes.includes(
                                            "Crimes contra a vida",
                                        )}
                                        on:change={() =>
                                            toggleCrimeCategory(
                                                "Crimes contra a vida",
                                            )}
                                    />
                                    <span class="ml-2 text-sm"
                                        >Crimes contra a vida</span
                                    >
                                </label>
                                {#if data.crimes.includes("Crimes contra a vida")}
                                    <div
                                        class="ml-6 mt-1 p-2 bg-gray-50 border rounded text-xs space-y-1"
                                    >
                                        {#each ["Homicídio simples", "Homicídio qualificado", "Feminicídio", "Induzimento, instigação ou auxílio a suicídio ou a automutilação", "Infanticídio", "Aborto provocado por terceiro"] as crime}
                                            <label class="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    class="form-checkbox text-save-primary h-3 w-3"
                                                    checked={data.specificCrimes.includes(
                                                        crime,
                                                    )}
                                                    on:change={() =>
                                                        toggleSpecificCrime(
                                                            crime,
                                                        )}
                                                />
                                                <span class="ml-1">{crime}</span
                                                >
                                            </label>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <!-- Crimes contra a dignidade sexual -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        checked={data.crimes.includes(
                                            "Crimes contra a dignidade sexual",
                                        )}
                                        on:change={() =>
                                            toggleCrimeCategory(
                                                "Crimes contra a dignidade sexual",
                                            )}
                                    />
                                    <span class="ml-2 text-sm"
                                        >Crimes contra a dignidade sexual</span
                                    >
                                </label>
                                {#if data.crimes.includes("Crimes contra a dignidade sexual")}
                                    <div
                                        class="ml-6 mt-1 p-2 bg-gray-50 border rounded text-xs space-y-1"
                                    >
                                        {#each ["Estupro", "Estupro de vulnerável", "Estupro coletivo", "Estupro corretivo", "Violação sexual mediante fraude", "Importunação sexual", "Assédio sexual", "Registro não autorizado da intimidade sexual", "Corrupção de menores", "Satisfação de lascívia mediante presença de criança ou adolescente", "Favorecimento da prostituição ou de outra forma de exploração sexual de criança ou adolescente ou de vulnerável", "Divulgação de cena de estupro ou de cena de estupro de vulnerável, de cena de sexo ou de pornografia", "Outro"] as crime}
                                            <label class="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    class="form-checkbox text-save-primary h-3 w-3"
                                                    checked={data.specificCrimes.includes(
                                                        crime,
                                                    )}
                                                    on:change={() =>
                                                        toggleSpecificCrime(
                                                            crime,
                                                        )}
                                                />
                                                <span class="ml-1">{crime}</span
                                                >
                                            </label>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <!-- Crimes de ódio -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        checked={data.crimes.includes(
                                            "Crimes de ódio",
                                        )}
                                        on:change={() =>
                                            toggleCrimeCategory(
                                                "Crimes de ódio",
                                            )}
                                    />
                                    <span class="ml-2 text-sm"
                                        >Crimes de ódio</span
                                    >
                                </label>
                                {#if data.crimes.includes("Crimes de ódio")}
                                    <div
                                        class="ml-6 mt-1 p-2 bg-gray-50 border rounded text-xs space-y-1"
                                    >
                                        {#each ["Racismo", "Homofobia", "Lesbofobia", "Transfobia", "Bifobia", "Xenofobia", "Racismo religioso"] as crime}
                                            <label class="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    class="form-checkbox text-save-primary h-3 w-3"
                                                    checked={data.specificCrimes.includes(
                                                        crime,
                                                    )}
                                                    on:change={() =>
                                                        toggleSpecificCrime(
                                                            crime,
                                                        )}
                                                />
                                                <span class="ml-1">{crime}</span
                                                >
                                            </label>
                                        {/each}
                                    </div>
                                {/if}
                            </div>

                            <!-- Outros -->
                            <div>
                                <label class="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        class="form-checkbox text-save-primary"
                                        checked={data.crimes.includes("Outros")}
                                        on:change={() =>
                                            toggleCrimeCategory("Outros")}
                                    />
                                    <span class="ml-2 text-sm">Outros</span>
                                </label>
                                {#if data.crimes.includes("Outros")}
                                    <div
                                        class="ml-6 mt-1 p-2 bg-gray-50 border rounded text-xs space-y-1"
                                    >
                                        {#each ["Patrimonial", "Violência Doméstica", "Integridade física", "Outros"] as crime}
                                            <label class="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    class="form-checkbox text-save-primary h-3 w-3"
                                                    checked={data.specificCrimes.includes(
                                                        crime,
                                                    )}
                                                    on:change={() =>
                                                        toggleSpecificCrime(
                                                            crime,
                                                        )}
                                                />
                                                <span class="ml-1">{crime}</span
                                                >
                                            </label>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Classificação Vítima, Vitimização, Observações -->
                    <div class="flex-1 space-y-4">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <!-- Classificação Vítima -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Classificação da Vítima:</label
                                >
                                <select
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                    bind:value={data.Classificacao_vitima}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Vítima direta"
                                        >Vítima direta</option
                                    >
                                    <option
                                        value="Vítima Indireta (afeto e/ou grau 1,2,3 + convivência e/ou dependência)"
                                        >Vítima Indireta (afeto e/ou grau 1,2,3
                                        + convivência e/ou dependência)</option
                                    >
                                    <option
                                        value="Familiar (grau 4 ou dependência)"
                                        >Familiar (grau 4 ou dependência)</option
                                    >
                                    <option value="Vítima Coletiva"
                                        >Vítima Coletiva</option
                                    >
                                </select>
                            </div>

                            <!-- Vitimização -->
                            <div>
                                <label
                                    class="block text-sm font-semibold text-gray-700 mb-1"
                                    >Vitimização:</label
                                >
                                <div class="flex gap-2">
                                    <select
                                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                        bind:value={data.Vitimizacao}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Primária"
                                            >Primária</option
                                        >
                                        <option value="Secundária"
                                            >Secundária</option
                                        >
                                        <option value="Terciária"
                                            >Terciária</option
                                        >
                                    </select>
                                    {#if data.Vitimizacao === "Terciária"}
                                        <div>
                                            <input
                                                type="text"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                placeholder="Qual a origem? *"
                                                bind:value={
                                                    data.Vit_Terciaria_Origem
                                                }
                                            />
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>

                        <!-- Observações -->
                        <div class="p-8">
                            <label
                                class="block text-sm font-semibold text-gray-700 mb-1"
                                >Observações:</label
                            >
                            <textarea
                                class="block w-full h-[300px] rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                bind:value={data.Observacao}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Manual Save Button -->
            <div class="flex justify-end mt-4">
                <div class="flex flex-col items-center">
                    <button
                        class="bg-save-primary text-white px-6 py-2 rounded shadow hover:bg-save-secondary transition-colors disabled:opacity-50"
                        on:click={manualSave}
                        disabled={saving || loading}
                    >
                        {saving ? "Salvando..." : "Salvar Dados"}
                    </button>
                    {#if saveStatus && saveStatus.includes("Salvo")}
                        <span class="text-green-600 font-medium mt-2 text-sm"
                            >Salvo com sucesso!</span
                        >
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
