import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    cargo: string;
    usuario: string;
    area: string;
    role: string;
    created_at: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        cargo: '',
        usuario: '',
        area: '',
        role: 'User'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                cargo: user.cargo || '',
                usuario: user.usuario || '',
                area: user.area || '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                cargo: '',
                usuario: '',
                area: '',
                role: 'User'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.put(`/auth/users/${editingUser.id}`, formData);
            } else {
                await api.post('/auth/register', formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Erro ao salvar usuário');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            await api.delete(`/auth/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert('Erro ao excluir usuário');
        }
    };

    return (
        <MainLayout>
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: '#323130' }}>
                                Gestão de Usuários
                            </h1>
                            <p className="text-sm" style={{ color: '#605E5C' }}>
                                Gerenciar usuários do sistema
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 rounded text-white flex items-center space-x-2"
                            style={{ backgroundColor: '#6264A7' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Novo Usuário</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#F3F2F1' }}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Nome</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Cargo</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Área</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Perfil</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#605E5C' }}>
                                            Carregando...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#605E5C' }}>
                                            Nenhum usuário encontrado
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="border-t" style={{ borderColor: '#D2D0CE' }}>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#323130' }}>{user.email}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#323130' }}>{user.usuario}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#605E5C' }}>{user.cargo}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#605E5C' }}>{user.area}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="text-sm px-3 py-1 rounded hover:bg-gray-100"
                                                    style={{ color: '#0078D4' }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-sm px-3 py-1 rounded hover:bg-red-50"
                                                    style={{ color: '#D13438' }}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#323130' }}>
                            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                    style={{ borderColor: '#D2D0CE' }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="usuario@mpmg.mp.br"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                    style={{ borderColor: '#D2D0CE' }}
                                    value={formData.usuario}
                                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                    Cargo
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                    style={{ borderColor: '#D2D0CE' }}
                                    value={formData.cargo}
                                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Assessora(or)">Assessora(or)</option>
                                    <option value="Promotora(o)">Promotora(o)</option>
                                    <option value="Técnica(o)">Técnica(o)</option>
                                    <option value="Estagiária(o)">Estagiária(o)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                    Área
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                    style={{ borderColor: '#D2D0CE' }}
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Direito">Direito</option>
                                    <option value="Psicossocial">Psicossocial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                    Perfil
                                </label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                    style={{ borderColor: '#D2D0CE' }}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {!editingUser && (
                                <p className="text-sm" style={{ color: '#605E5C' }}>
                                    Senha padrão: <strong>123456</strong> (o usuário deverá alterá-la no primeiro login)
                                </p>
                            )}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded border"
                                    style={{ borderColor: '#D2D0CE', color: '#323130' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded text-white"
                                    style={{ backgroundColor: '#6264A7' }}
                                >
                                    {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
