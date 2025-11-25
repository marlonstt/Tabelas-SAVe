import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function EnsinoTrabalhoRenda() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Educação
    Grau_escolaridade: '',
    Estuda_atualmente: '',
    Tipo_instituicao: '',
    Nome_instituicao: '',
    Retorno_estudos: '',

    // Trabalho e Renda
    Situacao_trabalho: '',
    Esta_Afastado: '',
    Motivo_afastamento: '',
    Motivo_Afastamento_Detalhado: '',
    Valor_renda: '',
    Valor_renda_esp: '',

    // Prejuízos
    TR_Prejuizo_trabalho: '',
    TR_tipo_prejuizo: '',
    TR_descricao_prejuizo: '',
    PT_prejuizo_patrimonio: '',
    PT_Descricao_pp: '',
    VE_prejuizo_escolar: '',
    VE_tipo_PE: '',
    VE_descricao_pe: '',

    // Demandas
    Demanda_educacional: false,
    Desc_demanda_educacional: '',
    Demanda_trabalhista: false,
    Desc_demanda_trabalhista: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.ensino) {
        setFormData(prev => ({ ...prev, ...response.data.ensino }));
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/ensino`, { [field]: value });
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

  const renderInput = (label: string, field: string, placeholder: string = '') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder={placeholder}
        value={formData[field as keyof typeof formData] as string || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
      />
    </div>
  );

  const renderRadioGroup = (label: string, field: string, options: string[] = ['Sim', 'Não']) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        {options.map(option => (
          <label key={option} className="flex items-center">
            <input
              type="radio"
              name={field}
              value={option}
              checked={formData[field as keyof typeof formData] === option}
              onChange={(e) => {
                handleChange(field, e.target.value);
                handleSave(field, e.target.value);
              }}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  const renderCheckboxWithInput = (label: string, checkboxField: string, inputField: string) => (
    <div className="mb-4 p-3 border rounded hover:bg-gray-50">
      <label className="flex items-center space-x-3 mb-2">
        <input
          type="checkbox"
          checked={formData[checkboxField as keyof typeof formData] as boolean}
          onChange={(e) => {
            handleChange(checkboxField, e.target.checked);
            handleSave(checkboxField, e.target.checked);
          }}
          className="h-5 w-5 text-indigo-600"
        />
        <span className="text-gray-700 font-medium">{label}</span>
      </label>
      {formData[checkboxField as keyof typeof formData] && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded mt-2"
          placeholder="Descrição..."
          value={formData[inputField as keyof typeof formData] as string}
          onChange={(e) => handleChange(inputField, e.target.value)}
          onBlur={(e) => handleBlur(inputField, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Educação */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Educação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Grau de Escolaridade:', 'Grau_escolaridade')}
                <div>
                  {renderRadioGroup('Estuda Atualmente?', 'Estuda_atualmente')}
                  {formData.Estuda_atualmente === 'Sim' && (
                    <>
                      {renderInput('Tipo de Instituição:', 'Tipo_instituicao')}
                      {renderInput('Nome da Instituição:', 'Nome_instituicao')}
                    </>
                  )}
                </div>
                {renderInput('Deseja retornar aos estudos?', 'Retorno_estudos')}
              </div>
            </div>

            {/* Seção 2: Trabalho e Renda */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Trabalho e Renda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Situação de Trabalho:', 'Situacao_trabalho')}
                <div>
                  {renderRadioGroup('Está Afastado?', 'Esta_Afastado')}
                  {formData.Esta_Afastado === 'Sim' && (
                    <>
                      {renderInput('Motivo Afastamento:', 'Motivo_afastamento')}
                      {renderInput('Detalhes:', 'Motivo_Afastamento_Detalhado')}
                    </>
                  )}
                </div>
                <div>
                  {renderInput('Valor da Renda:', 'Valor_renda')}
                  {renderInput('Especificação Renda:', 'Valor_renda_esp')}
                </div>
              </div>
            </div>

            {/* Seção 3: Prejuízos */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Prejuízos Decorrentes da Violência</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Trabalho</h4>
                  {renderRadioGroup('Houve Prejuízo?', 'TR_Prejuizo_trabalho')}
                  {formData.TR_Prejuizo_trabalho === 'Sim' && (
                    <>
                      {renderInput('Tipo:', 'TR_tipo_prejuizo')}
                      {renderInput('Descrição:', 'TR_descricao_prejuizo')}
                    </>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Patrimônio</h4>
                  {renderRadioGroup('Houve Prejuízo?', 'PT_prejuizo_patrimonio')}
                  {formData.PT_prejuizo_patrimonio === 'Sim' &&
                    renderInput('Descrição:', 'PT_Descricao_pp')}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Escolar</h4>
                  {renderRadioGroup('Houve Prejuízo?', 'VE_prejuizo_escolar')}
                  {formData.VE_prejuizo_escolar === 'Sim' && (
                    <>
                      {renderInput('Tipo:', 'VE_tipo_PE')}
                      {renderInput('Descrição:', 'VE_descricao_pe')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 4: Demandas */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Demandas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCheckboxWithInput('Demanda Educacional', 'Demanda_educacional', 'Desc_demanda_educacional')}
                {renderCheckboxWithInput('Demanda Trabalhista', 'Demanda_trabalhista', 'Desc_demanda_trabalhista')}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/assistencia`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/vinculos`)}
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
