<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        Nome_RC: "",
        Nome_social_ancestral: "",
        Como_querser_chamada: "",
        Data_nascimento: "",
        Idade: "",
        Filiacao_1: "",
        Filiacao_2: "",
        Naturalidade: "",
        Nacionalidade: "",
        DC_situacao: "",
        DC_CPF: "",
        DC_RG: "",
        DC_CTPS: "",
        CC_Nome: "",
        CC_telefoneDDD: "",
        CC_vinculo: "",
        PPS_Sexo: "",
        PPS_idgenero: "",
        PPS_orientacao_sexual: "",
        PPS_Raca_cor_etnia: "",
        PPS_religiao: "",
        PPS_estado_civil: "",
        enderecos: [],
        telefones: [],
        emails: [],
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";
    let saveStatus = "";

    const nacionalidades = [
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

    const naturalidades = [
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

    // Reset data when caseId changes
    $: if (caseId) {
        data = {
            Nome_RC: "",
            Nome_social_ancestral: "",
            Como_querser_chamada: "",
            Data_nascimento: "",
            Idade: "",
            Filiacao_1: "",
            Filiacao_2: "",
            Naturalidade: "",
            Nacionalidade: "",
            DC_situacao: "",
            DC_CPF: "",
            DC_RG: "",
            DC_CTPS: "",
            CC_Nome: "",
            CC_telefoneDDD: "",
            CC_vinculo: "",
            PPS_Sexo: "",
            PPS_idgenero: "",
            PPS_orientacao_sexual: "",
            PPS_Raca_cor_etnia: "",
            PPS_religiao: "",
            PPS_estado_civil: "",
            enderecos: [],
            telefones: [],
            emails: [],
        };
        loading = true;
        loadData();
    }

    async function loadData() {
        try {
            const response = await api.get(`/cases/${caseId}`);
            const rootData = response.data || {};
            const identificacaoData = rootData.identificacao || {};
            const telefonesData = rootData.telefones || [];
            const emailsData = rootData.emails || [];
            const enderecosData = rootData.enderecos || [];

            // Map backend data to frontend structure
            data = {
                ...data,
                ...identificacaoData,
                Data_nascimento: identificacaoData.Data_nascimento
                    ? identificacaoData.Data_nascimento.split("T")[0]
                    : "",
                telefones: telefonesData,
                emails: emailsData,
                enderecos: enderecosData,
            };
        } catch (err: any) {
            console.error("Error loading identificacao:", err);
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    }

    onMount(() => {
        loadData();
    });

    function autosave() {
        if (loading || saving) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        // saving = true;

        saveTimeout = setTimeout(async () => {
            if (saving) return;
            saving = true;
            try {
                await api.put(`/cases/${caseId}/identificacao`, data);
                // console.log("Autosaving Identificacao...", data);
                // await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    async function manualSave() {
        if (saving) return;
        saving = true;
        saveStatus = "Salvando...";

        try {
            await api.put(`/cases/${caseId}/identificacao`, data);
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

    $: if (data) autosave();

    // Calculate Age
    $: if (data.Data_nascimento) {
        const parts = data.Data_nascimento.split("-");
        if (parts.length === 3) {
            const birthDate = new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
            );
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age > 110) {
                data.Idade = "";
            } else {
                data.Idade = age.toString();
            }
        }
    }

    function addEndereco() {
        data.enderecos = [
            ...data.enderecos,
            {
                Endereco: "",
                Numero: "",
                Complemento: "",
                Bairro: "",
                Cidade: "",
                UF: "",
                CEP: "",
                Moradia_Situacao: "",
            },
        ];
        autosave();
    }

    function removeEndereco(index: number) {
        data.enderecos = data.enderecos.filter(
            (_: any, i: number) => i !== index,
        );
        autosave();
    }

    function addTelefone() {
        data.telefones = [
            ...data.telefones,
            { TelefoneDDD: "", Atualizado: new Date().toISOString() },
        ];
        autosave();
    }

    function removeTelefone(index: number) {
        data.telefones = data.telefones.filter(
            (_: any, i: number) => i !== index,
        );
        autosave();
    }

    function addEmail() {
        data.emails = [
            ...data.emails,
            { Email: "", Atualizado: new Date().toISOString() },
        ];
        autosave();
    }

    function removeEmail(index: number) {
        data.emails = data.emails.filter((_: any, i: number) => i !== index);
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

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Dados Pessoais -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Dados Pessoais
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Nome (Registro Civil)</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_RC}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Nome Social ou Ancestral</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_social_ancestral}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Como quer ser chamada</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Como_querser_chamada}
                        />
                    </label>
                    <div class="grid grid-cols-2 gap-4">
                        <label class="block">
                            <span class="text-gray-700">Data de nascimento</span
                            >
                            <input
                                type="date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.Data_nascimento}
                            />
                        </label>
                        <label class="block">
                            <span class="text-gray-700">Idade</span>
                            <input
                                type="text"
                                readonly
                                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                                bind:value={data.Idade}
                            />
                        </label>
                    </div>
                    <label class="block">
                        <span class="text-gray-700">Filiação 1</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Filiacao_1}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Filiação 2</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Filiacao_2}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Naturalidade</span>
                        <div class="relative">
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 pr-8"
                                bind:value={data.Naturalidade}
                            >
                                <option value="">Selecione...</option>
                                {#each naturalidades as item}
                                    <option value={item}>{item}</option>
                                {/each}
                            </select>
                            {#if data.Naturalidade}
                                <button
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    on:click={() => (data.Naturalidade = "")}
                                    title="Limpar"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            {/if}
                        </div>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Nacionalidade</span>
                        <div class="relative">
                            <select
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 pr-8"
                                bind:value={data.Nacionalidade}
                            >
                                <option value="">Selecione...</option>
                                {#each nacionalidades as item}
                                    <option value={item}>{item}</option>
                                {/each}
                            </select>
                            {#if data.Nacionalidade}
                                <button
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    on:click={() => (data.Nacionalidade = "")}
                                    title="Limpar"
                                >
                                    <span class="material-icons text-sm"
                                        >close</span
                                    >
                                </button>
                            {/if}
                        </div>
                    </label>
                </div>
            </div>

            <!-- Documentação Civil -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Documentação civil
                </h3>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Situação -->
                    <div class="lg:col-span-4">
                        <span class="block text-gray-700 mb-2">Situação:</span>
                        <div class="flex flex-col gap-2">
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    class="form-radio text-save-primary"
                                    name="dc_situacao"
                                    value="Possui"
                                    bind:group={data.DC_situacao}
                                />
                                <span class="ml-2">Possui</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    class="form-radio text-save-primary"
                                    name="dc_situacao"
                                    value="Nunca teve"
                                    bind:group={data.DC_situacao}
                                />
                                <span class="ml-2">Nunca teve</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    type="radio"
                                    class="form-radio text-save-primary"
                                    name="dc_situacao"
                                    value="Perda/Roubo/Danificado/Extravio"
                                    bind:group={data.DC_situacao}
                                />
                                <span class="ml-2"
                                    >Perda/Roubo/Danificado/Extravio</span
                                >
                            </label>
                        </div>
                    </div>

                    <!-- CPF -->
                    <div class="lg:col-span-2">
                        <label class="block">
                            <span class="text-gray-700">CPF:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.DC_CPF}
                            />
                        </label>
                    </div>

                    <!-- RG -->
                    <div class="lg:col-span-3">
                        <label class="block">
                            <span class="text-gray-700">RG:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.DC_RG}
                            />
                        </label>
                    </div>

                    <!-- CTPS -->
                    <div class="lg:col-span-3">
                        <label class="block">
                            <span class="text-gray-700">CTPS:</span>
                            <input
                                type="text"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={data.DC_CTPS}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <!-- Endereço(s) -->
            <div class="border-b pb-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Endereço(s)
                    </h3>
                    <button
                        class="bg-save-primary text-white px-4 py-2 rounded text-sm hover:bg-save-secondary transition-colors"
                        on:click={addEndereco}
                    >
                        Incluir endereço
                    </button>
                </div>

                <div class="space-y-4">
                    {#each data.enderecos as endereco, i}
                        <div class="border rounded-lg p-4 bg-gray-50 relative">
                            <button
                                class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                on:click={() => removeEndereco(i)}
                                title="Remover endereço"
                            >
                                <span class="material-icons">delete</span>
                            </button>

                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <!-- Situação Moradia -->
                                <div class="lg:col-span-4">
                                    <span
                                        class="block text-gray-700 mb-2 text-sm font-semibold"
                                        >Situação:</span
                                    >
                                    <div class="flex flex-col gap-2">
                                        {#each ["Casa própria", "Aluguel", "Em situação de rua", "Outro"] as option}
                                            <label
                                                class="inline-flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    class="form-radio text-save-primary h-4 w-4"
                                                    name={`moradia_situacao_${i}`}
                                                    value={option}
                                                    bind:group={
                                                        endereco.Moradia_Situacao
                                                    }
                                                    on:change={autosave}
                                                />
                                                <span class="ml-2 text-sm"
                                                    >{option}</span
                                                >
                                            </label>
                                        {/each}
                                    </div>
                                </div>

                                <div class="lg:col-span-8 space-y-4">
                                    <div class="grid grid-cols-12 gap-4">
                                        <!-- Endereço -->
                                        <div class="col-span-8">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >Endereço:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={
                                                        endereco.Endereco
                                                    }
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                        <!-- Número -->
                                        <div class="col-span-4">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >Nº:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={endereco.Numero}
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4">
                                        <!-- Complemento -->
                                        <div class="col-span-6">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >Complemento:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={
                                                        endereco.Complemento
                                                    }
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                        <!-- Bairro -->
                                        <div class="col-span-6">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >Bairro:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={endereco.Bairro}
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-12 gap-4">
                                        <!-- Cidade -->
                                        <div class="col-span-5">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >Cidade:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={endereco.Cidade}
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                        <!-- UF -->
                                        <div class="col-span-3">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >UF:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={endereco.UF}
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                        <!-- CEP -->
                                        <div class="col-span-4">
                                            <label class="block">
                                                <span
                                                    class="text-gray-700 text-sm font-semibold"
                                                    >CEP:</span
                                                >
                                                <input
                                                    type="text"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                                    bind:value={endereco.CEP}
                                                    on:blur={autosave}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {#if endereco.Atualizado}
                                <div
                                    class="text-xs text-gray-500 mt-2 text-right"
                                >
                                    Informado em {new Date(
                                        endereco.Atualizado,
                                    ).toLocaleDateString()}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Telefones e E-mails -->
            <div class="border-b pb-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Telefones -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-700">
                                Telefones de contato
                            </h3>
                            <button
                                class="bg-save-primary text-white px-4 py-2 rounded text-sm hover:bg-save-secondary transition-colors"
                                on:click={addTelefone}
                            >
                                Incluir telefone
                            </button>
                        </div>

                        <div class="space-y-4">
                            {#if data.telefones.length > 0}
                                <div
                                    class="flex text-sm font-semibold text-gray-700 px-2"
                                >
                                    <div class="w-1/2 text-center">
                                        Atualizado em
                                    </div>
                                    <div class="w-1/2 text-center">
                                        Telefone com DDD
                                    </div>
                                    <div class="w-8"></div>
                                </div>
                            {/if}
                            {#each data.telefones as telefone, i}
                                <div class="flex items-center gap-2">
                                    <div class="w-1/2">
                                        <input
                                            type="text"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm bg-gray-100"
                                            value={telefone.Atualizado
                                                ? new Date(
                                                      telefone.Atualizado,
                                                  ).toLocaleDateString()
                                                : ""}
                                            disabled
                                        />
                                    </div>
                                    <div class="w-1/2">
                                        <input
                                            type="text"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                            placeholder="(00) 0000-0000"
                                            bind:value={telefone.TelefoneDDD}
                                            on:blur={autosave}
                                        />
                                    </div>
                                    <button
                                        class="text-red-500 hover:text-red-700"
                                        on:click={() => removeTelefone(i)}
                                        title="Remover telefone"
                                    >
                                        <span class="material-icons">close</span
                                        >
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- E-mails -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-700">
                                E-mails
                            </h3>
                            <button
                                class="bg-save-primary text-white px-4 py-2 rounded text-sm hover:bg-save-secondary transition-colors"
                                on:click={addEmail}
                            >
                                Incluir e-mail
                            </button>
                        </div>

                        <div class="space-y-4">
                            {#if data.emails.length > 0}
                                <div
                                    class="flex text-sm font-semibold text-gray-700 px-2"
                                >
                                    <div class="w-1/3 text-center">
                                        Atualizado em
                                    </div>
                                    <div class="w-2/3 text-center">E-mail</div>
                                    <div class="w-8"></div>
                                </div>
                            {/if}
                            {#each data.emails as email, i}
                                <div class="flex items-center gap-2">
                                    <div class="w-1/3">
                                        <input
                                            type="text"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm bg-gray-100"
                                            value={email.Atualizado
                                                ? new Date(
                                                      email.Atualizado,
                                                  ).toLocaleDateString()
                                                : ""}
                                            disabled
                                        />
                                    </div>
                                    <div class="w-2/3">
                                        <input
                                            type="text"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30 text-sm"
                                            placeholder="exemplo@gmail.com"
                                            bind:value={email.Email}
                                            on:blur={autosave}
                                        />
                                    </div>
                                    <button
                                        class="text-red-500 hover:text-red-700"
                                        on:click={() => removeEmail(i)}
                                        title="Remover e-mail"
                                    >
                                        <span class="material-icons">close</span
                                        >
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pessoa de Confiança -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Pessoa de Confiança
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Nome</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.CC_Nome}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Telefone com DDD</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.CC_telefoneDDD}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Vínculo</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.CC_vinculo}
                        />
                    </label>
                </div>
            </div>

            <!-- Perfil Psicossocial -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Perfil Psicossocial
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Sexo Biológico</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_Sexo}
                        >
                            <option value="">Selecione...</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Intersexo">Intersexo</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Identidade de Gênero</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_idgenero}
                        >
                            <option value="">Selecione...</option>
                            <option value="Mulher Cis">Mulher Cis</option>
                            <option value="Mulher Trans">Mulher Trans</option>
                            <option value="Homem Cis">Homem Cis</option>
                            <option value="Homem Trans">Homem Trans</option>
                            <option value="Não-Binário">Não-Binário</option>
                            <option value="Travesti">Travesti</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Orientação Sexual</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_orientacao_sexual}
                        >
                            <option value="">Selecione...</option>
                            <option value="Heterossexual">Heterossexual</option>
                            <option value="Homossexual (Lésbica/Gay)"
                                >Homossexual (Lésbica/Gay)</option
                            >
                            <option value="Bissexual">Bissexual</option>
                            <option value="Pansexual">Pansexual</option>
                            <option value="Assexual">Assexual</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Raça / Cor</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_Raca_cor_etnia}
                        >
                            <option value="">Selecione...</option>
                            <option value="Branca">Branca</option>
                            <option value="Preta">Preta</option>
                            <option value="Parda">Parda</option>
                            <option value="Amarela">Amarela</option>
                            <option value="Indígena">Indígena</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Religião / Credo</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_religiao}
                        >
                            <option value="">Selecione...</option>
                            <option value="Católica">Católica</option>
                            <option value="Evangélica">Evangélica</option>
                            <option value="Espírita">Espírita</option>
                            <option value="Matriz Africana"
                                >Matriz Africana</option
                            >
                            <option value="Sem Religião">Sem Religião</option>
                            <option value="Outras">Outras</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Estado Civil</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            bind:value={data.PPS_estado_civil}
                        >
                            <option value="">Selecione...</option>
                            <option value="Solteira(o)">Solteira(o)</option>
                            <option value="Casada(o)">Casada(o)</option>
                            <option value="Divorciada(o)">Divorciada(o)</option>
                            <option value="Viúva(o)">Viúva(o)</option>
                            <option value="União Estável">União Estável</option>
                        </select>
                    </label>
                </div>
            </div>
            <!-- Manual Save Button -->
            <div class="md:col-span-2 flex justify-end mt-4">
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
