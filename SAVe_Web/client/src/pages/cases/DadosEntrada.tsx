import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
// import { formStepsComplete } from '../../config/formSteps'; // removed - not needed
import api from '../../services/api';

export default function DadosEntrada() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formCompleto, setFormCompleto] = useState(true); // TODO: Get from global state
    const [casosRelacionados, setCasosRelacionados] = useState<Array<{ id: number | null, id_vitima: string }>>([]);
    const [crimesTotais, setCrimesTotais] = useState('');

    const [formData, setFormData] = useState({
        Data: '',
        Comarca_origem: '',
        N_procedimento_MPE: '',
        Quem_encaminha: '',
        PE_nome: '',
        PE_telefone: '',
        PE_email: '',
        PE_cargo: '',
        Precisa_Atendimento_Esp: '',
        Atendimento_Especial: '',
        Possui_Relacionado: '',
        Classificacao_crime: '',
        Classificacao_vitima: '',
        Vitimizacao: '',
        Vit_Terciaria_Origem: '',
        Crime_relacionado: '',
        Crime_relacionado_especifico: '',
        Observacao: ''
    });

    useEffect(() => {
        if (id) {
            fetchCaseData();
        }
    }, [id]);

    const fetchCaseData = async () => {
        try {
            const response = await api.get(`/cases/${id}`);
            if (response.data.dadosEntrada) {
                const data = response.data.dadosEntrada;
                // Convert Data from ISO to yyyy-MM-dd format
                if (data.Data) {
                    data.Data = data.Data.split('T')[0];
                }
                setFormData(prev => ({ ...prev, ...data }));
                setCrimesTotais(data.Crime_relacionado || '');
            }
            // Load casos relacionados from JSON
            if (response.data.casosVinculados) {
                try {
                    const casos = JSON.parse(response.data.casosVinculados.Casos_Relacionados || '[]');
                    setCasosRelacionados(casos);
                } catch {
                    setCasosRelacionados([]);
                }
            }
        } catch (error) {
            console.error('Error fetching case data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (field: string, value: any) => {
        try {
            await api.put(`/cases/${id}/dados-entrada`, { [field]: value });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleCheckboxChange = (crimeNome: string, checked: boolean) => {
        let newCrimes = crimesTotais;

        if (checked) {
            // Add crime
            if (!newCrimes.includes(crimeNome)) {
                newCrimes = newCrimes ? `${newCrimes}; ${crimeNome}` : crimeNome;
            }
        } else {
            // Remove crime
            newCrimes = newCrimes
                .replace(`${crimeNome};;`, ';')
                .replace(`; ${crimeNome}`, '')
                .replace(`${crimeNome};`, '')
                .replace(crimeNome, '')
                .replace(';;', ';')
                .trim();
        }

        setCrimesTotais(newCrimes);
        handleSave('Crime_relacionado', newCrimes);
    };

    const crimesOptions = [
        'Crimes contra a vida',
        'Crimes contra a dignidade sexual',
        'Crimes de ódio',
        'Outros crimes'
    ];

    const comarcas = ["ABAETE", "ABRE CAMPO", "ACUCENA", "AGUA BOA", "AGUAS FORMOSAS", "AIMORES", "AIURUOCA", "ALEM PARAIBA", "ALFENAS", "ALMENARA", "ALPINOPOLIS", "ALTO RIO DOCE", "ALVINOPOLIS", "ANDRADAS", "ANDRELANDIA", "ARACUAI", "ARAGUARI", "ARAXA", "ARCOS", "AREADO", "ARINOS", "BAEPENDI", "BAMBUI", "BARAO DE COCAIS", "BARBACENA", "BARROSO", "BELO HORIZONTE", "BELO ORIENTE", "BELO VALE", "BETIM", "BICAS", "BOA ESPERANCA", "BOCAIUVA", "BOM DESPACHO", "BOM JESUS DO GALHO", "BOM SUCESSO", "BONFIM", "BONFINOPOLIS DE MINAS", "BORDA DA MATA", "BOTELHOS", "BRASILIA DE MINAS", "BRAZÓPOLIS", "BRUMADINHO", "BUENO BRANDAO", "BUENOPOLIS", "BURITIS", "CABO VERDE", "CACHOEIRA DE MINAS", "CAETE", "CALDAS", "CAMANDUCAIA", "CAMBUÍ", "CAMBUQUIRA", "CAMPANHA", "CAMPESTRE", "CAMPINA VERDE", "CAMPO BELO", "CAMPOS ALTOS", "CAMPOS GERAIS", "CANAPOLIS", "CANDEIAS", "CAPELINHA", "CAPINOPOLIS", "CARANDAI", "CARANGOLA", "CARATINGA", "CARLOS CHAGAS", "CARMO DA MATA", "CARMO DE MINAS", "CARMO DO CAJURU", "CARMO DO PARANAIBA", "CARMO DO RIO CLARO", "CARMOPOLIS DE MINAS", "CARNEIRINHO", "CASSIA", "CATAGUASES", "CAXAMBU", "CLAUDIO", "CONCEICAO DAS ALAGOAS", "CONCEICAO DO MATO DENTRO", "CONCEICAO DO RIO VERDE", "CONGONHAS", "CONQUISTA", "CONSELHEIRO LAFAIETE", "CONSELHEIRO PENA", "CONTAGEM", "CORACAO DE JESUS", "CORINTO", "COROACI", "COROMANDEL", "CORONEL FABRICIANO", "CRISTINA", "CRUZILIA", "CURVELO", "DIAMANTINA", "DIVINO", "DIVINOPOLIS", "DORES DO INDAIA", "ELOI MENDES", "ENTRE RIOS DE MINAS", "ERVALIA", "ESMERALDAS", "ESPERA FELIZ", "ESPINOSA", "ESTRELA DO SUL", "EUGENOPOLIS", "EXTREMA", "FERROS", "FORMIGA", "FRANCISCO SA", "FRONTEIRA", "FRUTAL", "GALILEIA", "GOVERNADOR VALADARES", "GRAO MOGOL", "GUANHAES", "GUAPE", "GUARANESIA", "GUARANI", "GUAXUPE", "IBIA", "IBIRACI", "IBIRITE", "IGARAPE", "IGUATAMA", "INHAPIM", "IPANEMA", "IPATINGA", "ITABIRA", "ITABIRINHA", "ITABIRITO", "ITAGUARA", "ITAJUBA", "ITAMARANDIBA", "ITAMBACURI", "ITAMOGI", "ITAMONTE", "ITANHANDU", "ITANHOMI", "ITAOBIM", "ITAPAGIPE", "ITAPECERICA", "ITAUNA", "ITUIUTABA", "ITUMIRIM", "ITURAMA", "JABOTICATUBAS", "JACINTO", "JACUI", "JACUTINGA", "JAIBA", "JANAUBA", "JANUARIA", "JEQUERI", "JEQUITINHONHA", "JOAIMA", "JOAO MONLEVADE", "JOAO PINHEIRO", "JUATUBA", "JUIZ DE FORA", "LAGOA DA PRATA", "LAGOA DOURADA", "LAGOA SANTA", "LAJINHA", "LAMBARI", "LAVRAS", "LEOPOLDINA", "LIMA DUARTE", "LUZ", "MACHADO", "MALACACHETA", "MANGA", "MANHUACU", "MANHUMIRIM", "MANTENA", "MAR DE ESPANHA", "MARIANA", "MARTINHO CAMPOS", "MATEUS LEME", "MATIAS BARBOSA", "MATO VERDE", "MATOZINHOS", "MEDINA", "MERCES", "MESQUITA", "MINAS NOVAS", "MIRABELA", "MIRADOURO", "MIRAI", "MONTALVANIA", "MONTE ALEGRE DE MINAS", "MONTE AZUL", "MONTE BELO", "MONTE CARMELO", "MONTE SANTO DE MINAS", "MONTE SIAO", "MONTES CLAROS", "MORADA NOVA DE MINAS", "MURIAE", "MUTUM", "MUZAMBINHO", "NANUQUE", "NATERCIA", "NEPOMUCENO", "NOVA ERA", "NOVA LIMA", "NOVA PONTE", "NOVA RESENDE", "NOVA SERRANA", "NOVO CRUZEIRO", "OLIVEIRA", "OURO BRANCO", "OURO FINO", "OURO PRETO", "PADRE PARAISO", "PAINS", "PALMA", "PAPAGAIOS", "PARA DE MINAS", "PARACATU", "PARAGUACU", "PARAISOPOLIS", "PARAOPEBA", "PASSA QUATRO", "PASSA TEMPO", "PASSOS", "PATOS DE MINAS", "PATROCINIO", "PECANHA", "PEDRA AZUL", "PEDRALVA", "PEDRO LEOPOLDO", "PERDIZES", "PERDOES", "PIRANGA", "PIRAPETINGA", "PIRAPORA", "PITANGUI", "PIUMHI", "POCO FUNDO", "POCOS DE CALDAS", "POMPEU", "PONTE NOVA", "PORTEIRINHA", "POUSO ALEGRE", "PRADOS", "PRATA", "PRATAPOLIS", "PRESIDENTE OLEGARIO", "RAUL SOARES", "RESENDE COSTA", "RESPLENDOR", "RIBEIRAO DAS NEVES", "RIO CASCA", "RIO NOVO", "RIO PARANAIBA", "RIO PARDO DE MINAS", "RIO PIRACICABA", "RIO POMBA", "RIO PRETO", "RIO VERMELHO", "RUBIM", "SABARA", "SABINOPOLIS", "SACRAMENTO", "SALINAS", "SANTA BARBARA", "SANTA LUZIA", "SANTA MARIA DE ITABIRA", "SANTA MARIA DO SUACUI", "SANTA RITA DE CALDAS", "SANTA RITA DO SAPUCAI", "SANTA VITORIA", "SANTO ANTONIO DO AMPARO", "SANTO ANTONIO DO MONTE", "SANTOS DUMONT", "SAO DOMINGOS DO PRATA", "SAO FRANCISCO", "SAO GONCALO DO ABAETE", "SAO GONCALO DO PARA", "SAO GONCALO DO SAPUCAI", "SAO GOTARDO", "SAO JOAO DA PONTE", "SAO JOAO DEL REI", "SAO JOAO DO PARAISO", "SAO JOAO EVANGELISTA", "SAO JOAO NEPOMUCENO", "SAO LOURENCO", "SAO ROMAO", "SAO ROQUE DE MINAS", "SAO SEBASTIAO DO PARAISO", "SAO TOMAS DE AQUINO", "SENADOR FIRMINO", "SERRO", "SETE LAGOAS", "SILVIANOPOLIS", "TAIOBEIRAS", "TARUMIRIM", "TEIXEIRAS", "TEOFILO OTONI", "TIMOTEO", "TIROS", "TOCANTINS", "TOMBOS", "TRES CORACOES", "TRES MARIAS", "TRES PONTAS", "TUPACIGUARA", "TURMALINA", "UBA", "UBERABA", "UBERLANDIA", "UNAI", "VARGINHA", "VARZEA DA PALMA", "VAZANTE", "VESPASIANO", "VICOSA", "VIRGINOPOLIS", "VISCONDE DO RIO BRANCO"];

    return (
        <MainLayout>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <FormNavigation caseId={id} />

                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Seção 1: Informações Básicas */}
                        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Data:</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Data}
                                        onChange={(e) => {
                                            setFormData({ ...formData, Data: e.target.value });
                                            handleSave('Data', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Comarca de origem:</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Comarca_origem}
                                        onChange={(e) => {
                                            setFormData({ ...formData, Comarca_origem: e.target.value });
                                            handleSave('Comarca_origem', e.target.value);
                                        }}
                                    >
                                        <option value="">Selecione...</option>
                                        {comarcas.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Nº do Procedimento / Sistema MPE:</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.N_procedimento_MPE}
                                        onBlur={(e) => handleSave('N_procedimento_MPE', e.target.value)}
                                        onChange={(e) => setFormData({ ...formData, N_procedimento_MPE: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Precisa de atendimento especial?</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="precisa_atendimento"
                                                value="Não"
                                                checked={formData.Precisa_Atendimento_Esp === 'Não'}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, Precisa_Atendimento_Esp: e.target.value });
                                                    handleSave('Precisa_Atendimento_Esp', e.target.value);
                                                }}
                                                className="mr-2"
                                            />
                                            Não
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="precisa_atendimento"
                                                value="Sim"
                                                checked={formData.Precisa_Atendimento_Esp === 'Sim'}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, Precisa_Atendimento_Esp: e.target.value });
                                                    handleSave('Precisa_Atendimento_Esp', e.target.value);
                                                }}
                                                className="mr-2"
                                            />
                                            Sim
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.Precisa_Atendimento_Esp === 'Sim' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Qual tipo de atendimento?</label>
                                    <input
                                        type="text"
                                        placeholder="Descreva o tipo de atendimento especial"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Atendimento_Especial}
                                        onBlur={(e) => handleSave('Atendimento_Especial', e.target.value)}
                                        onChange={(e) => setFormData({ ...formData, Atendimento_Especial: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Seção 2: Quem Encaminha (Visível apenas em Formulário Completo) */}
                        {formCompleto && (
                            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                                <h3 className="text-sm font-semibold mb-4 text-gray-700">Quem encaminha:</h3>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                                    value={formData.Quem_encaminha}
                                    onChange={(e) => {
                                        setFormData({ ...formData, Quem_encaminha: e.target.value });
                                        handleSave('Quem_encaminha', e.target.value);
                                    }}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="MPMG">MPMG</option>
                                    <option value="Ministério Público (outros)">Ministério Público (outros)</option>
                                    <option value="Poder Judiciário">Poder Judiciário</option>
                                    <option value="DPMG">DPMG</option>
                                    <option value="Polícia Civil">Polícia Civil</option>
                                    <option value="Polícia Militar">Polícia Militar</option>
                                    <option value="Poder legislativo">Poder legislativo</option>
                                    <option value="Sociedade Civil">Sociedade Civil</option>
                                    <option value="Serviço Público">Serviço Público</option>
                                    <option value="Demanda espontânea">Demanda espontânea</option>
                                </select>

                                <h4 className="text-sm font-semibold mb-3 text-gray-700">Contatos da porta de entrada</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Nome:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                            value={formData.PE_nome}
                                            onBlur={(e) => handleSave('PE_nome', e.target.value)}
                                            onChange={(e) => setFormData({ ...formData, PE_nome: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Telefone:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                            value={formData.PE_telefone}
                                            onBlur={(e) => handleSave('PE_telefone', e.target.value)}
                                            onChange={(e) => setFormData({ ...formData, PE_telefone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">E-mail:</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                            value={formData.PE_email}
                                            onBlur={(e) => handleSave('PE_email', e.target.value)}
                                            onChange={(e) => setFormData({ ...formData, PE_email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700">Cargo/função:</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded"
                                            value={formData.PE_cargo}
                                            onBlur={(e) => handleSave('PE_cargo', e.target.value)}
                                            onChange={(e) => setFormData({ ...formData, PE_cargo: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Seção 3: Casos Relacionados */}
                        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-semibold text-gray-700">Possui caso(s) relacionado?</label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="possui_relacionado"
                                            value="Não"
                                            checked={formData.Possui_Relacionado === 'Não'}
                                            onChange={(e) => {
                                                setFormData({ ...formData, Possui_Relacionado: e.target.value });
                                                handleSave('Possui_Relacionado', e.target.value);
                                            }}
                                            className="mr-2"
                                        />
                                        Não
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="possui_relacionado"
                                            value="Sim"
                                            checked={formData.Possui_Relacionado === 'Sim'}
                                            onChange={(e) => {
                                                setFormData({ ...formData, Possui_Relacionado: e.target.value });
                                                handleSave('Possui_Relacionado', e.target.value);
                                            }}
                                            className="mr-2"
                                        />
                                        Sim
                                    </label>
                                </div>
                            </div>

                            {formData.Possui_Relacionado === 'Sim' && (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Casos vinculados:</label>
                                        <button
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                                            onClick={() => {/* TODO: Open modal to add case */ }}
                                        >
                                            Vincular caso
                                        </button>
                                    </div>
                                    <div className="border border-gray-300 rounded p-2">
                                        {casosRelacionados.length === 0 ? (
                                            <p className="text-sm text-gray-500">Não possui casos relacionados</p>
                                        ) : (
                                            casosRelacionados.map((caso, index) => (
                                                <div key={index} className="flex justify-between items-center py-1">
                                                    <span className="text-sm">{caso.id_vitima}</span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            const newCasos = casosRelacionados.filter((_, i) => i !== index);
                                                            setCasosRelacionados(newCasos);
                                                            // TODO: Save to backend
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Seção 4: Classificação e Observações */}
                        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Classificação da Vítima:</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Classificacao_vitima}
                                        onChange={(e) => {
                                            setFormData({ ...formData, Classificacao_vitima: e.target.value });
                                            handleSave('Classificacao_vitima', e.target.value);
                                        }}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Vítima direta">Vítima direta</option>
                                        <option value="Vítima Indireta (afeto e/ou grau 1,2,3 + convivência e/ou dependência)">Vítima Indireta (afeto e/ou grau 1,2,3 + convivência e/ou dependência)</option>
                                        <option value="Familiar (grau 4 ou dependência)">Familiar (grau 4 ou dependência)</option>
                                        <option value="Vítima Coletiva">Vítima Coletiva</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Vitimização:</label>
                                    <div className="flex gap-2">
                                        <select
                                            className={`px-3 py-2 border border-gray-300 rounded ${formData.Vitimizacao === 'Terciária' ? 'w-1/2' : 'w-full'}`}
                                            value={formData.Vitimizacao}
                                            onChange={(e) => {
                                                setFormData({ ...formData, Vitimizacao: e.target.value });
                                                handleSave('Vitimizacao', e.target.value);
                                            }}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Primária">Primária</option>
                                            <option value="Secundária">Secundária</option>
                                            <option value="Terciária">Terciária</option>
                                        </select>
                                        {formData.Vitimizacao === 'Terciária' && (
                                            <input
                                                type="text"
                                                placeholder="Qual a origem? *"
                                                className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                                                value={formData.Vit_Terciaria_Origem}
                                                onBlur={(e) => handleSave('Vit_Terciaria_Origem', e.target.value)}
                                                onChange={(e) => setFormData({ ...formData, Vit_Terciaria_Origem: e.target.value })}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Crimes ou ato infracional que está relacionado</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {crimesOptions.map(crime => (
                                        <label key={crime} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={crimesTotais.includes(crime)}
                                                onChange={(e) => handleCheckboxChange(crime, e.target.checked)}
                                                className="mr-2"
                                            />
                                            {crime}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Observações:</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded h-32"
                                    value={formData.Observacao}
                                    onBlur={(e) => handleSave('Observacao', e.target.value)}
                                    onChange={(e) => setFormData({ ...formData, Observacao: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Botões de Navegação */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => navigate(`/cases/${id}/identificacao`)}
                                className="px-6 py-2 rounded text-white bg-[#6264A7] hover:bg-[#5558a0]"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
