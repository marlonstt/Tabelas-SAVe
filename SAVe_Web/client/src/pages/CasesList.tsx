import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

interface Case {
    ID_Caso: number;
    Nome: string;
    Data: string;
    Tipo_Vitima: string;
    Comarca: string;
    Encerrado: string;
}

export default function CasesList() {
    const navigate = useNavigate();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await api.get('/cases');
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCases = cases.filter(c =>
        c.Nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ID_Caso.toString().includes(searchTerm)
    );

    return (
        <MainLayout>
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: '#323130' }}>
                                Casos
                            </h1>
                            <p className="text-sm" style={{ color: '#605E5C' }}>
                                Gerenciar casos cadastrados
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/cases/new')}
                            className="px-6 py-3 rounded text-white flex items-center space-x-2"
                            style={{ backgroundColor: '#6264A7' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Novo Caso</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou ID..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#F3F2F1' }}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Nome</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Data</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Tipo Vítima</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Comarca</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#323130' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center" style={{ color: '#605E5C' }}>
                                            Carregando...
                                        </td>
                                    </tr>
                                ) : filteredCases.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center" style={{ color: '#605E5C' }}>
                                            Nenhum caso encontrado
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCases.map(c => (
                                        <tr key={c.ID_Caso} className="border-t hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm" style={{ color: '#323130' }}>{c.ID_Caso}</td>
                                            <td className="px-6 py-4 text-sm font-medium" style={{ color: '#323130' }}>{c.Nome || '-'}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#605E5C' }}>{c.Data}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#605E5C' }}>{c.Tipo_Vitima || '-'}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#605E5C' }}>{c.Comarca || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.Encerrado === 'Sim' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {c.Encerrado === 'Sim' ? 'Encerrado' : 'Em Andamento'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => navigate(`/cases/${c.ID_Caso}/dados-entrada`)}
                                                    className="text-sm px-3 py-1 rounded hover:bg-gray-200"
                                                    style={{ color: '#0078D4' }}
                                                >
                                                    Abrir
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
        </MainLayout>
    );
}
