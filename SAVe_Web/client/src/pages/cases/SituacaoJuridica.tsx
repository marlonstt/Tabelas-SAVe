import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

interface Processo {
  ID?: number;
  ID_Caso?: number;
  SJIP_Numero?: string;
  SJIP_Classe_Tipo?: string;
}

export default function SituacaoJuridica() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // State for SAVe_Situacao_Juridica
  const [formData, setFormData] = useState({
    SJ_Autor_Maior_18: '',
    SJ_REDS: '',
    SJ_REDS_Classe_Tipo: '',
    SJ_IP_PCNet: '',
    SJ_IP_PCNet_Classe_Tipo: '',
    SJ_Auto_Judicial: '',
    SJ_Auto_Judicial_Classe_Tipo: '',
    SJ_Num_MPMG: '',
    SJ_Medidas_Prot_Cautelar: '',
    SJ_Compartilhado_Rede: '',
    SJ_Relato_Descumprimento: '',
    SJ_Orgao_Julgador: '',
    SJ_Juiz: '',
    SJ_Promotoria: '',
    SJ_Promotor: '',
    SJ_Delegacia: '',
    SJ_Delegado: '',
    SJ_Data_Fatos: '',
    SJ_Tipo_Penal_Fatos: '',
    SJ_Data_Autuacao_IP: '',
    SJ_Tipo_Penal_Autuacao_IP: '',
    SJ_Data_Conclusao_IP: '',
    SJ_Tipo_Penal_Conclusao_IP: '',
    SJ_Data_Denuncia_Repres: '',
    SJ_Tipo_Penal_Denuncia_Repres: '',
    SJ_Data_Audiencia: '',
    SJ_Tipo_Penal_Audiencia: '',
    SJ_Data_Sentenca: '',
    SJ_Tipo_Penal_Sentenca: '',
    SJ_Data_Transito_Julgado: '',
    SJ_Tipo_Penal_Transito_Julgado: '',
    SJ_Hora_Crime: '',
    SJ_Local_Crime: '',
    SJ_Status_Juridico_Autor: '',
    SJ_Agressor_Ja_Preso: '',
    SJ_Prisao_Data: '',
    SJ_Prisao_Num_Procedimento: '',
    SJ_Prisao_Infracao: ''
  });

  // State for SAVe_Situacao_Juridica2 (Demandas)
  const [demandasData, setDemandasData] = useState({
    SJ2_Demanda_Info_Participacao: false,
    SJ2_Demanda_Memoria_Verdade: false,
    SJ2_Demanda_Justica_Diligencia: false,
    SJ2_Demanda_Apoio_Assistencia: false,
    SJ2_Demanda_Seguranca: false,
    SJ2_Demanda_Protecao_Nao_Revitimizacao: false,
    SJ2_Demanda_Protecao_Documental: false,
    SJ2_Demanda_Compensacao_Reparacao: false,
    SJ2_Demanda_Tratamento_Digno: false,
    SJ2_Demanda_Protecao_Psicologica: false
  });

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [novoProcesso, setNovoProcesso] = useState<Processo>({ SJIP_Numero: '', SJIP_Classe_Tipo: '' });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);

      if (response.data.situacaoJuridica) {
        // Format dates for input type="date"
        const formattedData = { ...response.data.situacaoJuridica };
        ['SJ_Data_Fatos', 'SJ_Data_Autuacao_IP', 'SJ_Data_Conclusao_IP', 'SJ_Data_Denuncia_Repres',
          'SJ_Data_Audiencia', 'SJ_Data_Sentenca', 'SJ_Data_Transito_Julgado'].forEach(field => {
            if (formattedData[field]) {
              formattedData[field] = formattedData[field].split('T')[0];
            }
          });
        setFormData(prev => ({ ...prev, ...formattedData }));
      }

      if (response.data.situacaoJuridica2) {
        setDemandasData(prev => ({ ...prev, ...response.data.situacaoJuridica2 }));
      }

      if (response.data.processos) {
        setProcessos(response.data.processos);
      }

    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      // For dates, if empty string, send null or handle appropriately
      const payloadValue = value === '' ? null : value;
      await api.put(`/cases/${id}/situacao-juridica`, { [field]: payloadValue });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleSaveDemandas = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/situacao-juridica-2`, { [field]: value });
    } catch (error) {
      console.error('Error saving demandas:', error);
    }
  };

  const handleAddProcesso = async () => {
    if (!novoProcesso.SJIP_Numero) return;
    try {
      const response = await api.post(`/cases/${id}/processos`, novoProcesso);
      setProcessos([...processos, response.data]);
      setNovoProcesso({ SJIP_Numero: '', SJIP_Classe_Tipo: '' });
    } catch (error) {
      console.error('Error adding processo:', error);
    }
  };

  const handleDeleteProcesso = async (processoId: number) => {
    try {
      await api.delete(`/cases/${id}/processos/${processoId}`);
      setProcessos(processos.filter(p => p.ID !== processoId));
    } catch (error) {
      console.error('Error deleting processo:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string, value: any) => {
    handleSave(field, value);
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Dados Básicos e Processos */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados do Processo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Autor é maior de 18 anos?</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Autor_Maior_18 || ''}
                    onChange={(e) => {
                      handleChange('SJ_Autor_Maior_18', e.target.value);
                      handleSave('SJ_Autor_Maior_18', e.target.value);
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nº MPMG:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Num_MPMG || ''}
                    onChange={(e) => handleChange('SJ_Num_MPMG', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Num_MPMG', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">REDS:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_REDS || ''}
                    onChange={(e) => handleChange('SJ_REDS', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_REDS', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Classe/Tipo (REDS):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_REDS_Classe_Tipo || ''}
                    onChange={(e) => handleChange('SJ_REDS_Classe_Tipo', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_REDS_Classe_Tipo', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">IP PCNet:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_IP_PCNet || ''}
                    onChange={(e) => handleChange('SJ_IP_PCNet', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_IP_PCNet', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Classe/Tipo (IP):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_IP_PCNet_Classe_Tipo || ''}
                    onChange={(e) => handleChange('SJ_IP_PCNet_Classe_Tipo', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_IP_PCNet_Classe_Tipo', e.target.value)}
                  />
                </div>
              </div>

              {/* Lista de Outros Processos */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Outros Processos</h4>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Número do Processo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    value={novoProcesso.SJIP_Numero || ''}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, SJIP_Numero: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Classe/Tipo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    value={novoProcesso.SJIP_Classe_Tipo || ''}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, SJIP_Classe_Tipo: e.target.value })}
                  />
                  <button
                    onClick={handleAddProcesso}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {processos.map((proc) => (
                    <div key={proc.ID} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                      <div>
                        <span className="font-medium">{proc.SJIP_Numero}</span>
                        {proc.SJIP_Classe_Tipo && <span className="text-gray-500 ml-2">({proc.SJIP_Classe_Tipo})</span>}
                      </div>
                      <button
                        onClick={() => proc.ID && handleDeleteProcesso(proc.ID)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção 2: Órgão Julgador e Autoridades */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Órgão Julgador e Autoridades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Órgão Julgador:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Orgao_Julgador || ''}
                    onChange={(e) => handleChange('SJ_Orgao_Julgador', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Orgao_Julgador', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Juiz:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Juiz || ''}
                    onChange={(e) => handleChange('SJ_Juiz', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Juiz', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Promotoria:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Promotoria || ''}
                    onChange={(e) => handleChange('SJ_Promotoria', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Promotoria', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Promotor:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Promotor || ''}
                    onChange={(e) => handleChange('SJ_Promotor', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Promotor', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Delegacia:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Delegacia || ''}
                    onChange={(e) => handleChange('SJ_Delegacia', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Delegacia', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Delegado:</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Delegado || ''}
                    onChange={(e) => handleChange('SJ_Delegado', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Delegado', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Datas e Fases */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Datas e Fases Processuais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Fatos */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Data dos Fatos:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Data_Fatos || ''}
                    onChange={(e) => {
                      handleChange('SJ_Data_Fatos', e.target.value);
                      handleSave('SJ_Data_Fatos', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo Penal (Fatos):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Tipo_Penal_Fatos || ''}
                    onChange={(e) => handleChange('SJ_Tipo_Penal_Fatos', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Tipo_Penal_Fatos', e.target.value)}
                  />
                </div>

                {/* Autuação IP */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Data Autuação IP:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Data_Autuacao_IP || ''}
                    onChange={(e) => {
                      handleChange('SJ_Data_Autuacao_IP', e.target.value);
                      handleSave('SJ_Data_Autuacao_IP', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo Penal (Autuação):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Tipo_Penal_Autuacao_IP || ''}
                    onChange={(e) => handleChange('SJ_Tipo_Penal_Autuacao_IP', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Tipo_Penal_Autuacao_IP', e.target.value)}
                  />
                </div>

                {/* Denúncia */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Data Denúncia/Repres.:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Data_Denuncia_Repres || ''}
                    onChange={(e) => {
                      handleChange('SJ_Data_Denuncia_Repres', e.target.value);
                      handleSave('SJ_Data_Denuncia_Repres', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo Penal (Denúncia):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Tipo_Penal_Denuncia_Repres || ''}
                    onChange={(e) => handleChange('SJ_Tipo_Penal_Denuncia_Repres', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Tipo_Penal_Denuncia_Repres', e.target.value)}
                  />
                </div>

                {/* Audiência */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Data Audiência:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Data_Audiencia || ''}
                    onChange={(e) => {
                      handleChange('SJ_Data_Audiencia', e.target.value);
                      handleSave('SJ_Data_Audiencia', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo Penal (Audiência):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Tipo_Penal_Audiencia || ''}
                    onChange={(e) => handleChange('SJ_Tipo_Penal_Audiencia', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Tipo_Penal_Audiencia', e.target.value)}
                  />
                </div>

                {/* Sentença */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Data Sentença:</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Data_Sentenca || ''}
                    onChange={(e) => {
                      handleChange('SJ_Data_Sentenca', e.target.value);
                      handleSave('SJ_Data_Sentenca', e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo Penal (Sentença):</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={formData.SJ_Tipo_Penal_Sentenca || ''}
                    onChange={(e) => handleChange('SJ_Tipo_Penal_Sentenca', e.target.value)}
                    onBlur={(e) => handleBlur('SJ_Tipo_Penal_Sentenca', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seção 4: Demandas da Vítima */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Demandas da Vítima</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Info_Participacao}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Info_Participacao: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Info_Participacao', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Informação e Participação</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Memoria_Verdade}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Memoria_Verdade: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Memoria_Verdade', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Memória e Verdade</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Justica_Diligencia}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Justica_Diligencia: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Justica_Diligencia', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Justiça e Diligência</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Apoio_Assistencia}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Apoio_Assistencia: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Apoio_Assistencia', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Apoio e Assistência</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Seguranca}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Seguranca: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Seguranca', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Segurança</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Protecao_Nao_Revitimizacao}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Protecao_Nao_Revitimizacao: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Protecao_Nao_Revitimizacao', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Proteção contra Revitimização</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Protecao_Documental}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Protecao_Documental: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Protecao_Documental', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Proteção Documental</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Compensacao_Reparacao}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Compensacao_Reparacao: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Compensacao_Reparacao', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Compensação e Reparação</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Tratamento_Digno}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Tratamento_Digno: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Tratamento_Digno', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Tratamento Digno</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={demandasData.SJ2_Demanda_Protecao_Psicologica}
                    onChange={(e) => {
                      setDemandasData(prev => ({ ...prev, SJ2_Demanda_Protecao_Psicologica: e.target.checked }));
                      handleSaveDemandas('SJ2_Demanda_Protecao_Psicologica', e.target.checked);
                    }}
                    className="h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700">Proteção Psicológica</span>
                </label>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/identificacao`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/saude`)}
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
