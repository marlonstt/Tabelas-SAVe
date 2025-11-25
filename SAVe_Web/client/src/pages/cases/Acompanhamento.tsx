import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete } from '../../config/formSteps';
import api from '../../services/api';
import { Trash2, Plus, Edit2, Calendar, FileText } from 'lucide-react';

export default function Acompanhamento() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [acompanhamentos, setAcompanhamentos] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        Data: '',
        Tipo_Atendimento: '',
        Sintese: '',
        Encaminhamento: '',
        Encaminhamento_Rede: '',
        Especifique_Encaminhamento: '',
        Responsaveis: ''
    });

    useEffect(() => {
        if (id) {
            fetchAcompanhamentos();
        }
    }, [id]);

    const fetchAcompanhamentos = async () => {
        try {
            const response = await api.get(`/cases/${id}`);
            if (response.data.acompanhamentos) {
                setAcompanhamentos(response.data.acompanhamentos);
            }
        } catch (error) {
            console.error('Error fetching acompanhamentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            Data: '',
            Tipo_Atendimento: '',
            Sintese: '',
            Encaminhamento: '',
            Encaminhamento_Rede: '',
            Especifique_Encaminhamento: '',
            Responsaveis: ''
        });
        setEditingId(null);
    };

    const handleCreate = async () => {
        try {
            const response = await api.post(`/cases/${id}/acompanhamentos`, formData);
            setAcompanhamentos([...acompanhamentos, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error creating acompanhamento:', error);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {
            const response = await api.put(`/cases/${id}/acompanhamentos/${editingId}`, formData);
            setAcompanhamentos(acompanhamentos.map(a => a.ID === editingId ? response.data : a));
            resetForm();
        } catch (error) {
            console.error('Error updating acompanhamento:', error);
        }
    };

    const handleDelete = async (acompanhamentoId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este acompanhamento?')) {
            try {
                await api.delete(`/cases/${id}/acompanhamentos/${acompanhamentoId}`);
                setAcompanhamentos(acompanhamentos.filter(a => a.ID !== acompanhamentoId));
            } catch (error) {
                console.error('Error deleting acompanhamento:', error);
            }
        }
    };

    const startEditing = (acompanhamento: any) => {
        setEditingId(acompanhamento.ID);
        setFormData({
            Data: acompanhamento.Data ? acompanhamento.Data.split('T')[0] : '',
            Tipo_Atendimento: acompanhamento.Tipo_Atendimento || '',
            Sintese: acompanhamento.Sintese || '',
            Encaminhamento: acompanhamento.Encaminhamento || '',
            Encaminhamento_Rede: acompanhamento.Encaminhamento_Rede || '',
            Especifique_Encaminhamento: acompanhamento.Especifique_Encaminhamento || '',
            Responsaveis: acompanhamento.Responsaveis || ''
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <MainLayout>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <FormNavigation steps={formStepsComplete} caseId={id} />

                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Formulário de Adição/Edição */}
                        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                {editingId ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Data</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Data}
                                        onChange={e => setFormData({ ...formData, Data: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Tipo de Atendimento</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Tipo_Atendimento}
                                        onChange={e => setFormData({ ...formData, Tipo_Atendimento: e.target.value })}
                                        placeholder="Ex: Atendimento Psicológico, Jurídico..."
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Síntese</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={formData.Sintese}
                                    onChange={e => setFormData({ ...formData, Sintese: e.target.value })}
                                    placeholder="Descreva o atendimento realizado..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Encaminhamento</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Encaminhamento}
                                        onChange={e => setFormData({ ...formData, Encaminhamento: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-gray-700">Encaminhamento para a Rede</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={formData.Encaminhamento_Rede}
                                        onChange={e => setFormData({ ...formData, Encaminhamento_Rede: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Especifique Encaminhamento</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={formData.Especifique_Encaminhamento}
                                    onChange={e => setFormData({ ...formData, Especifique_Encaminhamento: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Responsáveis</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={formData.Responsaveis}
                                    onChange={e => setFormData({ ...formData, Responsaveis: e.target.value })}
                                    placeholder="Nome dos responsáveis pelo atendimento"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                {editingId && (
                                    <button
                                        onClick={resetForm}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    onClick={editingId ? handleUpdate : handleCreate}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    <Plus size={16} className="mr-2" />
                                    {editingId ? 'Atualizar' : 'Adicionar'}
                                </button>
                            </div>
                        </div>

                        {/* Lista de Acompanhamentos */}
                        <div className="bg-white rounded-lg shadow p-6 border-2 border-gray-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Histórico de Acompanhamentos</h3>

                            {acompanhamentos.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Nenhum acompanhamento registrado.</p>
                            ) : (
                                <div className="space-y-4">
                                    {acompanhamentos.sort((a, b) => new Date(b.Data).getTime() - new Date(a.Data).getTime()).map(acomp => (
                                        <div key={acomp.ID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-indigo-100 p-2 rounded">
                                                        <Calendar size={20} className="text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{formatDate(acomp.Data)}</p>
                                                        <p className="text-sm text-gray-600">{acomp.Tipo_Atendimento || 'Tipo não especificado'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(acomp)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(acomp.ID)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {acomp.Sintese && (
                                                <div className="mb-2">
                                                    <p className="text-sm font-medium text-gray-700 flex items-center mb-1">
                                                        <FileText size={14} className="mr-1" />
                                                        Síntese:
                                                    </p>
                                                    <p className="text-sm text-gray-600 pl-5">{acomp.Sintese}</p>
                                                </div>
                                            )}

                                            {(acomp.Encaminhamento || acomp.Encaminhamento_Rede) && (
                                                <div className="mb-2">
                                                    <p className="text-sm font-medium text-gray-700">Encaminhamento:</p>
                                                    <p className="text-sm text-gray-600 pl-5">
                                                        {acomp.Encaminhamento} {acomp.Encaminhamento_Rede && `→ ${acomp.Encaminhamento_Rede}`}
                                                    </p>
                                                </div>
                                            )}

                                            {acomp.Responsaveis && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <p className="text-xs text-gray-500">
                                                        Responsável(is): <span className="font-medium">{acomp.Responsaveis}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Botões de Navegação */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={() => navigate(`/cases/${id}/sintese-analitica`)}
                                className="px-6 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={() => navigate(`/cases/${id}/encerramento`)}
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
