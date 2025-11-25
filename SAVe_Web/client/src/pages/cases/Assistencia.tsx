import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function Assistencia() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Cadastro Único
    Cad_unico: '',
    Status_cad_unico: '',

    // CRAS
    SPSB_Acesso_cras: '',
    SPSB_Contato_cras_nome: '',
    SPSB_Contato_cras_tel: '',
    SPSB_Contato_cras_email: '',
    SPSB_Nome_servico: '',
    SPSB_Endereco_servico: '',
    SPSB_Servicos_acessados: '',
    SPSB_Servicos_acessados_esp: '',

    // CREAS
    SPSEMC_Acesso_creas: '',
    SPSEMC_Contato_creas_nome: '',
    SPSEMC_Contato_creas_tel: '',
    SPSEMC_Contato_creas_email: '',
    SPSEMC_Nome_servico: '',
    SPSEMC_Endereco_servico: '',
    SPSEMC_Servicos_acessados: '',
    SPSEMC_Servicos_acessados_esp: '',

    // Acolhimento
    SPSEAC_Inserido_acolhimentoInst: '',
    SPSEAC_Inserido_acolhimentorep: '',
    SPSEAC_acolhimentorep_desc: '',
    SPSEAC_Modalidade_acolhimentoInst: '',
    SPSEAC_Inserido_familia: '',
    SPSEAC_nome_familia: '',
    SPSEAC_Inserido_calamidade: '',
    SPSEAC_desc_calamidade: '',
    SPSEAC_tec_ref_nome: '',
    SPSEAC_tec_ref_tel: '',
    SPSEAC_tec_ref_email: '',
    SPSEAC_nome_servico: '',
    SPSEAC_endereco_servico: '',

    // Benefícios
    BSA_recebe_beneficios: '',
    BSA_Tipo_beneficio: '',
    BSA_transf_renda_inf: '',
    BSA_transf_renda_esp: '',
    BSA_Ben_trab_inf: '',
    BSA_Ben_trab_esp: '',
    BSA_Ben_hab_inf: '',
    BSA_Ben_hab_esp: '',
    BSA_Ben_as_inf: '',
    BSA_Ben_as_esp: '',
    BSA_Ben_educ_inf: '',
    BSA_Ben_educ_esp: '',
    BSA_Ben_atr_inf: '',
    BSA_Ben_atr_esp: '',
    BSA_Ben_pdi_inf: '',
    BSA_Ben_pdi_esp: '',
    BSA_Ben_emer_inf: '',
    BSA_Ben_emer_esp: '',
    BSA_outras_formas: '',
    BSA_direito_beneficios: '',
    BSA_direito_beneficios_esp: '',

    // Segurança Alimentar e Demandas
    BSA_seg_alimentar: '',
    BSA_demandas_assist: '',
    BSA_demandas_assist_desc: '',
    BSA_tec_ref_nome: '',
    BSA_tec_ref_tel: '',
    BSA_tec_ref_email: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.assistencia) {
        setFormData(prev => ({ ...prev, ...response.data.assistencia }));
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/assistencia`, { [field]: value });
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
        value={formData[field as keyof typeof formData] || ''}
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

            {/* Seção 1: Cadastro Único */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Cadastro Único</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Possui CadÚnico?', 'Cad_unico')}
                {formData.Cad_unico === 'Sim' &&
                  renderInput('Status:', 'Status_cad_unico')}
              </div>
            </div>

            {/* Seção 2: Acesso ao CRAS */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Acesso ao CRAS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Acesso ao CRAS?', 'SPSB_Acesso_cras')}
                {formData.SPSB_Acesso_cras === 'Sim' && (
                  <>
                    {renderInput('Nome do Serviço:', 'SPSB_Nome_servico')}
                    {renderInput('Endereço:', 'SPSB_Endereco_servico')}
                    {renderInput('Contato Nome:', 'SPSB_Contato_cras_nome')}
                    {renderInput('Contato Tel:', 'SPSB_Contato_cras_tel')}
                    {renderInput('Contato Email:', 'SPSB_Contato_cras_email')}
                    {renderInput('Serviços Acessados:', 'SPSB_Servicos_acessados')}
                    {renderInput('Especificação:', 'SPSB_Servicos_acessados_esp')}
                  </>
                )}
              </div>
            </div>

            {/* Seção 3: Acesso ao CREAS */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Acesso ao CREAS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Acesso ao CREAS?', 'SPSEMC_Acesso_creas')}
                {formData.SPSEMC_Acesso_creas === 'Sim' && (
                  <>
                    {renderInput('Nome do Serviço:', 'SPSEMC_Nome_servico')}
                    {renderInput('Endereço:', 'SPSEMC_Endereco_servico')}
                    {renderInput('Contato Nome:', 'SPSEMC_Contato_creas_nome')}
                    {renderInput('Contato Tel:', 'SPSEMC_Contato_creas_tel')}
                    {renderInput('Contato Email:', 'SPSEMC_Contato_creas_email')}
                    {renderInput('Serviços Acessados:', 'SPSEMC_Servicos_acessados')}
                    {renderInput('Especificação:', 'SPSEMC_Servicos_acessados_esp')}
                  </>
                )}
              </div>
            </div>

            {/* Seção 4: Acolhimento */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Acolhimento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Inserido em Acolhimento Institucional?', 'SPSEAC_Inserido_acolhimentoInst')}
                  {formData.SPSEAC_Inserido_acolhimentoInst === 'Sim' &&
                    renderInput('Modalidade:', 'SPSEAC_Modalidade_acolhimentoInst')}
                </div>
                <div>
                  {renderRadioGroup('Inserido em Acolhimento em República?', 'SPSEAC_Inserido_acolhimentorep')}
                  {formData.SPSEAC_Inserido_acolhimentorep === 'Sim' &&
                    renderInput('Descrição:', 'SPSEAC_acolhimentorep_desc')}
                </div>
                <div>
                  {renderRadioGroup('Inserido em Família Acolhedora?', 'SPSEAC_Inserido_familia')}
                  {formData.SPSEAC_Inserido_familia === 'Sim' &&
                    renderInput('Nome Família:', 'SPSEAC_nome_familia')}
                </div>
                <div>
                  {renderRadioGroup('Inserido em Abrigo Calamidade?', 'SPSEAC_Inserido_calamidade')}
                  {formData.SPSEAC_Inserido_calamidade === 'Sim' &&
                    renderInput('Descrição:', 'SPSEAC_desc_calamidade')}
                </div>
                <div className="col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">Dados do Serviço de Acolhimento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput('Nome Serviço:', 'SPSEAC_nome_servico')}
                    {renderInput('Endereço:', 'SPSEAC_endereco_servico')}
                    {renderInput('Técnico Ref. Nome:', 'SPSEAC_tec_ref_nome')}
                    {renderInput('Técnico Ref. Tel:', 'SPSEAC_tec_ref_tel')}
                    {renderInput('Técnico Ref. Email:', 'SPSEAC_tec_ref_email')}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção 5: Benefícios Sociais */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Benefícios Sociais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Recebe Benefícios?', 'BSA_recebe_beneficios')}
                {formData.BSA_recebe_beneficios === 'Sim' && (
                  <>
                    {renderInput('Tipo Benefício:', 'BSA_Tipo_beneficio')}

                    <div className="col-span-2 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">Detalhes dos Benefícios</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('Transferência de Renda (Inf):', 'BSA_transf_renda_inf')}
                        {renderInput('Transferência de Renda (Esp):', 'BSA_transf_renda_esp')}

                        {renderInput('Benefício Trabalho (Inf):', 'BSA_Ben_trab_inf')}
                        {renderInput('Benefício Trabalho (Esp):', 'BSA_Ben_trab_esp')}

                        {renderInput('Benefício Habitação (Inf):', 'BSA_Ben_hab_inf')}
                        {renderInput('Benefício Habitação (Esp):', 'BSA_Ben_hab_esp')}

                        {renderInput('Benefício Assistência (Inf):', 'BSA_Ben_as_inf')}
                        {renderInput('Benefício Assistência (Esp):', 'BSA_Ben_as_esp')}

                        {renderInput('Benefício Educação (Inf):', 'BSA_Ben_educ_inf')}
                        {renderInput('Benefício Educação (Esp):', 'BSA_Ben_educ_esp')}
                      </div>
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  {renderRadioGroup('Tem direito a benefícios não acessados?', 'BSA_direito_beneficios')}
                  {formData.BSA_direito_beneficios === 'Sim' &&
                    renderInput('Especifique:', 'BSA_direito_beneficios_esp')}
                </div>
              </div>
            </div>

            {/* Seção 6: Segurança Alimentar e Demandas */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Segurança Alimentar e Demandas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('Segurança Alimentar:', 'BSA_seg_alimentar')}

                <div>
                  {renderRadioGroup('Possui demandas de assistência?', 'BSA_demandas_assist')}
                  {formData.BSA_demandas_assist === 'Sim' &&
                    renderInput('Descrição:', 'BSA_demandas_assist_desc')}
                </div>

                <div className="col-span-2 mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">Técnico de Referência (Geral)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderInput('Nome:', 'BSA_tec_ref_nome')}
                    {renderInput('Telefone:', 'BSA_tec_ref_tel')}
                    {renderInput('Email:', 'BSA_tec_ref_email')}
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/habitacao-territorio`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/ensino-trabalho-renda`)}
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
