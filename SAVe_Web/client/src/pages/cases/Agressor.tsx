import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';
import { Trash2, Plus, Edit2, ArrowLeft } from 'lucide-react';

export default function Agressor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [agressores, setAgressores] = useState<any[]>([]);
  const [enderecos, setEnderecos] = useState<any[]>([]); // All addresses for the case

  const [editingAgressorId, setEditingAgressorId] = useState<number | null>(null);
  const [currentAgressor, setCurrentAgressor] = useState<any>({});

  // New Address State
  const [novoEndereco, setNovoEndereco] = useState({
    PAE_Situacao_Moradia: '',
    PAE_Endereco: '',
    PAE_Numero: '',
    PAE_Complemento: '',
    PAE_Bairro: '',
    PAE_Cidade: '',
    PAE_UF: '',
    PAE_CEP: ''
  });

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const response = await api.get(`/cases/${id}`);
      if (response.data.agressores) {
        setAgressores(response.data.agressores);
      }
      if (response.data.agressorEnderecos) {
        setEnderecos(response.data.agressorEnderecos);
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agressor CRUD
  const handleCreateAgressor = async () => {
    try {
      const response = await api.post(`/cases/${id}/agressores`, {
        PA_Tipo_Agressor: 'Pessoa Física', // Default
        PA_Nome_Civil: 'Novo Agressor'
      });
      setAgressores([...agressores, response.data]);
      handleEditAgressor(response.data);
    } catch (error) {
      console.error('Error creating agressor:', error);
    }
  };

  const handleEditAgressor = (agressor: any) => {
    setEditingAgressorId(agressor.ID);
    setCurrentAgressor({ ...agressor });
  };

  const handleUpdateAgressor = async () => {
    if (!editingAgressorId) return;
    try {
      const response = await api.put(`/cases/${id}/agressores/${editingAgressorId}`, currentAgressor);
      setAgressores(agressores.map(a => a.ID === editingAgressorId ? response.data : a));
      alert('Agressor salvo com sucesso!');
    } catch (error) {
      console.error('Error updating agressor:', error);
    }
  };

  const handleDeleteAgressor = async (agressorId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este agressor?')) {
      try {
        await api.delete(`/cases/${id}/agressores/${agressorId}`);
        setAgressores(agressores.filter(a => a.ID !== agressorId));
        if (editingAgressorId === agressorId) {
          setEditingAgressorId(null);
        }
      } catch (error) {
        console.error('Error deleting agressor:', error);
      }
    }
  };

  // Address CRUD
  const handleAddAddress = async () => {
    if (!editingAgressorId) return;
    try {
      const response = await api.post(`/cases/${id}/agressores-enderecos`, {
        ...novoEndereco,
        ID_Perfil_Agressor: editingAgressorId
      });
      setEnderecos([...enderecos, response.data]);
      setNovoEndereco({
        PAE_Situacao_Moradia: '',
        PAE_Endereco: '',
        PAE_Numero: '',
        PAE_Complemento: '',
        PAE_Bairro: '',
        PAE_Cidade: '',
        PAE_UF: '',
        PAE_CEP: ''
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDeleteAddress = async (enderecoId: number) => {
    try {
      await api.delete(`/cases/${id}/agressores-enderecos/${enderecoId}`);
      setEnderecos(enderecos.filter(e => e.ID !== enderecoId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const renderInput = (label: string, field: string, placeholder: string = '') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded"
        placeholder={placeholder}
        value={currentAgressor[field] || ''}
        onChange={(e) => setCurrentAgressor({ ...currentAgressor, [field]: e.target.value })}
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
              checked={currentAgressor[field] === option}
              onChange={(e) => setCurrentAgressor({ ...currentAgressor, [field]: e.target.value })}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  // Filter addresses for current agressor
  const currentAddresses = enderecos.filter(e => e.ID_Perfil_Agressor === editingAgressorId);

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <FormNavigation steps={formStepsComplete} caseId={id} />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {!editingAgressorId ? (
              // List View
              <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Perfil do Agressor</h3>
                  <button
                    onClick={handleCreateAgressor}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Agressor
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agressores.map(agressor => (
                    <div key={agressor.ID} className="bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-800 mb-2">{agressor.PA_Nome_Civil || agressor.PA_Razao_Social || 'Sem Nome'}</h4>
                      <p className="text-sm text-gray-600 mb-4">{agressor.PA_Tipo_Agressor}</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditAgressor(agressor)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAgressor(agressor.ID)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {agressores.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-8">Nenhum agressor cadastrado.</p>
                  )}
                </div>
              </div>
            ) : (
              // Detail View
              <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => setEditingAgressorId(null)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800">Editar Agressor</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {renderRadioGroup('Tipo de Agressor', 'PA_Tipo_Agressor', ['Pessoa Física', 'Pessoa Jurídica'])}

                  {currentAgressor.PA_Tipo_Agressor === 'Pessoa Jurídica' ? (
                    <>
                      {renderInput('Razão Social', 'PA_Razao_Social')}
                      {renderInput('CNPJ', 'PA_CNPJ')}
                      {renderInput('Endereço', 'PA_Endereco_Juridica')}
                    </>
                  ) : (
                    <>
                      {renderInput('Nome Civil', 'PA_Nome_Civil')}
                      {renderInput('Nome Social', 'PA_Nome_Social')}
                      {renderInput('Filiação (Pai)', 'PA_Filiacao_Pai')}
                      {renderInput('Filiação (Mãe)', 'PA_Filiacao_Mae')}
                      {renderInput('Data de Nascimento', 'PA_Data_Nascimento')}
                      {renderInput('Idade', 'PA_Idade_Aprox')}
                      {renderInput('Apelido', 'PA_Apelido')}
                      {renderInput('Naturalidade', 'PA_Naturalidade')}
                      {renderInput('Nacionalidade', 'PA_Nacionalidade')}
                      {renderInput('CPF', 'PA_CPF')}
                      {renderInput('RG', 'PA_RG')}
                      {renderInput('Sexo', 'PA_Sexo')}
                      {renderInput('Identidade de Gênero', 'PA_Identidade_Genero')}
                      {renderInput('Orientação Sexual', 'PA_Orientacao_Sexual')}
                      {renderInput('Raça/Cor/Etnia', 'PA_Raca_Cor_Etnia')}
                      {renderInput('Religião', 'PA_Religiao')}
                      {renderInput('Estado Civil', 'PA_Estado_Civil')}
                    </>
                  )}
                  {renderRadioGroup('Vítima de Múltiplos Agressores?', 'PA_Vitima_Multiplos_Agress')}
                </div>

                <div className="flex justify-end mb-8">
                  <button
                    onClick={handleUpdateAgressor}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Salvar Alterações
                  </button>
                </div>

                {/* Endereços do Agressor */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-bold text-gray-800 mb-4">Endereços do Agressor</h4>

                  <div className="bg-gray-50 p-4 rounded mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Situação Moradia"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_Situacao_Moradia}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_Situacao_Moradia: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Endereço"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_Endereco}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_Endereco: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_Numero}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_Numero: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_Bairro}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_Bairro: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Cidade"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_Cidade}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_Cidade: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        className="px-3 py-2 border rounded"
                        value={novoEndereco.PAE_UF}
                        onChange={e => setNovoEndereco({ ...novoEndereco, PAE_UF: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                    >
                      Adicionar Endereço
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {currentAddresses.map(addr => (
                      <li key={addr.ID} className="flex justify-between items-center bg-white border p-3 rounded">
                        <span className="text-sm text-gray-700">
                          {addr.PAE_Endereco}, {addr.PAE_Numero} - {addr.PAE_Bairro}, {addr.PAE_Cidade}/{addr.PAE_UF}
                        </span>
                        <button onClick={() => handleDeleteAddress(addr.ID)} className="text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                    {currentAddresses.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Nenhum endereço cadastrado para este agressor.</p>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <button
                onClick={() => navigate(`/cases/${id}/protecao-seguranca`)}
                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate(`/cases/${id}/vitimizacao`)}
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
