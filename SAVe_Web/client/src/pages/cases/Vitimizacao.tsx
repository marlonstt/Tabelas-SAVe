import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';

export default function Vitimizacao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // Vitimização Secundária
    VST_Dep_repet_reviti: '',
    VST_Espec_Dep_repet_reviti: '',
    VST_Falta_atend_esp: '',
    VST_Espec_Falta_atend_esp: '',
    VST_Falta_info: '',
    VST_Espec_Falta_info: '',
    VST_Demora_sist_just: '',
    VST_Espec_Demora_sist_just: '',
    VST_Expos_vitima: '',
    VST_Espec_Expos_vitima: '',
    VST_Neg_part_proc: '',
    VST_Espec_Neg_part_proc: '',
    VST_Neg_apres_prova: '',
    VST_Espec_Neg_apres_prova: '',
    VST_Neg_acesso_dir: '',
    VST_Espec_Neg_acesso_dir: '',
    VST_Desresp_sigilo: '',
    VST_Espec_Desresp_sigilo: '',
    VST_Desresp_nome_soc: '',
    VST_Espec_Desresp_nome_soc: '',
    VST_Outras_vit: '',
    VST_Espec_Outras_vit: '',

    // Vitimização Terciária
    VT_Culpa_vit: '',
    VT_Espec_Culpa_vit: '',
    VT_Estig_social: '',
    VT_Espec_Estig_social: '',
    VT_Falta_Poli_publicas: '',
    VT_Espec_Falta_Poli_publicas: '',
    VT_Explo_midiatica: '',
    VT_Espec_Explo_midiatica: '',
    VT_Outras_vit: '',
    VT_Espec_Outras_vit: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.vitimizacao) {
        setFormData(prev => ({ ...prev, ...response.data.vitimizacao }));
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/vitimizacao`, { [field]: value });
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
          checked={formData[checkboxField as keyof typeof formData] === 'Sim'}
          onChange={(e) => {
            const val = e.target.checked ? 'Sim' : 'Não';
            handleChange(checkboxField, val);
            handleSave(checkboxField, val);
          }}
          className="h-5 w-5 text-indigo-600"
        />
        <span className="text-gray-700 font-medium">{label}</span>
      </label>
      {formData[checkboxField as keyof typeof formData] === 'Sim' && (
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

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Vitimização Secundária */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Vitimização Secundária (Sistema de Justiça)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCheckboxWithInput('Depoimento Repetitivo / Revitimização', 'VST_Dep_repet_reviti', 'VST_Espec_Dep_repet_reviti')}
                {renderCheckboxWithInput('Falta de Atendimento Especializado', 'VST_Falta_atend_esp', 'VST_Espec_Falta_atend_esp')}
                {renderCheckboxWithInput('Falta de Informação', 'VST_Falta_info', 'VST_Espec_Falta_info')}
                {renderCheckboxWithInput('Demora do Sistema de Justiça', 'VST_Demora_sist_just', 'VST_Espec_Demora_sist_just')}
                {renderCheckboxWithInput('Exposição da Vítima', 'VST_Expos_vitima', 'VST_Espec_Expos_vitima')}
                {renderCheckboxWithInput('Negativa de Participação no Processo', 'VST_Neg_part_proc', 'VST_Espec_Neg_part_proc')}
                {renderCheckboxWithInput('Negativa de Apresentação de Provas', 'VST_Neg_apres_prova', 'VST_Espec_Neg_apres_prova')}
                {renderCheckboxWithInput('Negativa de Acesso a Direitos', 'VST_Neg_acesso_dir', 'VST_Espec_Neg_acesso_dir')}
                {renderCheckboxWithInput('Desrespeito ao Sigilo', 'VST_Desresp_sigilo', 'VST_Espec_Desresp_sigilo')}
                {renderCheckboxWithInput('Desrespeito ao Nome Social', 'VST_Desresp_nome_soc', 'VST_Espec_Desresp_nome_soc')}
                {renderCheckboxWithInput('Outras', 'VST_Outras_vit', 'VST_Espec_Outras_vit')}
              </div>
            </div>

            {/* Seção 2: Vitimização Terciária */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Vitimização Terciária (Social/Comunitária)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCheckboxWithInput('Culpabilização da Vítima', 'VT_Culpa_vit', 'VT_Espec_Culpa_vit')}
                {renderCheckboxWithInput('Estigmatização Social', 'VT_Estig_social', 'VT_Espec_Estig_social')}
                {renderCheckboxWithInput('Falta de Políticas Públicas', 'VT_Falta_Poli_publicas', 'VT_Espec_Falta_Poli_publicas')}
                {renderCheckboxWithInput('Exploração Midiática', 'VT_Explo_midiatica', 'VT_Espec_Explo_midiatica')}
                {renderCheckboxWithInput('Outras', 'VT_Outras_vit', 'VT_Espec_Outras_vit')}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/agressor`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/sintese-analitica`)}
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
