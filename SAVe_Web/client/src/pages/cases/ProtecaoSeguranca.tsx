import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function ProtecaoSeguranca() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    PS_Natureza_Ameaca: '',
    PS_Natureza_Ameaca_Especif: '',
    PS_Como_Ameaca: '',
    PS_Tempo_Ameaca: '',
    PS_Ameaca_Autor_Vitim: '',
    PS_Ameaca_Conhece: '',
    PS_Ameaca_Mais_Autor: '',
    PS_Tipo_Relacao: '',
    PS_Tipo_Relacao_Especif: '',
    PS_Reside_Com_Autor: '',
    PS_Relacao_Poder: '',
    PS_Relacao_Poder_Especif: '',
    PS_Ameacas_Anteriores: '',
    PS_Ameacas_Anteriores_Especif: '',
    PS_Ameaca_Agente_Publico: '',
    PS_Ameaca_Agente_Instituicao: '',
    PS_Ameaca_Agente_Instituicao_Especif: '',
    PS_Ameaca_Org_Criminosa: '',
    PS_Ameaca_Org_Criminosa_Especif: '',
    PS_Regiao_Abrangencia_Ameaca: '',
    PS_Ameaca_Meios_Concretizar: '',
    PS_Ameaca_Meios_Concretizar_Especif: '',
    PS_Sendo_Perseguido: '',
    PS_Perseguido_Descr: '',
    PS_Autor_Acesso_Armas: '',
    PS_Acesso_Armas_Descr: '',
    PS_Violencia_Pos_Ameaca: '',
    PS_Violencia_Pos_Ameaca_Descr: '',
    PS_Ameaca_Repercussoes_Soc: '',
    PS_Repercussoes_Soc_Descr: '',
    PS_Ameaca_Extensao_Familia: '',
    PS_Extensao_Familia_Descr: '',
    PS_Ameaca_Crianca_Adolescente: '',
    PS_Liberdade_Limitada: '',
    PS_Liberdade_Limitada_Descr: '',
    PS_Impactos_Emocionais_Psic: '',
    PS_Impactos_Emocionais_Psic_Descr: '',
    PS_Impactos_Financeiros: '',
    PS_Impactos_Financeiros_Descr: '',
    PS_Nao_Sente_Segura_Mudar: '',
    PS_Nao_Sente_Segura_Mudar_Descr: '',
    PS_Possui_Rede_Apoio_Fam: '',
    PS_Rede_Apoio_Fam_Descr: '',
    PS_Possui_Rede_Comunitaria: '',
    PS_Rede_Comunitaria_Descr: '',
    PS_Possui_Equip_Seguranca: '',
    PS_Equip_Seguranca_Descr: '',
    PS_Possivel_Deslocamento_Seguro: '',
    PS_Deslocamento_Seguro_Descr: '',
    PS_Servicos_Prot_Social: '',
    PS_Servicos_Prot_Social_Especif: '',
    PS_Servicos_Acolhimento_Emerg: '',
    PS_Servicos_Acolhimento_Especif: '',
    PS_Programas_Protecao: '',
    PS_Programas_Protecao_Especif: '',
    PS_Vitima_Capaz_Ingressar_Prog: '',
    PS_Providencia_Realizada: '',
    PS_Providencia_Realizada_Descr: '',
    PS_Vitima_Violencia_Domestica: '',
    PS_Vitima_Crime_Odio: '',
    PS_Rede_Aplicou_Protocolo_FF: '',
    PS_Rede_Aplicou_Protocolo_Roger: '',
    PS_Deseja_Aplicar_FONAR: '',
    PS_Situacao_ameaca_relat: ''
  });

  const [ameacadores, setAmeacadores] = useState<any[]>([]);
  const [adolescentes, setAdolescentes] = useState<any[]>([]);

  const [novoAmeacador, setNovoAmeacador] = useState({ PSA_Nome_Ameacadores: '' });
  const [novoAdolescente, setNovoAdolescente] = useState({ PS_ADOLESCENTE_Nome: '', PS_ADOLESCENTE_Idade: '' });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.protecao) {
        setFormData(prev => ({ ...prev, ...response.data.protecao }));
      }
      if (response.data.ameacadores) {
        setAmeacadores(response.data.ameacadores);
      }
      if (response.data.adolescentes) {
        setAdolescentes(response.data.adolescentes);
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/protecao`, { [field]: value });
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

  // CRUD Ameacadores
  const handleAddAmeacador = async () => {
    if (!novoAmeacador.PSA_Nome_Ameacadores) return;
    try {
      const response = await api.post(`/cases/${id}/ameacadores`, novoAmeacador);
      setAmeacadores([...ameacadores, response.data]);
      setNovoAmeacador({ PSA_Nome_Ameacadores: '' });
    } catch (error) {
      console.error('Error adding ameacador:', error);
    }
  };

  const handleDeleteAmeacador = async (ameacadorId: number) => {
    try {
      await api.delete(`/cases/${id}/ameacadores/${ameacadorId}`);
      setAmeacadores(ameacadores.filter(a => a.ID !== ameacadorId));
    } catch (error) {
      console.error('Error deleting ameacador:', error);
    }
  };

  // CRUD Adolescentes
  const handleAddAdolescente = async () => {
    if (!novoAdolescente.PS_ADOLESCENTE_Nome) return;
    try {
      const response = await api.post(`/cases/${id}/adolescentes-ameacados`, novoAdolescente);
      setAdolescentes([...adolescentes, response.data]);
      setNovoAdolescente({ PS_ADOLESCENTE_Nome: '', PS_ADOLESCENTE_Idade: '' });
    } catch (error) {
      console.error('Error adding adolescente:', error);
    }
  };

  const handleDeleteAdolescente = async (adolescenteId: number) => {
    try {
      await api.delete(`/cases/${id}/adolescentes-ameacados/${adolescenteId}`);
      setAdolescentes(adolescentes.filter(a => a.ID !== adolescenteId));
    } catch (error) {
      console.error('Error deleting adolescente:', error);
    }
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

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Seção 1: Natureza e Tempo */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Natureza e Tempo da Ameaça</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderInput('Natureza da Ameaça:', 'PS_Natureza_Ameaca')}
                  {renderInput('Especificação:', 'PS_Natureza_Ameaca_Especif')}
                </div>
                <div>
                  {renderInput('Como a ameaça é feita:', 'PS_Como_Ameaca')}
                  {renderInput('Tempo de Ameaça:', 'PS_Tempo_Ameaca')}
                </div>
              </div>
            </div>

            {/* Seção 2: Autor da Ameaça */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Autor da Ameaça</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Ameaça parte do autor da violência?', 'PS_Ameaca_Autor_Vitim')}
                {renderRadioGroup('Conhece o autor?', 'PS_Ameaca_Conhece')}
                {renderRadioGroup('Reside com o autor?', 'PS_Reside_Com_Autor')}
                {renderRadioGroup('Há relação de poder?', 'PS_Relacao_Poder')}
                {formData.PS_Relacao_Poder === 'Sim' &&
                  renderInput('Especificação:', 'PS_Relacao_Poder_Especif')}
                <div>
                  {renderInput('Tipo de Relação:', 'PS_Tipo_Relacao')}
                  {renderInput('Especificação:', 'PS_Tipo_Relacao_Especif')}
                </div>
              </div>

              {/* Lista de Ameaçadores */}
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Nomes dos Ameaçadores</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nome do Ameaçador"
                    className="flex-1 px-3 py-2 border rounded"
                    value={novoAmeacador.PSA_Nome_Ameacadores}
                    onChange={e => setNovoAmeacador({ PSA_Nome_Ameacadores: e.target.value })}
                  />
                  <button
                    onClick={handleAddAmeacador}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {ameacadores.map(a => (
                    <li key={a.ID} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{a.PSA_Nome_Ameacadores}</span>
                      <button onClick={() => handleDeleteAmeacador(a.ID)} className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seção 3: Histórico e Contexto */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Histórico e Contexto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Ameaças Anteriores?', 'PS_Ameacas_Anteriores')}
                  {formData.PS_Ameacas_Anteriores === 'Sim' &&
                    renderInput('Descrição:', 'PS_Ameacas_Anteriores_Especif')}
                </div>
                <div>
                  {renderRadioGroup('Ameaça por Agente Público?', 'PS_Ameaca_Agente_Publico')}
                  {formData.PS_Ameaca_Agente_Publico === 'Sim' && (
                    <>
                      {renderInput('Instituição:', 'PS_Ameaca_Agente_Instituicao')}
                      {renderInput('Especificação:', 'PS_Ameaca_Agente_Instituicao_Especif')}
                    </>
                  )}
                </div>
                <div>
                  {renderRadioGroup('Ameaça por Org. Criminosa?', 'PS_Ameaca_Org_Criminosa')}
                  {formData.PS_Ameaca_Org_Criminosa === 'Sim' &&
                    renderInput('Especificação:', 'PS_Ameaca_Org_Criminosa_Especif')}
                </div>
                {renderInput('Região de Abrangência:', 'PS_Regiao_Abrangencia_Ameaca')}
              </div>
            </div>

            {/* Seção 4: Meios e Perseguição */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Meios e Perseguição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderInput('Meios para concretizar:', 'PS_Ameaca_Meios_Concretizar')}
                  {renderInput('Especificação:', 'PS_Ameaca_Meios_Concretizar_Especif')}
                </div>
                <div>
                  {renderRadioGroup('Sendo Perseguido?', 'PS_Sendo_Perseguido')}
                  {formData.PS_Sendo_Perseguido === 'Sim' &&
                    renderInput('Descrição:', 'PS_Perseguido_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Autor tem acesso a armas?', 'PS_Autor_Acesso_Armas')}
                  {formData.PS_Autor_Acesso_Armas === 'Sim' &&
                    renderInput('Descrição:', 'PS_Acesso_Armas_Descr')}
                </div>
              </div>
            </div>

            {/* Seção 5: Impactos e Repercussões */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Impactos e Repercussões</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Violência Pós-Ameaça?', 'PS_Violencia_Pos_Ameaca')}
                  {formData.PS_Violencia_Pos_Ameaca === 'Sim' &&
                    renderInput('Descrição:', 'PS_Violencia_Pos_Ameaca_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Repercussões Sociais?', 'PS_Ameaca_Repercussoes_Soc')}
                  {formData.PS_Ameaca_Repercussoes_Soc === 'Sim' &&
                    renderInput('Descrição:', 'PS_Repercussoes_Soc_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Extensão à Família?', 'PS_Ameaca_Extensao_Familia')}
                  {formData.PS_Ameaca_Extensao_Familia === 'Sim' &&
                    renderInput('Descrição:', 'PS_Extensao_Familia_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Liberdade Limitada?', 'PS_Liberdade_Limitada')}
                  {formData.PS_Liberdade_Limitada === 'Sim' &&
                    renderInput('Descrição:', 'PS_Liberdade_Limitada_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Impactos Emocionais?', 'PS_Impactos_Emocionais_Psic')}
                  {formData.PS_Impactos_Emocionais_Psic === 'Sim' &&
                    renderInput('Descrição:', 'PS_Impactos_Emocionais_Psic_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Impactos Financeiros?', 'PS_Impactos_Financeiros')}
                  {formData.PS_Impactos_Financeiros === 'Sim' &&
                    renderInput('Descrição:', 'PS_Impactos_Financeiros_Descr')}
                </div>
              </div>

              {/* Lista de Adolescentes Ameaçados */}
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Crianças/Adolescentes Ameaçados</h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="flex-1 px-3 py-2 border rounded"
                    value={novoAdolescente.PS_ADOLESCENTE_Nome}
                    onChange={e => setNovoAdolescente({ ...novoAdolescente, PS_ADOLESCENTE_Nome: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Idade"
                    className="w-24 px-3 py-2 border rounded"
                    value={novoAdolescente.PS_ADOLESCENTE_Idade}
                    onChange={e => setNovoAdolescente({ ...novoAdolescente, PS_ADOLESCENTE_Idade: e.target.value })}
                  />
                  <button
                    onClick={handleAddAdolescente}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {adolescentes.map(a => (
                    <li key={a.ID} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{a.PS_ADOLESCENTE_Nome} ({a.PS_ADOLESCENTE_Idade} anos)</span>
                      <button onClick={() => handleDeleteAdolescente(a.ID)} className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seção 6: Rede de Apoio e Segurança */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Rede de Apoio e Segurança</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Possui Rede de Apoio Familiar?', 'PS_Possui_Rede_Apoio_Fam')}
                  {formData.PS_Possui_Rede_Apoio_Fam === 'Sim' &&
                    renderInput('Descrição:', 'PS_Rede_Apoio_Fam_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Possui Rede Comunitária?', 'PS_Possui_Rede_Comunitaria')}
                  {formData.PS_Possui_Rede_Comunitaria === 'Sim' &&
                    renderInput('Descrição:', 'PS_Rede_Comunitaria_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Possui Equip. Segurança?', 'PS_Possui_Equip_Seguranca')}
                  {formData.PS_Possui_Equip_Seguranca === 'Sim' &&
                    renderInput('Descrição:', 'PS_Equip_Seguranca_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Possível Deslocamento Seguro?', 'PS_Possivel_Deslocamento_Seguro')}
                  {formData.PS_Possivel_Deslocamento_Seguro === 'Sim' &&
                    renderInput('Descrição:', 'PS_Deslocamento_Seguro_Descr')}
                </div>
              </div>
            </div>

            {/* Seção 7: Serviços e Programas */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Serviços e Programas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Acessa Serviços de Proteção Social?', 'PS_Servicos_Prot_Social')}
                  {formData.PS_Servicos_Prot_Social === 'Sim' &&
                    renderInput('Especificação:', 'PS_Servicos_Prot_Social_Especif')}
                </div>
                <div>
                  {renderRadioGroup('Acessa Acolhimento Emergencial?', 'PS_Servicos_Acolhimento_Emerg')}
                  {formData.PS_Servicos_Acolhimento_Emerg === 'Sim' &&
                    renderInput('Especificação:', 'PS_Servicos_Acolhimento_Especif')}
                </div>
                <div>
                  {renderRadioGroup('Inserido em Programa de Proteção?', 'PS_Programas_Protecao')}
                  {formData.PS_Programas_Protecao === 'Sim' &&
                    renderInput('Especificação:', 'PS_Programas_Protecao_Especif')}
                </div>
                {renderRadioGroup('Capaz de Ingressar em Programa?', 'PS_Vitima_Capaz_Ingressar_Prog')}
              </div>
            </div>

            {/* Seção 8: Protocolos */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Protocolos e Classificações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderRadioGroup('Vítima de Violência Doméstica?', 'PS_Vitima_Violencia_Domestica')}
                {renderRadioGroup('Vítima de Crime de Ódio?', 'PS_Vitima_Crime_Odio')}
                {renderRadioGroup('Aplicou Protocolo Formulário de Risco?', 'PS_Rede_Aplicou_Protocolo_FF')}
                {renderRadioGroup('Aplicou Protocolo Roger?', 'PS_Rede_Aplicou_Protocolo_Roger')}
                {renderRadioGroup('Deseja Aplicar FONAR?', 'PS_Deseja_Aplicar_FONAR')}
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/vinculos`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/agressor`)}
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
