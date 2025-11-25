import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function Saude() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Pessoa com Deficiência
    HS_Pessoa_deficiencia: '',
    HS_Pessoa_deficiencia_tipo: '',

    // Condição de Saúde
    HS_Condicao_saude: '',
    HS_Condicao_saude_acompanhamento: '',
    HS_Condicao_saude_tipo: '',
    HS_Cond_saude_nao_perma: '',
    HS_Cond_saude_nao_perma_acomp: '',
    HS_Cond_saude_nao_perma_desc: '',

    // Auxílio Saúde / Vitimização Sexual
    HS_Aux_saude: '',
    HS_Aux_saude_acomp: '',
    HS_Aux_saude_desc: '',
    HS_Vitim_sexual: '',
    HS_Vitim_sexual_acomp: '',
    HS_Vitim_sexual_desc: '',

    // Medicação
    HS_Medic_continua: '',
    HS_Medic_continua_desc: '',
    HS_Medic_psiq: '',
    HS_Medic_psiq_desc: '',

    // Fatores de Risco
    FR_Alcool: '',
    FR_Alcool_freq: '',
    FR_Cigarro: '',
    FR_Cigarro_freq: '',
    FR_Subst_psicoativas: '',
    FR_Subst_psicoativas_freq: '',
    FR_Apoio: '',
    FR_Apoio_desc: '',

    // Rede de Saúde
    RS_Acomp_publica: '',
    RS_Acomp_publica_tipo: '',
    RS_Acomp_RAPS: '',
    RS_Acomp_RAPS_centro: '',
    RS_Acomp_RAPS_especif: '',
    RS_Plano_saude: '',
    RS_Plano_saude_especif: '',
    RS_Contato_nome: '',
    RS_Contato_tel: '',
    RS_Contato_email: '',

    // Vulnerabilidade Familiar (present in table)
    RFC_Familia_Vulnerab: '',
    RFC_Vulnerab_especif: '',

    // Impactos da Vitimização
    IV_Vitim_Impacto_Psic: '',
    IV_Vitim_Especif: '',
    IV_Houve_Impacto_Saude: '',
    IV_Defic_vitimizacao: '',
    IV_Defic_vitimizacao_tipo: '',
    IV_Comp_Cogn_Comport: '',
    IV_Comp_Cogn_Comport_tipo: '',
    IV_Outro: '',
    IV_Outro_espec: '',
    IV_Lesoes_Nao_Fatais: '',
    IV_Problemas_De_Saude: '',
    IV_ISTOutros_esp: '',
    IV_Impacto_Saude_Mental_tipos: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.saude) {
        setFormData(prev => ({ ...prev, ...response.data.saude }));
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/saude`, { [field]: value });
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

  const renderInput = (label: string, field: string, placeholder: string = '') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder={placeholder}
        value={formData[field as keyof typeof formData] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={(e) => handleBlur(field, e.target.value)}
      />
    </div>
  );

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Condições de Saúde */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Condições de Saúde</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Pessoa com deficiência?', 'HS_Pessoa_deficiencia')}
                  {formData.HS_Pessoa_deficiencia === 'Sim' &&
                    renderInput('Qual tipo?', 'HS_Pessoa_deficiencia_tipo')}
                </div>
                <div>
                  {renderRadioGroup('Possui condição de saúde permanente?', 'HS_Condicao_saude')}
                  {formData.HS_Condicao_saude === 'Sim' && (
                    <>
                      {renderInput('Qual tipo?', 'HS_Condicao_saude_tipo')}
                      {renderRadioGroup('Realiza acompanhamento?', 'HS_Condicao_saude_acompanhamento')}
                    </>
                  )}
                </div>
                <div>
                  {renderRadioGroup('Possui condição de saúde não permanente?', 'HS_Cond_saude_nao_perma')}
                  {formData.HS_Cond_saude_nao_perma === 'Sim' && (
                    <>
                      {renderInput('Descrição:', 'HS_Cond_saude_nao_perma_desc')}
                      {renderRadioGroup('Realiza acompanhamento?', 'HS_Cond_saude_nao_perma_acomp')}
                    </>
                  )}
                </div>
                <div>
                  {renderRadioGroup('Necessita de auxílio saúde?', 'HS_Aux_saude')}
                  {formData.HS_Aux_saude === 'Sim' && (
                    <>
                      {renderInput('Descrição:', 'HS_Aux_saude_desc')}
                      {renderRadioGroup('Realiza acompanhamento?', 'HS_Aux_saude_acomp')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 2: Medicação e Fatores de Risco */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Medicação e Fatores de Risco</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Uso de medicação contínua?', 'HS_Medic_continua')}
                  {formData.HS_Medic_continua === 'Sim' &&
                    renderInput('Descrição:', 'HS_Medic_continua_desc')}
                </div>
                <div>
                  {renderRadioGroup('Uso de medicação psiquiátrica?', 'HS_Medic_psiq')}
                  {formData.HS_Medic_psiq === 'Sim' &&
                    renderInput('Descrição:', 'HS_Medic_psiq_desc')}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Fatores de Risco</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    {renderRadioGroup('Uso de Álcool?', 'FR_Alcool')}
                    {formData.FR_Alcool === 'Sim' &&
                      renderInput('Frequência:', 'FR_Alcool_freq')}
                  </div>
                  <div>
                    {renderRadioGroup('Uso de Cigarro?', 'FR_Cigarro')}
                    {formData.FR_Cigarro === 'Sim' &&
                      renderInput('Frequência:', 'FR_Cigarro_freq')}
                  </div>
                  <div>
                    {renderRadioGroup('Substâncias Psicoativas?', 'FR_Subst_psicoativas')}
                    {formData.FR_Subst_psicoativas === 'Sim' &&
                      renderInput('Frequência:', 'FR_Subst_psicoativas_freq')}
                  </div>
                </div>
                <div className="mt-4">
                  {renderRadioGroup('Possui apoio para tratamento?', 'FR_Apoio')}
                  {formData.FR_Apoio === 'Sim' &&
                    renderInput('Descrição do apoio:', 'FR_Apoio_desc')}
                </div>
              </div>
            </div>

            {/* Seção 3: Rede de Saúde e Vitimização */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Rede de Saúde e Vitimização</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Acompanhamento em rede pública?', 'RS_Acomp_publica')}
                  {formData.RS_Acomp_publica === 'Sim' &&
                    renderInput('Tipo:', 'RS_Acomp_publica_tipo')}
                </div>
                <div>
                  {renderRadioGroup('Acompanhamento RAPS?', 'RS_Acomp_RAPS')}
                  {formData.RS_Acomp_RAPS === 'Sim' && (
                    <>
                      {renderInput('Centro:', 'RS_Acomp_RAPS_centro')}
                      {renderInput('Especificação:', 'RS_Acomp_RAPS_especif')}
                    </>
                  )}
                </div>
                <div>
                  {renderRadioGroup('Possui plano de saúde?', 'RS_Plano_saude')}
                  {formData.RS_Plano_saude === 'Sim' &&
                    renderInput('Especificação:', 'RS_Plano_saude_especif')}
                </div>
                <div>
                  {renderRadioGroup('Vitimização Sexual?', 'HS_Vitim_sexual')}
                  {formData.HS_Vitim_sexual === 'Sim' && (
                    <>
                      {renderInput('Descrição:', 'HS_Vitim_sexual_desc')}
                      {renderRadioGroup('Realiza acompanhamento?', 'HS_Vitim_sexual_acomp')}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Contato de Referência na Saúde</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInput('Nome:', 'RS_Contato_nome')}
                  {renderInput('Telefone:', 'RS_Contato_tel')}
                  {renderInput('E-mail:', 'RS_Contato_email')}
                </div>
              </div>
            </div>

            {/* Seção 4: Impactos da Vitimização */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Impactos da Vitimização</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Impacto Psicológico?', 'IV_Vitim_Impacto_Psic')}
                  {formData.IV_Vitim_Impacto_Psic === 'Sim' &&
                    renderInput('Especificação:', 'IV_Vitim_Especif')}
                </div>
                <div>
                  {renderRadioGroup('Houve impacto na saúde?', 'IV_Houve_Impacto_Saude')}
                  {formData.IV_Houve_Impacto_Saude === 'Sim' && (
                    <>
                      {renderInput('Lesões não fatais:', 'IV_Lesoes_Nao_Fatais')}
                      {renderInput('Problemas de saúde:', 'IV_Problemas_De_Saude')}
                    </>
                  )}
                </div>
                <div>
                  {renderRadioGroup('Deficiência decorrente da vitimização?', 'IV_Defic_vitimizacao')}
                  {formData.IV_Defic_vitimizacao === 'Sim' &&
                    renderInput('Tipo:', 'IV_Defic_vitimizacao_tipo')}
                </div>
                <div>
                  {renderRadioGroup('Comprometimento Cognitivo/Comportamental?', 'IV_Comp_Cogn_Comport')}
                  {formData.IV_Comp_Cogn_Comport === 'Sim' &&
                    renderInput('Tipo:', 'IV_Comp_Cogn_Comport_tipo')}
                </div>
                <div>
                  {renderInput('IST/Outros:', 'IV_ISTOutros_esp')}
                </div>
                <div>
                  {renderInput('Impacto Saúde Mental (Tipos):', 'IV_Impacto_Saude_Mental_tipos')}
                </div>
                <div>
                  {renderRadioGroup('Outros impactos?', 'IV_Outro')}
                  {formData.IV_Outro === 'Sim' &&
                    renderInput('Especificação:', 'IV_Outro_espec')}
                </div>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/situacao-juridica`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/habitacao-territorio`)}
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
