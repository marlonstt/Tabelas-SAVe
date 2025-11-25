import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function HabitacaoTerritorio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Tipo de Moradia
    Moradia_regular: false,
    Moradia_regular_esp: '',
    Moradia_Irregular: false,
    Moradia_Irregular_esp: '',
    Moradia_Emergencial: false,
    Moradia_Emergencial_esp: '',

    // Território e Comunidade
    Territorio: '',
    Comunidade_tradicional: '',
    Comunidade_tradicional_esp: '',

    // Reconhecimentos
    titulado_Incra: '',
    Reconhecido_funai: '',
    Reconhecido_fund_palmares: '',
    Reconhecido_orgao_publico: '',

    // Estrutura
    Estrutura_Mat_predominante: '',
    Estrutura_Mat_predominante_esp: '',
    Estrutura_Insta_eletricas_hidraulica: '',
    Estrutura_Insta_eletricas_hidraulica_esp: '',
    Estrutura_Risco_geologico: '',
    Estrutura_Risco_geologico_esp: '',
    Estrutura_paredes_revesti: '',
    Estrutura_Acesso_internet: '',
    Estrutura_Acesso_internet_esp: '',
    Estrutura_danos_eventos_naturais: '',
    Estrutura_danos_eventos_naturais_esp: '',

    // Fatores de Risco
    Fatores_risco_ambiental_infra: false,
    Fatores_risco_ambiental_infra_esp: '',
    Conflitos_Urbanos_Criminalidade: false,
    Conflitos_Urbanos_Criminalidade_esp: '',
    Conflitos_fundiarios_Agrarios: false,
    Conflitos_fundiarios_Agrarios_esp: '',
    Fatores_risco_outros: false,
    Fatores_risco_outros_esp: '',

    // Mudança
    RV_Mudanca_domicilio: '',
    RV_Mudanca_domicilio_esp: '',

    // Situação de Rua
    Tempo_Situacao_Rua: '',
    Sit_Rua_Risco_Violencia: '',
    Tem_Contato_Familiar: '',
    Frequenta_Instituicao_Acolhimento: '',
    Especifique_Instituicao_Acolhimento: '',
    Expectativas_Futuro: '',
    Nomes_Vinculos_Afetivos: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.habitacao) {
        setFormData(prev => ({ ...prev, ...response.data.habitacao }));
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/habitacao`, { [field]: value });
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
          placeholder="Especifique..."
          value={formData[inputField as keyof typeof formData] as string}
          onChange={(e) => handleChange(inputField, e.target.value)}
          onBlur={(e) => handleBlur(inputField, e.target.value)}
        />
      )}
    </div>
  );

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

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Tipo de Moradia */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Tipo de Moradia</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderCheckboxWithInput('Moradia Regular', 'Moradia_regular', 'Moradia_regular_esp')}
                {renderCheckboxWithInput('Moradia Irregular', 'Moradia_Irregular', 'Moradia_Irregular_esp')}
                {renderCheckboxWithInput('Moradia Emergencial', 'Moradia_Emergencial', 'Moradia_Emergencial_esp')}
              </div>
            </div>

            {/* Seção 2: Território e Comunidade */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Território e Comunidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Território:', 'Territorio')}
                <div>
                  {renderRadioGroup('Comunidade Tradicional?', 'Comunidade_tradicional')}
                  {formData.Comunidade_tradicional === 'Sim' &&
                    renderInput('Qual?', 'Comunidade_tradicional_esp')}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Reconhecimentos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderRadioGroup('Titulado INCRA?', 'titulado_Incra')}
                  {renderRadioGroup('Reconhecido FUNAI?', 'Reconhecido_funai')}
                  {renderRadioGroup('Reconhecido Fund. Palmares?', 'Reconhecido_fund_palmares')}
                  {renderRadioGroup('Reconhecido Órgão Público?', 'Reconhecido_orgao_publico')}
                </div>
              </div>
            </div>

            {/* Seção 3: Estrutura da Moradia */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Estrutura da Moradia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Material Predominante Adequado?', 'Estrutura_Mat_predominante')}
                  {formData.Estrutura_Mat_predominante === 'Não' &&
                    renderInput('Especifique:', 'Estrutura_Mat_predominante_esp')}
                </div>
                <div>
                  {renderRadioGroup('Instalações Elétricas/Hidráulicas Adequadas?', 'Estrutura_Insta_eletricas_hidraulica')}
                  {formData.Estrutura_Insta_eletricas_hidraulica === 'Não' &&
                    renderInput('Especifique:', 'Estrutura_Insta_eletricas_hidraulica_esp')}
                </div>
                <div>
                  {renderRadioGroup('Risco Geológico?', 'Estrutura_Risco_geologico')}
                  {formData.Estrutura_Risco_geologico === 'Sim' &&
                    renderInput('Especifique:', 'Estrutura_Risco_geologico_esp')}
                </div>
                <div>
                  {renderRadioGroup('Acesso à Internet?', 'Estrutura_Acesso_internet')}
                  {formData.Estrutura_Acesso_internet === 'Sim' &&
                    renderInput('Especifique:', 'Estrutura_Acesso_internet_esp')}
                </div>
                <div>
                  {renderRadioGroup('Danos por Eventos Naturais?', 'Estrutura_danos_eventos_naturais')}
                  {formData.Estrutura_danos_eventos_naturais === 'Sim' &&
                    renderInput('Especifique:', 'Estrutura_danos_eventos_naturais_esp')}
                </div>
                {renderInput('Paredes/Revestimento:', 'Estrutura_paredes_revesti')}
              </div>
            </div>

            {/* Seção 4: Fatores de Risco e Mudança */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Fatores de Risco e Mudança</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {renderCheckboxWithInput('Risco Ambiental/Infraestrutura', 'Fatores_risco_ambiental_infra', 'Fatores_risco_ambiental_infra_esp')}
                {renderCheckboxWithInput('Conflitos Urbanos/Criminalidade', 'Conflitos_Urbanos_Criminalidade', 'Conflitos_Urbanos_Criminalidade_esp')}
                {renderCheckboxWithInput('Conflitos Fundiários/Agrários', 'Conflitos_fundiarios_Agrarios', 'Conflitos_fundiarios_Agrarios_esp')}
                {renderCheckboxWithInput('Outros Fatores de Risco', 'Fatores_risco_outros', 'Fatores_risco_outros_esp')}
              </div>

              <div>
                {renderRadioGroup('Houve mudança de domicílio?', 'RV_Mudanca_domicilio')}
                {formData.RV_Mudanca_domicilio === 'Sim' &&
                  renderInput('Motivo/Detalhes:', 'RV_Mudanca_domicilio_esp')}
              </div>
            </div>

            {/* Seção 5: População em Situação de Rua */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">População em Situação de Rua</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Tempo em situação de rua:', 'Tempo_Situacao_Rua')}
                {renderInput('Risco de violência:', 'Sit_Rua_Risco_Violencia')}
                {renderRadioGroup('Tem contato familiar?', 'Tem_Contato_Familiar')}
                <div>
                  {renderRadioGroup('Frequenta instituição de acolhimento?', 'Frequenta_Instituicao_Acolhimento')}
                  {formData.Frequenta_Instituicao_Acolhimento === 'Sim' &&
                    renderInput('Qual?', 'Especifique_Instituicao_Acolhimento')}
                </div>
                {renderInput('Expectativas de futuro:', 'Expectativas_Futuro')}
                {renderInput('Nomes/Vínculos afetivos:', 'Nomes_Vinculos_Afetivos')}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/saude`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/assistencia`)}
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
