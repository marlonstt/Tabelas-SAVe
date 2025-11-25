import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function SinteseAnalitica() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    UnidadeAnalitica: '',
    AvaliacaoDeRiscos: '',
    PlanoDePrevencao: '',
    DataVencimento: '',
    Cor: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.sintese) {
        const data = response.data.sintese;
        setFormData({
          UnidadeAnalitica: data.UnidadeAnalitica || '',
          AvaliacaoDeRiscos: data.AvaliacaoDeRiscos || '',
          PlanoDePrevencao: data.PlanoDePrevencao || '',
          DataVencimento: data.DataVencimento ? data.DataVencimento.split('T')[0] : '',
          Cor: data.Cor || ''
        });
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/sintese`, { [field]: value });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string, value: any) => {
    handleSave(field, value);
  };

  const renderTextarea = (label: string, field: string, rows: number = 6) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <textarea
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={formData[field as keyof typeof formData] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
      />
    </div>
  );

  const renderInput = (label: string, field: string, type: string = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        value={formData[field as keyof typeof formData] as string}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
      />
    </div>
  );

  const renderColorPicker = (label: string, field: string) => {
    const colors = [
      { value: 'Verde', label: 'Verde (Baixo Risco)', color: 'bg-green-500' },
      { value: 'Amarelo', label: 'Amarelo (Médio Risco)', color: 'bg-yellow-500' },
      { value: 'Laranja', label: 'Laranja (Alto Risco)', color: 'bg-orange-500' },
      { value: 'Vermelho', label: 'Vermelho (Risco Crítico)', color: 'bg-red-500' }
    ];

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-700">{label}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colors.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                handleChange(field, color.value);
                handleSave(field, color.value);
              }}
              className={`p-3 rounded-lg border-2 transition-all ${formData[field as keyof typeof formData] === color.value
                  ? 'border-indigo-600 shadow-lg scale-105'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <div className={`w-full h-8 ${color.color} rounded mb-2`}></div>
              <p className="text-xs text-center font-medium">{color.label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">Síntese Analítica do Caso</h3>

              {renderTextarea('Unidade Analítica:', 'UnidadeAnalitica', 8)}

              {renderTextarea('Avaliação de Riscos:', 'AvaliacaoDeRiscos', 8)}

              {renderTextarea('Plano de Prevenção:', 'PlanoDePrevencao', 8)}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Data de Vencimento:', 'DataVencimento', 'date')}
                <div>
                  {renderColorPicker('Indicador de Risco:', 'Cor')}
                </div>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/vitimizacao`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/acompanhamento`)}
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
