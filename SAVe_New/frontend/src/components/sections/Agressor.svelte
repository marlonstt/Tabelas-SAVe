<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        agressores: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    // Options for dropdowns
    const sexoOptions = ["Feminino", "Masculino", "Intersexo", "Não informado"];
    const identidadeGeneroOptions = [
        "Homem cisgênero",
        "Mulher cisgênero",
        "Homem trans",
        "Mulher trans",
        "Travesti",
        "Não binária",
        "Outra",
        "Não informado",
    ];
    const identidadeSexualOptions = [
        "Heterossexual",
        "Homossexual - Lésbica",
        "Homossexual - Gay",
        "Bissexual",
        "Pansexual",
        "Assexual",
        "Queer",
        "Outra",
        "Não informado",
    ];
    const racaOptions = [
        "Amarelo",
        "Branco",
        "Indígena",
        "Pardo",
        "Preto",
        "Outro",
    ];
    const religiaoOptions = [
        "Católica",
        "Evangélica",
        "Espírita",
        "Umbanda",
        "Candomblé",
        "Testemunha de Jeová",
        "Outro",
        "Sem religião",
        "Não informado",
    ];
    const estadoCivilOptions = [
        "Solteira (o)",
        "Casada (o)",
        "Divorciada (o)",
        "Separada (o)",
        "União estável c/ declaração",
        "União estável s/ declaração",
        "Viuvo",
    ];
    const situacaoMoradiaOptions = [
        "Própria",
        "Alugada",
        "Cedida",
        "Ocupação",
        "Situação de Rua",
        "Outra",
    ];
    const tipoAgressorOptions = ["Pessoa Natural", "Pessoa Jurídica"];
    const docSituacaoOptions = ["Regular", "Irregular", "Pendente"];
    const nacionalidadeOptions = [
        "Afegã (Afeganistão)",
        "Albanesa (Albânia)",
        "Alemã (Alemanha)",
        "Andorrana (Andorra)",
        "Angolana (Angola)",
        "Antiguana (Antígua e Barbuda)",
        "Saudita (Arábia Saudita)",
        "Argelina (Argélia)",
        "Argentina (Argentina)",
        "Armênia (Armênia)",
        "Australiana (Austrália)",
        "Austríaca (Áustria)",
        "Azerbaijana (Azerbaijão)",
        "Bahamenha (Bahamas)",
        "Bangladeshiana (Bangladesh)",
        "Barbadiana (Barbados)",
        "Bareinita (Bahrein)",
        "Belga (Bélgica)",
        "Belizenha (Belize)",
        "Beninense (Benin)",
        "Bielorrussa (Bielorrússia)",
        "Boliviana (Bolívia)",
        "Bósnia (Bósnia e Herzegovina)",
        "Botsuanesa (Botsuana)",
        "Brasileira (Brasil)",
        "Britânica (Reino Unido)",
        "Bruneana (Brunei)",
        "Búlgara (Bulgária)",
        "Burkinesa (Burkina Faso)",
        "Burundesa (Burundi)",
        "Butanesa (Butão)",
        "Cabo-verdiana (Cabo Verde)",
        "Camaronesa (Camarões)",
        "Cambojana (Camboja)",
        "Canadense (Canadá)",
        "Cazaque (Cazaquistão)",
        "Chadiana (Chade)",
        "Chilena (Chile)",
        "Chinesa (China)",
        "Cingapuriana (Cingapura)",
        "Colombiana (Colômbia)",
        "Comorense (Comores)",
        "Congolesa (República do Congo)",
        "Costarriquenha (Costa Rica)",
        "Croata (Croácia)",
        "Cubana (Cuba)",
        "Dinamarquesa (Dinamarca)",
        "Dominicana (República Dominicana)",
        "Egípcia (Egito)",
        "Salvadorenha (El Salvador)",
        "Emiradense (Emirados Árabes Unidos)",
        "Equatoriana (Equador)",
        "Eritreia (Eritreia)",
        "Eslovaca (Eslováquia)",
        "Eslovena (Eslovênia)",
        "Espanhola (Espanha)",
        "Estoniana (Estônia)",
        "Etíope (Etiópia)",
        "Fijiana (Fiji)",
        "Filipina (Filipinas)",
        "Finlandesa (Finlândia)",
        "Francesa (França)",
        "Gabonesa (Gabão)",
        "Gambiana (Gâmbia)",
        "Ganense (Gana)",
        "Georgiana (Geórgia)",
        "Grega (Grécia)",
        "Granadina (Granada)",
        "Guatemalteca (Guatemala)",
        "Guianense (Guiana)",
        "Guiné-Bissauense (Guiné-Bissau)",
        "Guineense (Guiné)",
        "Haitiana (Haiti)",
        "Holandesa (Holanda)",
        "Hondurenha (Honduras)",
        "Húngara (Hungria)",
        "Iemenita (Iêmen)",
        "Indiana (Índia)",
        "Indonésia (Indonésia)",
        "Iraniana (Irã)",
        "Iraquiana (Iraque)",
        "Irlandesa (Irlanda)",
        "Islandesa (Islândia)",
        "Israelense (Israel)",
        "Italiana (Itália)",
        "Jamaicana (Jamaica)",
        "Japonesa (Japão)",
        "Jordana (Jordânia)",
        "Kosovar (Kosovo)",
        "Kuwaitiana (Kuwait)",
        "Laosiana (Laos)",
        "Letã (Letônia)",
        "Libanesa (Líbano)",
        "Liberiana (Libéria)",
        "Líbia (Líbia)",
        "Liechtensteinense (Liechtenstein)",
        "Lituana (Lituânia)",
        "Luxemburguesa (Luxemburgo)",
        "Macedônia (Macedônia do Norte)",
        "Madagascarense (Madagascar)",
        "Malásia (Malásia)",
        "Malauiana (Malaui)",
        "Maldiva (Maldivas)",
        "Malienses (Mali)",
        "Maltesa (Malta)",
        "Marroquina (Marrocos)",
        "Marshallina (Ilhas Marshall)",
        "Mauritana (Mauritânia)",
        "Mexicana (México)",
        "Mianmarense (Mianmar)",
        "Micronésia (Micronésia)",
        "Moçambicana (Moçambique)",
        "Moldava (Moldávia)",
        "Monacanesa (Mônaco)",
        "Mongol (Mongólia)",
        "Montenegrina (Montenegro)",
        "Namibiana (Namíbia)",
        "Nauruana (Nauru)",
        "Nepalesa (Nepal)",
        "Neozelandesa (Nova Zelândia)",
        "Nicaraguense (Nicarágua)",
        "Nigeriana (Nigéria)",
        "Norueguesa (Noruega)",
        "Omã (Omã)",
        "Palauense (Palau)",
        "Panamenha (Panamá)",
        "Papua (Papua-Nova Guiné)",
        "Paquistanesa (Paquistão)",
        "Paraguaia (Paraguai)",
        "Peruana (Peru)",
        "Polonesa (Polônia)",
        "Portuguesa (Portugal)",
        "Queniana (Quênia)",
        "Quirguiz (Quirguistão)",
        "Romena (Romênia)",
        "Ruandesa (Ruanda)",
        "Russa (Rússia)",
        "Samoana (Samoa)",
        "Santa-lucense (Santa Lúcia)",
        "São-cristovense (São Cristóvão e Nevis)",
        "São-marinense (San Marino)",
        "São-tomense (São Tomé e Príncipe)",
        "São-vicentina (São Vicente e Granadinas)",
        "Saudita (Arábia Saudita)",
        "Senegalesa (Senegal)",
        "Sérvia (Sérvia)",
        "Síria (Síria)",
        "Somali (Somália)",
        "Sul-africana (África do Sul)",
        "Sudanesa (Sudão)",
        "Sueca (Suécia)",
        "Suíça (Suíça)",
        "Surinamesa (Suriname)",
        "Tadjique (Tadjiquistão)",
        "Tailandesa (Tailândia)",
        "Tanzaniana (Tanzânia)",
        "Tcheca (República Tcheca)",
        "Timorense (Timor-Leste)",
        "Togolesa (Togo)",
        "Tonganesa (Tonga)",
        "Trinidadiana (Trinidad e Tobago)",
        "Tunisiana (Tunísia)",
        "Turca (Turquia)",
        "Tuvaluana (Tuvalu)",
        "Ucraniana (Ucrânia)",
        "Ugandense (Uganda)",
        "Uruguaia (Uruguai)",
        "Usbeque (Uzbequistão)",
        "Vanuatuense (Vanuatu)",
        "Vaticana (Vaticano)",
        "Venezuelana (Venezuela)",
        "Vietnamita (Vietnã)",
        "Zambiana (Zâmbia)",
        "Zimbabuana (Zimbábue)",
    ];
    const naturalidadeOptions = [
        "ABAETE",
        "ABRE CAMPO",
        "ACUCENA",
        "AGUA BOA",
        "AGUAS FORMOSAS",
        "AIMORES",
        "AIURUOCA",
        "ALEM PARAIBA",
        "ALFENAS",
        "ALMENARA",
        "ALPINOPOLIS",
        "ALTO RIO DOCE",
        "ALVINOPOLIS",
        "ANDRADAS",
        "ANDRELANDIA",
        "ARACUAI",
        "ARAGUARI",
        "ARAXA",
        "ARCOS",
        "AREADO",
        "ARINOS",
        "BAEPENDI",
        "BAMBUI",
        "BARAO DE COCAIS",
        "BARBACENA",
        "BARROSO",
        "BELO HORIZONTE",
        "BELO ORIENTE",
        "BELO VALE",
        "BETIM",
        "BICAS",
        "BOA ESPERANCA",
        "BOCAIUVA",
        "BOM DESPACHO",
        "BOM JESUS DO GALHO",
        "BOM SUCESSO",
        "BONFIM",
        "BONFINOPOLIS DE MINAS",
        "BORDA DA MATA",
        "BOTELHOS",
        "BRASILIA DE MINAS",
        "BRAZÓPOLIS",
        "BRUMADINHO",
        "BUENO BRANDAO",
        "BUENOPOLIS",
        "BURITIS",
        "CABO VERDE",
        "CACHOEIRA DE MINAS",
        "CAETE",
        "CALDAS",
        "CAMANDUCAIA",
        "CAMBUÍ",
        "CAMBUQUIRA",
        "CAMPANHA",
        "CAMPESTRE",
        "CAMPINA VERDE",
        "CAMPO BELO",
        "CAMPOS ALTOS",
        "CAMPOS GERAIS",
        "CANAPOLIS",
        "CANDEIAS",
        "CAPELINHA",
        "CAPINOPOLIS",
        "CARANDAI",
        "CARANGOLA",
        "CARATINGA",
        "CARLOS CHAGAS",
        "CARMO DA MATA",
        "CARMO DE MINAS",
        "CARMO DO CAJURU",
        "CARMO DO PARANAIBA",
        "CARMO DO RIO CLARO",
        "CARMOPOLIS DE MINAS",
        "CARNEIRINHO",
        "CASSIA",
        "CATAGUASES",
        "CAXAMBU",
        "CLAUDIO",
        "CONCEICAO DAS ALAGOAS",
        "CONCEICAO DO MATO DENTRO",
        "CONCEICAO DO RIO VERDE",
        "CONGONHAS",
        "CONQUISTA",
        "CONSELHEIRO LAFAIETE",
        "CONSELHEIRO PENA",
        "CONTAGEM",
        "CORACAO DE JESUS",
        "CORINTO",
        "COROACI",
        "COROMANDEL",
        "CORONEL FABRICIANO",
        "CRISTINA",
        "CRUZILIA",
        "CURVELO",
        "DIAMANTINA",
        "DIVINO",
        "DIVINOPOLIS",
        "DORES DO INDAIA",
        "ELOI MENDES",
        "ENTRE RIOS DE MINAS",
        "ERVALIA",
        "ESMERALDAS",
        "ESPERA FELIZ",
        "ESPINOSA",
        "ESTRELA DO SUL",
        "EUGENOPOLIS",
        "EXTREMA",
        "FERROS",
        "FORMIGA",
        "FRANCISCO SA",
        "FRONTEIRA",
        "FRUTAL",
        "GALILEIA",
        "GOVERNADOR VALADARES",
        "GRAO MOGOL",
        "GUANHAES",
        "GUAPE",
        "GUARANESIA",
        "GUARANI",
        "GUAXUPE",
        "IBIA",
        "IBIRACI",
        "IBIRITE",
        "IGARAPE",
        "IGUATAMA",
        "INHAPIM",
        "IPANEMA",
        "IPATINGA",
        "ITABIRA",
        "ITABIRINHA",
        "ITABIRITO",
        "ITAGUARA",
        "ITAJUBA",
        "ITAMARANDIBA",
        "ITAMBACURI",
        "ITAMOGI",
        "ITAMONTE",
        "ITANHANDU",
        "ITANHOMI",
        "ITAOBIM",
        "ITAPAGIPE",
        "ITAPECERICA",
        "ITAUNA",
        "ITUIUTABA",
        "ITUMIRIM",
        "ITURAMA",
        "JABOTICATUBAS",
        "JACINTO",
        "JACUI",
        "JACUTINGA",
        "JAIBA",
        "JANAUBA",
        "JANUARIA",
        "JEQUERI",
        "JEQUITINHONHA",
        "JOAIMA",
        "JOAO MONLEVADE",
        "JOAO PINHEIRO",
        "JUATUBA",
        "JUIZ DE FORA",
        "LAGOA DA PRATA",
        "LAGOA DOURADA",
        "LAGOA SANTA",
        "LAJINHA",
        "LAMBARI",
        "LAVRAS",
        "LEOPOLDINA",
        "LIMA DUARTE",
        "LUZ",
        "MACHADO",
        "MALACACHETA",
        "MANGA",
        "MANHUACU",
        "MANHUMIRIM",
        "MANTENA",
        "MAR DE ESPANHA",
        "MARIANA",
        "MARTINHO CAMPOS",
        "MATEUS LEME",
        "MATIAS BARBOSA",
        "MATO VERDE",
        "MATOZINHOS",
        "MEDINA",
        "MERCES",
        "MESQUITA",
        "MINAS NOVAS",
        "MIRABELA",
        "MIRADOURO",
        "MIRAI",
        "MONTALVANIA",
        "MONTE ALEGRE DE MINAS",
        "MONTE AZUL",
        "MONTE BELO",
        "MONTE CARMELO",
        "MONTE SANTO DE MINAS",
        "MONTE SIAO",
        "MONTES CLAROS",
        "MORADA NOVA DE MINAS",
        "MURIAE",
        "MUTUM",
        "MUZAMBINHO",
        "NANUQUE",
        "NATERCIA",
        "NEPOMUCENO",
        "NOVA ERA",
        "NOVA LIMA",
        "NOVA PONTE",
        "NOVA RESENDE",
        "NOVA SERRANA",
        "NOVO CRUZEIRO",
        "OLIVEIRA",
        "OURO BRANCO",
        "OURO FINO",
        "OURO PRETO",
        "PADRE PARAISO",
        "PAINS",
        "PALMA",
        "PAPAGAIOS",
        "PARA DE MINAS",
        "PARACATU",
        "PARAGUACU",
        "PARAISOPOLIS",
        "PARAOPEBA",
        "PASSA QUATRO",
        "PASSA TEMPO",
        "PASSOS",
        "PATOS DE MINAS",
        "PATROCINIO",
        "PECANHA",
        "PEDRA AZUL",
        "PEDRALVA",
        "PEDRO LEOPOLDO",
        "PERDIZES",
        "PERDOES",
        "PIRANGA",
        "PIRAPETINGA",
        "PIRAPORA",
        "PITANGUI",
        "PIUMHI",
        "POCO FUNDO",
        "POCOS DE CALDAS",
        "POMPEU",
        "PONTE NOVA",
        "PORTEIRINHA",
        "POUSO ALEGRE",
        "PRADOS",
        "PRATA",
        "PRATAPOLIS",
        "PRESIDENTE OLEGARIO",
        "RAUL SOARES",
        "RESENDE COSTA",
        "RESPLENDOR",
        "RIBEIRAO DAS NEVES",
        "RIO CASCA",
        "RIO NOVO",
        "RIO PARANAIBA",
        "RIO PARDO DE MINAS",
        "RIO PIRACICABA",
        "RIO POMBA",
        "RIO PRETO",
        "RIO VERMELHO",
        "RUBIM",
        "SABARA",
        "SABINOPOLIS",
        "SACRAMENTO",
        "SALINAS",
        "SANTA BARBARA",
        "SANTA LUZIA",
        "SANTA MARIA DE ITABIRA",
        "SANTA MARIA DO SUACUI",
        "SANTA RITA DE CALDAS",
        "SANTA RITA DO SAPUCAI",
        "SANTA VITORIA",
        "SANTO ANTONIO DO AMPARO",
        "SANTO ANTONIO DO MONTE",
        "SANTOS DUMONT",
        "SAO DOMINGOS DO PRATA",
        "SAO FRANCISCO",
        "SAO GONCALO DO ABAETE",
        "SAO GONCALO DO PARA",
        "SAO GONCALO DO SAPUCAI",
        "SAO GOTARDO",
        "SAO JOAO DA PONTE",
        "SAO JOAO DEL REI",
        "SAO JOAO DO PARAISO",
        "SAO JOAO EVANGELISTA",
        "SAO JOAO NEPOMUCENO",
        "SAO LOURENCO",
        "SAO ROMAO",
        "SAO ROQUE DE MINAS",
        "SAO SEBASTIAO DO PARAISO",
        "SAO TOMAS DE AQUINO",
        "SENADOR FIRMINO",
        "SERRO",
        "SETE LAGOAS",
        "SILVIANOPOLIS",
        "TAIOBEIRAS",
        "TARUMIRIM",
        "TEIXEIRAS",
        "TEOFILO OTONI",
        "TIMOTEO",
        "TIROS",
        "TOCANTINS",
        "TOMBOS",
        "TRES CORACOES",
        "TRES MARIAS",
        "TRES PONTAS",
        "TUPACIGUARA",
        "TURMALINA",
        "UBA",
        "UBERABA",
        "UBERLANDIA",
        "UNAI",
        "VARGINHA",
        "VARZEA DA PALMA",
        "VAZANTE",
        "VESPASIANO",
        "VICOSA",
        "VIRGINOPOLIS",
        "VISCONDE DO RIO BRANCO",
    ];

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            const agressores = response.data.agressor || [];
            const enderecos = response.data.agressorEnderecos || [];

            // Merge addresses into aggressors
            data.agressores = agressores.map((ag: any) => ({
                ...ag,
                enderecos: enderecos.filter(
                    (end: any) => end.ID_Perfil_Agressor === ag.ID,
                ),
            }));
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Agressor");
            data = {
                agressores: [],
            };
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    });

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/agressor`, {
                agressores: data.agressores,
            });
            saveStatus = "Salvo com sucesso! ✅";
            lastSavedData = JSON.stringify(data);
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

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            if (saving) return;
            saving = true;
            saveStatus = "Salvando...";
            try {
                await api.put(`/cases/${caseId}/agressor`, {
                    agressores: data.agressores,
                });
                console.log("Autosaving Agressor...", data);
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

    $: if (data) autosave();

    function addAgressor() {
        data.agressores = [
            ...data.agressores,
            {
                PA_Tipo_Agressor: "Pessoa Natural",
                enderecos: [],
                Modificado: new Date().toISOString(),
            },
        ];
        autosave();
    }

    function removeAgressor(index: number) {
        if (confirm("Tem certeza que deseja remover este agressor?")) {
            data.agressores = data.agressores.filter(
                (_: any, i: number) => i !== index,
            );
            autosave();
        }
    }

    function addEndereco(agressorIndex: number) {
        data.agressores[agressorIndex].enderecos = [
            ...data.agressores[agressorIndex].enderecos,
            { PAE_Endereco: "", PAE_Situacao_Moradia: "" },
        ];
        autosave();
    }

    function removeEndereco(agressorIndex: number, enderecoIndex: number) {
        data.agressores[agressorIndex].enderecos = data.agressores[
            agressorIndex
        ].enderecos.filter((_: any, i: number) => i !== enderecoIndex);
        autosave();
    }

    function calculateAge(birthDate: string): string {
        if (!birthDate) return "";
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age.toString();
    }

    function handleDateChange(agressor: any) {
        if (agressor.PA_Data_Nascimento) {
            agressor.PA_Idade = parseInt(
                calculateAge(agressor.PA_Data_Nascimento),
            );
        }
        autosave();
    }
</script>

<!-- Autosave Indicator -->
<div class="bg-white rounded shadow p-10 relative">
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
            Dados do(s) Suposto(s) Autor(es) da Violência
        </h2>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-8">
            {#each data.agressores as agressor, i}
                <div
                    class="border-2 border-gray-200 p-6 rounded-lg bg-white shadow-sm relative"
                >
                    <!-- Container8: Cabeçalho/Tipo -->
                    <div class="mb-6 border-b pb-4">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-lg font-semibold text-gray-700">
                                Agressor {i + 1}
                            </h3>
                            <button
                                class="text-red-500 hover:text-red-700 flex items-center text-sm"
                                on:click={() => removeAgressor(i)}
                            >
                                <span class="material-icons text-sm mr-1"
                                    >delete</span
                                >
                                Remover Agressor
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <label class="block">
                                <span class="text-gray-700 text-sm font-medium"
                                    >O agressor é pessoa natural ou jurídica?</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Tipo_Agressor}
                                    on:change={autosave}
                                >
                                    {#each tipoAgressorOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>

                            <label class="block">
                                <span class="text-gray-700 text-sm font-medium"
                                    >É vítima de múltiplos agressores?</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        agressor.PA_Vitima_Multiplos_Agress
                                    }
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </label>
                        </div>

                        {#if agressor.PA_Tipo_Agressor === "Pessoa Jurídica"}
                            <div
                                class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded"
                            >
                                <label class="block">
                                    <span class="text-gray-700 text-sm"
                                        >CNPJ</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={agressor.PA_CNPJ}
                                        on:input={autosave}
                                    />
                                </label>
                                <label class="block md:col-span-2">
                                    <span class="text-gray-700 text-sm"
                                        >Razão Social</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={agressor.PA_Razao_Social}
                                        on:input={autosave}
                                    />
                                </label>
                                <label class="block md:col-span-3">
                                    <span class="text-gray-700 text-sm"
                                        >Endereço (Jurídica)</span
                                    >
                                    <input
                                        type="text"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                        bind:value={
                                            agressor.PA_Endereco_Juridica
                                        }
                                        on:input={autosave}
                                    />
                                </label>
                            </div>
                        {/if}
                    </div>

                    <!-- Container2_46: Identificação -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3">
                            Identificação
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="block md:col-span-3">
                                <span class="text-gray-700 text-sm"
                                    >Nome Civil</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Nome_Civil}
                                    on:input={autosave}
                                />
                            </label>
                            <label class="block md:col-span-2">
                                <span class="text-gray-700 text-sm"
                                    >Nome Social ou Ancestral</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        agressor.PA_Nome_Social_Ancestral
                                    }
                                    on:input={autosave}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Apelido</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Apelido}
                                    on:input={autosave}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Data de Nascimento</span
                                >
                                <input
                                    type="date"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Data_Nascimento}
                                    on:change={() => handleDateChange(agressor)}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm">Idade</span>
                                <input
                                    type="number"
                                    readonly
                                    class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                    bind:value={agressor.PA_Idade}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Nacionalidade</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Nacionalidade}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each nacionalidadeOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Naturalidade</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Naturalidade}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each naturalidadeOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Filiação - Mãe</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Filiacao_Mae}
                                    on:input={autosave}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Filiação - Pai</span
                                >
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Filiacao_Pai}
                                    on:input={autosave}
                                />
                            </label>
                        </div>
                    </div>

                    <!-- Container2_58: Documentação Civil -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3">
                            Documentação Civil
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="block">
                                <span class="text-gray-700 text-sm">CPF</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Doc_CPF}
                                    on:input={autosave}
                                />
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm">RG</span>
                                <input
                                    type="text"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_Doc_RG}
                                    on:input={autosave}
                                />
                            </label>
                            <div class="block">
                                <span class="text-gray-700 text-sm block mb-1"
                                    >Situação Documental</span
                                >
                                <div class="flex space-x-4">
                                    {#each docSituacaoOptions as option}
                                        <label class="inline-flex items-center">
                                            <input
                                                type="radio"
                                                class="form-radio text-save-primary"
                                                bind:group={
                                                    agressor.PA_Doc_Situacao
                                                }
                                                value={option}
                                                on:change={autosave}
                                            />
                                            <span class="ml-2 text-sm"
                                                >{option}</span
                                            >
                                        </label>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Container2_60: Perfil Pessoal e Social -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-800 mb-3">
                            Perfil Pessoal e Social
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="block">
                                <span class="text-gray-700 text-sm">Sexo</span>
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_PPS_Sexo}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each sexoOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Identidade de Gênero</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        agressor.PA_PPS_Identidade_Genero
                                    }
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each identidadeGeneroOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Identidade Sexual</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={
                                        agressor.PA_PPS_Identidade_Sexual
                                    }
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each identidadeSexualOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Raça/Cor/Etnia</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_PPS_Raca_Cor_Etnia}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each racaOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Religião</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_PPS_Religiao}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each religiaoOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                            <label class="block">
                                <span class="text-gray-700 text-sm"
                                    >Estado Civil</span
                                >
                                <select
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                    bind:value={agressor.PA_PPS_Estado_Civil}
                                    on:change={autosave}
                                >
                                    <option value="">Selecione...</option>
                                    {#each estadoCivilOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </label>
                        </div>
                    </div>

                    <!-- Container2_59: Endereço(s) -->
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="text-md font-medium text-gray-800">
                                Endereço(s)
                            </h4>
                            <button
                                class="text-save-primary hover:underline text-sm font-medium"
                                on:click={() => addEndereco(i)}
                            >
                                + Incluir Endereço
                            </button>
                        </div>

                        {#if agressor.enderecos && agressor.enderecos.length > 0}
                            <div class="space-y-4">
                                {#each agressor.enderecos as endereco, j}
                                    <div
                                        class="bg-gray-50 p-4 rounded border border-gray-200 relative"
                                    >
                                        <button
                                            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            on:click={() =>
                                                removeEndereco(i, j)}
                                        >
                                            <span class="material-icons text-sm"
                                                >close</span
                                            >
                                        </button>
                                        <div
                                            class="grid grid-cols-1 md:grid-cols-4 gap-3"
                                        >
                                            <label class="block md:col-span-3">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >Endereço</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_Endereco
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >Número</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_Numero
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block md:col-span-2">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >Complemento</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_Complemento
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block md:col-span-2">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >Bairro</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_Bairro
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >Cidade</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_Cidade
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >UF</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={endereco.PAE_UF}
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <label class="block">
                                                <span
                                                    class="text-gray-600 text-xs"
                                                    >CEP</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                                    bind:value={
                                                        endereco.PAE_CEP
                                                    }
                                                    on:input={autosave}
                                                />
                                            </label>
                                            <div class="block md:col-span-4">
                                                <span
                                                    class="text-gray-600 text-xs block mb-1"
                                                    >Situação de Moradia</span
                                                >
                                                <div
                                                    class="flex flex-wrap gap-3"
                                                >
                                                    {#each situacaoMoradiaOptions as option}
                                                        <label
                                                            class="inline-flex items-center"
                                                        >
                                                            <input
                                                                type="radio"
                                                                class="form-radio text-save-primary h-3 w-3"
                                                                bind:group={
                                                                    endereco.PAE_Situacao_Moradia
                                                                }
                                                                value={option}
                                                                on:change={autosave}
                                                            />
                                                            <span
                                                                class="ml-1 text-xs"
                                                                >{option}</span
                                                            >
                                                        </label>
                                                    {/each}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-gray-500 text-sm italic">
                                Nenhum endereço cadastrado.
                            </p>
                        {/if}
                    </div>
                </div>
            {/each}

            <button
                class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-save-primary hover:text-save-primary transition-colors flex justify-center items-center font-medium"
                on:click={addAgressor}
            >
                <span class="material-icons mr-2">add_circle_outline</span>
                Adicionar Novo Agressor
            </button>

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
