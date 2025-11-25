import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import api from '../../services/api';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';

export default function Encerramento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isCaseEncerrado, setIsCaseEncerrado] = useState(false);

  const [formData, setFormData] = useState({
    Data: '',
    Forma_Encerramento_Caso: '',
    Especifique_Outros: '',
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

      // Check if case is already closed
      if (response.data.geral?.Encerrado === 'Sim') {
        setIsCaseEncerrado(true);
      }

      if (response.data.encerramento) {
        const data = response.data.encerramento;
        setFormData({
          Data: data.Data ? data.Data.split('T')[0] : '',
          Forma_Encerramento_Caso: data.Forma_Encerramento_Caso || '',
          Especifique_Outros: data.Especifique_Outros || '',
          Observacao: data.Observacao || ''
        });
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    if (isCaseEncerrado) return; // Prevent editing if case is closed

    try {
      await api.put(`/cases/${id}/encerramento`, { [field]: value });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (isCaseEncerrado) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string, value: any) => {
    if (isCaseEncerrado) return;
    handleSave(field, value);
  };

  const handleEncerrarCaso = async () => {
    if (!formData.Data || !formData.Forma_Encerramento_Caso) {
      alert('Por favor, preencha a data e a forma de encerramento antes de encerrar o caso.');
      return;
    }

    if (window.confirm('Tem certeza que deseja encerrar este caso? Esta ação não poderá ser desfeita e o caso ficará bloqueado para edição.')) {
      try {
        // Save encerramento data
        await api.put(`/cases/${id}/encerramento`, formData);

        // Update case status to Encerrado
        await api.put(`/cases/${id}/geral`, { Encerrado: 'Sim' });

        setIsCaseEncerrado(true);
        alert('Caso encerrado com sucesso!');
      } catch (error) {
        console.error('Error closing case:', error);
        alert('Erro ao encerrar o caso. Por favor, tente novamente.');
      }
    }
  };

  const formasEncerramento = [
    'Arquivamento',
    'Transferência',
    'Conclusão do Atendimento',
    'Desistência da Vítima',
    'Óbito',
    'Outros'
  ];

  const renderInput = (label: string, field: string, type: string = 'text', placeholder: string = '') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded ${isCaseEncerrado ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={formData[field as keyof typeof formData] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
        disabled={isCaseEncerrado}
      />
    </div>
  );

  const renderTextarea = (label: string, field: string, rows: number = 4) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <textarea
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded ${isCaseEncerrado ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        value={formData[field as keyof typeof formData] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
        disabled={isCaseEncerrado}
      />
    </div>
  );

  const renderSelect = (label: string, field: string, options: string[]) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded ${isCaseEncerrado ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        value={formData[field as keyof typeof formData] as string}
        onChange={(e) => {
          handleChange(field, e.target.value);
          handleSave(field, e.target.value);
        }}
        disabled={isCaseEncerrado}
      >
        <option value="">Selecione...</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Status Banner */}
            {isCaseEncerrado && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-center">
                  <Lock className="text-yellow-600 mr-3" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Caso Encerrado</p>
                    <p className="text-sm text-yellow-700">Este caso foi encerrado e não pode mais ser editado.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário de Encerramento */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <div className="flex items-center mb-6">
                {isCaseEncerrado ? (
                  <CheckCircle className="text-green-600 mr-3" size={28} />
                ) : (
                  <AlertCircle className="text-orange-600 mr-3" size={28} />
                )}
                <h3 className="text-lg font-semibold text-gray-800">Encerramento do Caso</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Data de Encerramento:', 'Data', 'date')}
                {renderSelect('Forma de Encerramento:', 'Forma_Encerramento_Caso', formasEncerramento)}
              </div>

              {formData.Forma_Encerramento_Caso === 'Outros' && (
                <div className="mt-4">
                  {renderInput('Especifique Outros:', 'Especifique_Outros', 'text', 'Descreva a forma de encerramento')}
                </div>
              )}

              <div className="mt-4">
                {renderTextarea('Observações:', 'Observacao', 6)}
              </div>

              {!isCaseEncerrado && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-orange-600 mr-3 mt-0.5" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-orange-800 mb-1">Atenção!</p>
                        <p className="text-sm text-orange-700">
                          Ao encerrar o caso, todas as informações serão bloqueadas para edição.
                          Certifique-se de que todos os dados estão corretos antes de prosseguir.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEncerrarCaso}
                    className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                  >
                    <Lock size={20} className="mr-2" />
                    Encerrar Caso
                  </button>
                </div>
              )}
            </div>

            {/* Informações Adicionais */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Informações sobre Encerramento</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>O encerramento do caso é uma ação irreversível</li>
                <li>Após o encerramento, nenhum campo poderá ser editado</li>
                <li>O caso permanecerá visível para consulta</li>
                <li>Certifique-se de que todos os acompanhamentos foram registrados</li>
              </ul>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/acompanhamento`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate('/cases')}
                className="px-6 py-2 rounded text-white bg-[#6264A7] hover:bg-[#5558a0]"
              >
                Voltar para Lista de Casos
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
