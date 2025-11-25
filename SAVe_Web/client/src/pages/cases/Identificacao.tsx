import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

interface Telefone {
  ID?: number;
  TelefoneDDD: string;
  Atualizado: string;
}

interface Email {
  ID?: number;
  Email: string;
  Atualizado: string;
}

export default function Identificacao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);

  const [formData, setFormData] = useState({
    Nome_RC: '',
    Nome_social_ancestral: '',
    Como_querser_chamada: '',
    Data_nascimento: '',
    Idade: '',
    Filiacao_1: '',
    Filiacao_2: '',
    Naturalidade: '',
    Nacionalidade: '',
    DC_CPF: '',
    DC_RG: '',
    DC_CTPS: '',
    DC_situacao: '',
    CC_Nome: '',
    CC_telefoneDDD: '',
    CC_vinculo: '',
    PPS_Sexo: '',
    PPS_idgenero: '',
    PPS_orientacao_sexual: '',
    PPS_Raca_cor_etnia: '',
    PPS_religiao: '',
    PPS_estado_civil: ''
  });

  // Campos de endereço (1:N) - galeria
  interface Endereco {
    ID?: number;
    Endereco: string;
    Numero: string;
    Complemento: string;
    Bairro: string;
    Cidade: string;
    UF: string;
    CEP: string;
    Moradia_Situacao: string;
  }

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [endereco, setEndereco] = useState<Endereco>({
    Endereco: '',
    Numero: '',
    Complemento: '',
    Bairro: '',
    Cidade: '',
    UF: '',
    CEP: '',
    Moradia_Situacao: ''
  });


  const comarcasMG = ["ABAETE", "ABRE CAMPO", "ACUCENA", "AGUA BOA", "AGUAS FORMOSAS", "AIMORES", "AIURUOCA", "ALEM PARAIBA", "ALFENAS", "ALMENARA", "ALPINOPOLIS", "ALTO RIO DOCE", "ALVINOPOLIS", "ANDRADAS", "ANDRELANDIA", "ARACUAI", "ARAGUARI", "ARAXA", "ARCOS", "AREADO", "ARINOS", "BAEPENDI", "BAMBUI", "BARAO DE COCAIS", "BARBACENA", "BARROSO", "BELO HORIZONTE", "BELO ORIENTE", "BELO VALE", "BETIM", "BICAS", "BOA ESPERANCA", "BOCAIUVA", "BOM DESPACHO", "BOM JESUS DO GALHO", "BOM SUCESSO", "BONFIM", "BONFINOPOLIS DE MINAS", "BORDA DA MATA", "BOTELHOS", "BRASILIA DE MINAS", "BRAZÓPOLIS", "BRUMADINHO", "BUENO BRANDAO", "BUENOPOLIS", "BURITIS", "CABO VERDE", "CACHOEIRA DE MINAS", "CAETE", "CALDAS", "CAMANDUCAIA", "CAMBUÍ", "CAMBUQUIRA", "CAMPANHA", "CAMPESTRE", "CAMPINA VERDE", "CAMPO BELO", "CAMPOS ALTOS", "CAMPOS GERAIS", "CANAPOLIS", "CANDEIAS", "CAPELINHA", "CAPINOPOLIS", "CARANDAI", "CARANGOLA", "CARATINGA", "CARLOS CHAGAS", "CARMO DA MATA", "CARMO DE MINAS", "CARMO DO CAJURU", "CARMO DO PARANAIBA", "CARMO DO RIO CLARO", "CARMOPOLIS DE MINAS", "CARNEIRINHO", "CASSIA", "CATAGUASES", "CAXAMBU", "CLAUDIO", "CONCEICAO DAS ALAGOAS", "CONCEICAO DO MATO DENTRO", "CONCEICAO DO RIO VERDE", "CONGONHAS", "CONQUISTA", "CONSELHEIRO LAFAIETE", "CONSELHEIRO PENA", "CONTAGEM", "CORACAO DE JESUS", "CORINTO", "COROACI", "COROMANDEL", "CORONEL FABRICIANO", "CRISTINA", "CRUZILIA", "CURVELO", "DIAMANTINA", "DIVINO", "DIVINOPOLIS", "DORES DO INDAIA", "ELOI MENDES", "ENTRE RIOS DE MINAS", "ERVALIA", "ESMERALDAS", "ESPERA FELIZ", "ESPINOSA", "ESTRELA DO SUL", "EUGENOPOLIS", "EXTREMA", "FERROS", "FORMIGA", "FRANCISCO SA", "FRONTEIRA", "FRUTAL", "GALILEIA", "GOVERNADOR VALADARES", "GRAO MOGOL", "GUANHAES", "GUAPE", "GUARANESIA", "GUARANI", "GUAXUPE", "IBIA", "IBIRACI", "IBIRITE", "IGARAPE", "IGUATAMA", "INHAPIM", "IPANEMA", "IPATINGA", "ITABIRA", "ITABIRINHA", "ITABIRITO", "ITAGUARA", "ITAJUBA", "ITAMARANDIBA", "ITAMBACURI", "ITAMOGI", "ITAMONTE", "ITANHANDU", "ITANHOMI", "ITAOBIM", "ITAPAGIPE", "ITAPECERICA", "ITAUNA", "ITUIUTABA", "ITUMIRIM", "ITURAMA", "JABOTICATUBAS", "JACINTO", "JACUI", "JACUTINGA", "JAIBA", "JANAUBA", "JANUARIA", "JEQUERI", "JEQUITINHONHA", "JOAIMA", "JOAO MONLEVADE", "JOAO PINHEIRO", "JUATUBA", "JUIZ DE FORA", "LAGOA DA PRATA", "LAGOA DOURADA", "LAGOA SANTA", "LAJINHA", "LAMBARI", "LAVRAS", "LEOPOLDINA", "LIMA DUARTE", "LUZ", "MACHADO", "MALACACHETA", "MANGA", "MANHUACU", "MANHUMIRIM", "MANTENA", "MAR DE ESPANHA", "MARIANA", "MARTINHO CAMPOS", "MATEUS LEME", "MATIAS BARBOSA", "MATO VERDE", "MATOZINHOS", "MEDINA", "MERCES", "MESQUITA", "MINAS NOVAS", "MIRABELA", "MIRADOURO", "MIRAI", "MONTALVANIA", "MONTE ALEGRE DE MINAS", "MONTE AZUL", "MONTE BELO", "MONTE CARMELO", "MONTE SANTO DE MINAS", "MONTE SIAO", "MONTES CLAROS", "MORADA NOVA DE MINAS", "MURIAE", "MUTUM", "MUZAMBINHO", "NANUQUE", "NATERCIA", "NEPOMUCENO", "NOVA ERA", "NOVA LIMA", "NOVA PONTE", "NOVA RESENDE", "NOVA SERRANA", "NOVO CRUZEIRO", "OLIVEIRA", "OURO BRANCO", "OURO FINO", "OURO PRETO", "PADRE PARAISO", "PAINS", "PALMA", "PAPAGAIOS", "PARA DE MINAS", "PARACATU", "PARAGUACU", "PARAISOPOLIS", "PARAOPEBA", "PASSA QUATRO", "PASSA TEMPO", "PASSOS", "PATOS DE MINAS", "PATROCINIO", "PECANHA", "PEDRA AZUL", "PEDRALVA", "PEDRO LEOPOLDO", "PERDIZES", "PERDOES", "PIRANGA", "PIRAPETINGA", "PIRAPORA", "PITANGUI", "PIUMHI", "POCO FUNDO", "POCOS DE CALDAS", "POMPEU", "PONTE NOVA", "PORTEIRINHA", "POUSO ALEGRE", "PRADOS", "PRATA", "PRATAPOLIS", "PRESIDENTE OLEGARIO", "RAUL SOARES", "RESENDE COSTA", "RESPLENDOR", "RIBEIRAO DAS NEVES", "RIO CASCA", "RIO NOVO", "RIO PARANAIBA", "RIO PARDO DE MINAS", "RIO PIRACICABA", "RIO POMBA", "RIO PRETO", "RIO VERMELHO", "RUBIM", "SABARA", "SABINOPOLIS", "SACRAMENTO", "SALINAS", "SANTA BARBARA", "SANTA LUZIA", "SANTA MARIA DE ITABIRA", "SANTA MARIA DO SUACUI", "SANTA RITA DE CALDAS", "SANTA RITA DO SAPUCAI", "SANTA VITORIA", "SANTO ANTONIO DO AMPARO", "SANTO ANTONIO DO MONTE", "SANTOS DUMONT", "SAO DOMINGOS DO PRATA", "SAO FRANCISCO", "SAO GONCALO DO ABAETE", "SAO GONCALO DO PARA", "SAO GONCALO DO SAPUCAI", "SAO GOTARDO", "SAO JOAO DA PONTE", "SAO JOAO DEL REI", "SAO JOAO DO PARAISO", "SAO JOAO EVANGELISTA", "SAO JOAO NEPOMUCENO", "SAO LOURENCO", "SAO ROMAO", "SAO ROQUE DE MINAS", "SAO SEBASTIAO DO PARAISO", "SAO TOMAS DE AQUINO", "SENADOR FIRMINO", "SERRO", "SETE LAGOAS", "SILVIANOPOLIS", "TAIOBEIRAS", "TARUMIRIM", "TEIXEIRAS", "TEOFILO OTONI", "TIMOTEO", "TIROS", "TOCANTINS", "TOMBOS", "TRES CORACOES", "TRES MARIAS", "TRES PONTAS", "TUPACIGUARA", "TURMALINA", "UBA", "UBERABA", "UBERLANDIA", "UNAI", "VARGINHA", "VARZEA DA PALMA", "VAZANTE", "VESPASIANO", "VICOSA", "VIRGINOPOLIS", "VISCONDE DO RIO BRANCO"];

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.identificacao) {
        const data = response.data.identificacao;
        // Converter Data_nascimento de DateTime para formato YYYY-MM-DD
        if (data.Data_nascimento) {
          const date = new Date(data.Data_nascimento);
          data.Data_nascimento = date.toISOString().split('T')[0];
        }
        setFormData(prev => ({ ...prev, ...data }));

        // Carregar endereços (1:N)
        if (response.data.enderecos) {
          setEnderecos(response.data.enderecos);
        }
      }
      // Load telefones e emails (1:N)
      if (response.data.telefones) setTelefones(response.data.telefones);
      if (response.data.emails) setEmails(response.data.emails);
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/identificacao`, { [field]: value });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeleteEndereco = async (index: number) => {
    const endereco = enderecos[index];
    if (endereco.ID) {
      try {
        await api.delete(`/cases/${id}/enderecos/${endereco.ID}`);
      } catch (error) {
        console.error('Error deleting endereco:', error);
      }
    }
    setEnderecos(enderecos.filter((_, i) => i !== index));
  };

  const handleAddTelefone = async () => {
    const novoTelefone: Telefone = {
      TelefoneDDD: '',
      Atualizado: new Date().toISOString().split('T')[0]
    };
    setTelefones([...telefones, novoTelefone]);

    try {
      const response = await api.post(`/cases/${id}/telefones`, { ID_Caso: id });
      setTelefones(prevTelefones => {
        const updated = [...prevTelefones];
        const index = updated.length - 1;
        updated[index] = { ...updated[index], ID: response.data.ID };
        return updated;
      });
    } catch (error) {
      console.error('Error adding telefone:', error);
    }
  };

  const handleUpdateTelefone = async (index: number, value: string) => {
    const updated = [...telefones];
    updated[index] = { ...updated[index], TelefoneDDD: value, Atualizado: new Date().toISOString().split('T')[0] };
    setTelefones(updated);

    if (updated[index].ID) {
      try {
        await api.put(`/cases/${id}/telefones/${updated[index].ID}`, {
          TelefoneDDD: value,
          Atualizado: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating telefone:', error);
      }
    }
  };

  const handleDeleteTelefone = async (index: number) => {
    const telefone = telefones[index];
    if (telefone.ID) {
      try {
        await api.delete(`/cases/${id}/telefones/${telefone.ID}`);
      } catch (error) {
        console.error('Error deleting telefone:', error);
      }
    }
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const handleAddEmail = async () => {
    const novoEmail: Email = {
      Email: '',
      Atualizado: new Date().toISOString().split('T')[0]
    };
    setEmails([...emails, novoEmail]);

    try {
      const response = await api.post(`/cases/${id}/emails`, { ID_Caso: id });
      setEmails(prevEmails => {
        const updated = [...prevEmails];
        const index = updated.length - 1;
        updated[index] = { ...updated[index], ID: response.data.ID };
        return updated;
      });
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  const handleUpdateEmail = async (index: number, value: string) => {
    const updated = [...emails];
    updated[index] = { ...updated[index], Email: value, Atualizado: new Date().toISOString().split('T')[0] };
    setEmails(updated);

    if (updated[index].ID) {
      try {
        await api.put(`/cases/${id}/emails/${updated[index].ID}`, {
          Email: value,
          Atualizado: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating email:', error);
      }
    }
  };

  const handleDeleteEmail = async (index: number) => {
    const email = emails[index];
    if (email.ID) {
      try {
        await api.delete(`/cases/${id}/emails/${email.ID}`);
      } catch (error) {
        console.error('Error deleting email:', error);
      }
    }
    setEmails(emails.filter((_, i) => i !== index));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 110 ? '' : age.toString();
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Seção 1: Dados Pessoais */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nome (Registro Civil):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.Nome_RC}
                    onBlur={(e) => handleSave('Nome_RC', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Nome_RC: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Data de nascimento:</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={formData.Data_nascimento}
                      onChange={(e) => {
                        const idade = calculateAge(e.target.value);
                        setFormData({ ...formData, Data_nascimento: e.target.value, Idade: idade });
                        handleSave('Data_nascimento', e.target.value);
                        handleSave('Idade', idade);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Idade:</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                      value={formData.Idade}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nome Social ou Ancestral:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.Nome_social_ancestral}
                    onBlur={(e) => handleSave('Nome_social_ancestral', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Nome_social_ancestral: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Filiação 1:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.Filiacao_1}
                    onBlur={(e) => handleSave('Filiacao_1', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Filiacao_1: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Como quer ser chamada:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.Como_querser_chamada}
                    onBlur={(e) => handleSave('Como_querser_chamada', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Como_querser_chamada: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Filiação 2:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.Filiacao_2}
                    onBlur={(e) => handleSave('Filiacao_2', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Filiacao_2: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Naturalidade:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.Naturalidade}
                    onChange={(e) => {
                      setFormData({ ...formData, Naturalidade: e.target.value });
                      handleSave('Naturalidade', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    {comarcasMG.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nacionalidade:</label>
                  <input
                    type="text"
                    placeholder="Ex: Brasileira (Brasil)"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.Nacionalidade}
                    onBlur={(e) => handleSave('Nacionalidade', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, Nacionalidade: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Seção 2: Documentação Civil */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Documentação civil</h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Situação:</label>
                <div className="flex items-center space-x-6">
                  {['Possui', 'Nunca teve', 'Perda/Roubo/Danificado/Extravio'].map(opt => (
                    <label key={opt} className="flex items-center">
                      <input
                        type="radio"
                        name="dc_situacao"
                        value={opt}
                        checked={formData.DC_situacao === opt}
                        onChange={(e) => {
                          setFormData({ ...formData, DC_situacao: e.target.value });
                          handleSave('DC_situacao', e.target.value);
                        }}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">CPF:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.DC_CPF}
                    onBlur={(e) => handleSave('DC_CPF', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, DC_CPF: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">RG:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.DC_RG}
                    onBlur={(e) => handleSave('DC_RG', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, DC_RG: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">CTPS:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.DC_CTPS}
                    onBlur={(e) => handleSave('DC_CTPS', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, DC_CTPS: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Endereço (1:N - Galeria) */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Endereços</h3>

              <div className="space-y-6">
                {enderecos.map((endereco, index) => (
                  <div key={endereco.ID || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                    <button
                      onClick={() => handleDeleteEndereco(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Excluir endereço"
                    >
                      ✕
                    </button>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Situação da Moradia:</label>
                      <div className="flex items-center space-x-4">
                        {['Casa própria', 'Aluguel', 'Em situação de rua', 'Outro'].map(opt => (
                          <label key={opt} className="flex items-center">
                            <input
                              type="radio"
                              name={`moradia_situacao_${index}`}
                              value={opt}
                              checked={endereco.Moradia_Situacao === opt}
                              onChange={(e) => handleUpdateEndereco(index, 'Moradia_Situacao', e.target.value)}
                              className="mr-2"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Endereço:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          value={endereco.Endereco}
                          onBlur={(e) => handleUpdateEndereco(index, 'Endereco', e.target.value)}
                          onChange={(e) => {
                            const updated = [...enderecos];
                            updated[index].Endereco = e.target.value;
                            setEnderecos(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Nº:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          value={endereco.Numero}
                          onBlur={(e) => handleUpdateEndereco(index, 'Numero', e.target.value)}
                          onChange={(e) => {
                            const updated = [...enderecos];
                            updated[index].Numero = e.target.value;
                            setEnderecos(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Complemento:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          value={endereco.Complemento}
                          onBlur={(e) => handleUpdateEndereco(index, 'Complemento', e.target.value)}
                          onChange={(e) => {
                            const updated = [...enderecos];
                            updated[index].Complemento = e.target.value;
                            setEnderecos(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Bairro:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          value={endereco.Bairro}
                          onBlur={(e) => handleUpdateEndereco(index, 'Bairro', e.target.value)}
                          onChange={(e) => {
                            const updated = [...enderecos];
                            updated[index].Bairro = e.target.value;
                            setEnderecos(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Cidade:</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          value={endereco.Cidade}
                          onBlur={(e) => handleUpdateEndereco(index, 'Cidade', e.target.value)}
                          onChange={(e) => {
                            const updated = [...enderecos];
                            updated[index].Cidade = e.target.value;
                            setEnderecos(updated);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">UF:</label>
                          <input
                            type="text"
                            maxLength={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={endereco.UF}
                            onBlur={(e) => handleUpdateEndereco(index, 'UF', e.target.value)}
                            onChange={(e) => {
                              const updated = [...enderecos];
                              updated[index].UF = e.target.value.toUpperCase();
                              setEnderecos(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">CEP:</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            value={endereco.CEP}
                            onBlur={(e) => handleUpdateEndereco(index, 'CEP', e.target.value)}
                            onChange={(e) => {
                              const updated = [...enderecos];
                              updated[index].CEP = e.target.value;
                              setEnderecos(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddEndereco}
                className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
              >
                Incluir endereço
              </button>
            </div>

            {/* Seção 4: Telefones e E-mails (1:N - Galleries) */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Telefones */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Telefones de contato</h3>
                  <div className="space-y-2 mb-3">
                    {telefones.map((tel, index) => (
                      <div key={tel.ID || index} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="(00) 0000-0000"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          value={tel.TelefoneDDD}
                          onBlur={(e) => handleUpdateTelefone(index, e.target.value)}
                          onChange={(e) => {
                            const updated = [...telefones];
                            updated[index].TelefoneDDD = e.target.value;
                            setTelefones(updated);
                          }}
                        />
                        <button
                          onClick={() => handleDeleteTelefone(index)}
                          className="px-2 py-1 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddTelefone}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                  >
                    Incluir telefone
                  </button>
                </div>

                {/* E-mails */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">E-mails</h3>
                  <div className="space-y-2 mb-3">
                    {emails.map((email, index) => (
                      <div key={email.ID || index} className="flex items-center gap-2">
                        <input
                          type="email"
                          placeholder="exemplo@gmail.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                          value={email.Email}
                          onBlur={(e) => handleUpdateEmail(index, e.target.value)}
                          onChange={(e) => {
                            const updated = [...emails];
                            updated[index].Email = e.target.value;
                            setEmails(updated);
                          }}
                        />
                        <button
                          onClick={() => handleDeleteEmail(index)}
                          className="px-2 py-1 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddEmail}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                  >
                    Incluir e-mail
                  </button>
                </div>
              </div>
            </div>

            {/* Seção 5: Contato de Pessoa de Confiança */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Contato de pessoa de confiança</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nome:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.CC_Nome}
                    onBlur={(e) => handleSave('CC_Nome', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, CC_Nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Telefone com DDD:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                    value={formData.CC_telefoneDDD}
                    onBlur={(e) => handleSave('CC_telefoneDDD', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, CC_telefoneDDD: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Vínculo:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.CC_vinculo}
                    onBlur={(e) => handleSave('CC_vinculo', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, CC_vinculo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Seção 6: Perfil Pessoal e Social */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Perfil Pessoal e Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Sexo:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_Sexo}
                    onChange={(e) => {
                      setFormData({ ...formData, PPS_Sexo: e.target.value });
                      handleSave('PPS_Sexo', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Intersexo">Intersexo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Identidade de gênero:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_idgenero}
                    onChange={(e) => {
                      setFormData({ ...formData, PPS_idgenero: e.target.value });
                      handleSave('PPS_idgenero', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Mulher cisgênero">Mulher cisgênero</option>
                    <option value="Homem cisgênero">Homem cisgênero</option>
                    <option value="Mulher transgênero">Mulher transgênero</option>
                    <option value="Homem transgênero">Homem transgênero</option>
                    <option value="Não-binário">Não-binário</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Orientação sexual:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_orientacao_sexual}
                    onChange={(e) => {
                      setFormData({ ...formData, PPS_orientacao_sexual: e.target.value });
                      handleSave('PPS_orientacao_sexual', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Heterossexual">Heterossexual</option>
                    <option value="Homossexual">Homossexual</option>
                    <option value="Bissexual">Bissexual</option>
                    <option value="Pansexual">Pansexual</option>
                    <option value="Assexual">Assexual</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Raça/Cor/Etnia:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_Raca_cor_etnia}
                    onChange={(e) => {
                      setFormData({ ...formData, PPS_Raca_cor_etnia: e.target.value });
                      handleSave('PPS_Raca_cor_etnia', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Branca">Branca</option>
                    <option value="Preta">Preta</option>
                    <option value="Parda">Parda</option>
                    <option value="Amarela">Amarela</option>
                    <option value="Indígena">Indígena</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Religião:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_religiao}
                    onBlur={(e) => handleSave('PPS_religiao', e.target.value)}
                    onChange={(e) => setFormData({ ...formData, PPS_religiao: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Estado civil:</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.PPS_estado_civil}
                    onChange={(e) => {
                      setFormData({ ...formData, PPS_estado_civil: e.target.value });
                      handleSave('PPS_estado_civil', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="União estável">União estável</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/dados-entrada`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/sit-juridica`)}
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
