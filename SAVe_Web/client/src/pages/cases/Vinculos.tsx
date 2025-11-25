import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function Vinculos() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    Qtd_Pessoas_Fam: '',
    Qtd_Filhos_Ent: '',
    Num_Filhos_Dep: '',
    Num_Enteados_Dep: '',
    Renda_Total_Conv: '',
    Alt_Fam_Com_Vitim: '',
    Alt_Fam_Com_Vitim_Descr: '',
    Vulnerab_Vinculos_Fam: '',
    Vulnerab_Vinculos_Fam_Descr: '',
    Vulnerab_Vitim_Sec_Ter: '',
    Tipo_Vitim: '',
    Tipo_Vitim_Descr: ''
  });

  const [vinculosApoio, setVinculosApoio] = useState<any[]>([]);
  const [novoVinculo, setNovoVinculo] = useState({
    AVF_Grau_Parentesco: '',
    AVF_Nome: '',
    AVF_Data_Nasc: '',
    AVF_Idade: '',
    AVF_Escolaridade: '',
    AVF_Ocupacao: '',
    AVF_Renda: '',
    AVF_Alt_Vinculo_Pos_Violencia: '',
    AVF_Presenciou_Violencia: false,
    AVF_Mora_Com_Vitima: false,
    AVF_Conhecimento_Fato: false,
    AVF_Rede_Apoio: false
  });
  const [editingVinculoId, setEditingVinculoId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.vinculos) {
        setFormData(prev => ({ ...prev, ...response.data.vinculos }));
      }
      if (response.data.vinculosApoio) {
        setVinculosApoio(response.data.vinculosApoio);
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field: string, value: any) => {
    try {
      await api.put(`/cases/${id}/vinculos`, { [field]: value });
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

  // Vinculos Apoio CRUD
  const handleAddVinculo = async () => {
    try {
      const response = await api.post(`/cases/${id}/vinculos-apoio`, novoVinculo);
      setVinculosApoio([...vinculosApoio, response.data]);
      setNovoVinculo({
        AVF_Grau_Parentesco: '',
        AVF_Nome: '',
        AVF_Data_Nasc: '',
        AVF_Idade: '',
        AVF_Escolaridade: '',
        AVF_Ocupacao: '',
        AVF_Renda: '',
        AVF_Alt_Vinculo_Pos_Violencia: '',
        AVF_Presenciou_Violencia: false,
        AVF_Mora_Com_Vitima: false,
        AVF_Conhecimento_Fato: false,
        AVF_Rede_Apoio: false
      });
    } catch (error) {
      console.error('Error adding vinculo:', error);
    }
  };

  const handleUpdateVinculo = async () => {
    if (!editingVinculoId) return;
    try {
      const response = await api.put(`/cases/${id}/vinculos-apoio/${editingVinculoId}`, novoVinculo);
      setVinculosApoio(vinculosApoio.map(v => v.ID === editingVinculoId ? response.data : v));
      setEditingVinculoId(null);
      setNovoVinculo({
        AVF_Grau_Parentesco: '',
        AVF_Nome: '',
        AVF_Data_Nasc: '',
        AVF_Idade: '',
        AVF_Escolaridade: '',
        AVF_Ocupacao: '',
        AVF_Renda: '',
        AVF_Alt_Vinculo_Pos_Violencia: '',
        AVF_Presenciou_Violencia: false,
        AVF_Mora_Com_Vitima: false,
        AVF_Conhecimento_Fato: false,
        AVF_Rede_Apoio: false
      });
    } catch (error) {
      console.error('Error updating vinculo:', error);
    }
  };

  const handleDeleteVinculo = async (vinculoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este vínculo?')) {
      try {
        await api.delete(`/cases/${id}/vinculos-apoio/${vinculoId}`);
        setVinculosApoio(vinculosApoio.filter(v => v.ID !== vinculoId));
      } catch (error) {
        console.error('Error deleting vinculo:', error);
      }
    }
  };

  const startEditing = (vinculo: any) => {
    setEditingVinculoId(vinculo.ID);
    setNovoVinculo({ ...vinculo });
  };

  const renderInput = (label: string, field: string, placeholder: string = '', type: string = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type={type}
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

            {/* Seção 1: Dados Gerais */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Dados Gerais da Família</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderInput('Qtd Pessoas Família:', 'Qtd_Pessoas_Fam', '', 'number')}
                {renderInput('Qtd Filhos/Enteados:', 'Qtd_Filhos_Ent', '', 'number')}
                {renderInput('Núm. Filhos Dependentes:', 'Num_Filhos_Dep', '', 'number')}
                {renderInput('Núm. Enteados Dependentes:', 'Num_Enteados_Dep', '', 'number')}
                {renderInput('Renda Total Conviventes:', 'Renda_Total_Conv')}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderRadioGroup('Alterações na Família com a Violência?', 'Alt_Fam_Com_Vitim')}
                  {formData.Alt_Fam_Com_Vitim === 'Sim' &&
                    renderInput('Descrição:', 'Alt_Fam_Com_Vitim_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Vulnerabilidades nos Vínculos?', 'Vulnerab_Vinculos_Fam')}
                  {formData.Vulnerab_Vinculos_Fam === 'Sim' &&
                    renderInput('Descrição:', 'Vulnerab_Vinculos_Fam_Descr')}
                </div>
                <div>
                  {renderRadioGroup('Vulnerabilidade/Vitimização Secundária/Terciária?', 'Vulnerab_Vitim_Sec_Ter')}
                  {formData.Vulnerab_Vitim_Sec_Ter === 'Sim' && (
                    <>
                      {renderInput('Tipo:', 'Tipo_Vitim')}
                      {renderInput('Descrição:', 'Tipo_Vitim_Descr')}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seção 2: Membros da Família e Apoio */}
            <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Membros da Família e Apoio</h3>

              {/* Formulário de Adição */}
              <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-200">
                <h4 className="text-md font-medium mb-3">{editingVinculoId ? 'Editar Membro' : 'Adicionar Membro'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Nome}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Nome: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Grau Parentesco"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Grau_Parentesco}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Grau_Parentesco: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Idade"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Idade}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Idade: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Escolaridade"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Escolaridade}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Escolaridade: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Ocupação"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Ocupacao}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Ocupacao: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Renda"
                    className="px-3 py-2 border rounded"
                    value={novoVinculo.AVF_Renda}
                    onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Renda: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={novoVinculo.AVF_Presenciou_Violencia}
                      onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Presenciou_Violencia: e.target.checked })}
                    />
                    <span className="text-sm">Presenciou Violência</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={novoVinculo.AVF_Mora_Com_Vitima}
                      onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Mora_Com_Vitima: e.target.checked })}
                    />
                    <span className="text-sm">Mora com Vítima</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={novoVinculo.AVF_Conhecimento_Fato}
                      onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Conhecimento_Fato: e.target.checked })}
                    />
                    <span className="text-sm">Conhecimento do Fato</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={novoVinculo.AVF_Rede_Apoio}
                      onChange={e => setNovoVinculo({ ...novoVinculo, AVF_Rede_Apoio: e.target.checked })}
                    />
                    <span className="text-sm">Rede de Apoio</span>
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  {editingVinculoId && (
                    <button
                      onClick={() => {
                        setEditingVinculoId(null);
                        setNovoVinculo({
                          AVF_Grau_Parentesco: '',
                          AVF_Nome: '',
                          AVF_Data_Nasc: '',
                          AVF_Idade: '',
                          AVF_Escolaridade: '',
                          AVF_Ocupacao: '',
                          AVF_Renda: '',
                          AVF_Alt_Vinculo_Pos_Violencia: '',
                          AVF_Presenciou_Violencia: false,
                          AVF_Mora_Com_Vitima: false,
                          AVF_Conhecimento_Fato: false,
                          AVF_Rede_Apoio: false
                        });
                      }}
                      className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={editingVinculoId ? handleUpdateVinculo : handleAddVinculo}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    <Plus size={16} className="mr-2" />
                    {editingVinculoId ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </div>

              {/* Lista de Membros */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parentesco</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rede Apoio</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vinculosApoio.map((vinculo) => (
                      <tr key={vinculo.ID}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vinculo.AVF_Nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vinculo.AVF_Grau_Parentesco}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vinculo.AVF_Idade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vinculo.AVF_Rede_Apoio ? 'Sim' : 'Não'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => startEditing(vinculo)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVinculo(vinculo.ID)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/ensino-trabalho-renda`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/protecao-seguranca`)}
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
