import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

export default function NewCaseChoice() {
    const navigate = useNavigate();

    const handleCreateCase = async (type: 'completa' | 'breve') => {
        try {
            const response = await api.post('/cases');
            const newId = response.data.id;
            navigate(`/cases/${newId}/dados-entrada`);
        } catch (error) {
            console.error('Error creating case:', error);
            alert('Erro ao criar novo caso');
        }
    };

    return (
        <MainLayout>
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-4" style={{ color: '#323130' }}>
                            Criar Novo Caso
                        </h1>
                        <p className="text-lg" style={{ color: '#605E5C' }}>
                            Escolha o tipo de formulário que deseja preencher
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Versão Breve */}
                        <button
                            onClick={() => handleCreateCase('breve')}
                            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-left group"
                        >
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0078D4' }}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[#0078D4] transition-colors" style={{ color: '#323130' }}>
                                        Versão Breve
                                    </h2>
                                    <p className="text-sm mb-4" style={{ color: '#605E5C' }}>
                                        Formulário simplificado para registro rápido
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium" style={{ color: '#323130' }}>Inclui:</p>
                                <ul className="text-sm space-y-1" style={{ color: '#605E5C' }}>
                                    <li>• Dados de Entrada</li>
                                    <li>• Identificação</li>
                                    <li>• Situação Jurídica</li>
                                    <li>• Proteção e Segurança</li>
                                </ul>
                            </div>
                            <div className="mt-6 text-sm font-medium" style={{ color: '#0078D4' }}>
                                Tempo estimado: 10-15 minutos →
                            </div>
                        </button>

                        {/* Versão Completa */}
                        <button
                            onClick={() => handleCreateCase('completa')}
                            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-left group"
                        >
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6264A7' }}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2 group-hover:text-[#6264A7] transition-colors" style={{ color: '#323130' }}>
                                        Versão Completa
                                    </h2>
                                    <p className="text-sm mb-4" style={{ color: '#605E5C' }}>
                                        Formulário detalhado com todas as seções
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium" style={{ color: '#323130' }}>Inclui todas as seções:</p>
                                <ul className="text-sm space-y-1" style={{ color: '#605E5C' }}>
                                    <li>• Identificação e Dados Pessoais</li>
                                    <li>• Situação Jurídica e Processual</li>
                                    <li>• Saúde e Assistência Social</li>
                                    <li>• Perfil do Agressor</li>
                                    <li>• Matriz de Risco e Síntese</li>
                                    <li>• E muito mais...</li>
                                </ul>
                            </div>
                            <div className="mt-6 text-sm font-medium" style={{ color: '#6264A7' }}>
                                Tempo estimado: 30-45 minutos →
                            </div>
                        </button>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm px-6 py-2 rounded border"
                            style={{ borderColor: '#D2D0CE', color: '#605E5C' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
