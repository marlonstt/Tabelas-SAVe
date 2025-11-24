import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <MainLayout>
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#323130' }}>
                        Bem-vindo ao SAVe
                    </h1>
                    <p className="text-lg mb-8" style={{ color: '#605E5C' }}>
                        Olá, {user?.email}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            to="/cases/new"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6264A7' }}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#323130' }}>Novo Caso</h3>
                                    <p className="text-sm" style={{ color: '#605E5C' }}>Registrar novo atendimento</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/cases"
                            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0078D4' }}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#323130' }}>Buscar Casos</h3>
                                    <p className="text-sm" style={{ color: '#605E5C' }}>Consultar casos existentes</p>
                                </div>
                            </div>
                        </Link>

                        {user?.role === 'Admin' && (
                            <Link
                                to="/users"
                                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#107C10' }}>
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold" style={{ color: '#323130' }}>Usuários</h3>
                                        <p className="text-sm" style={{ color: '#605E5C' }}>Gerenciar usuários</p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4" style={{ color: '#323130' }}>
                            Estatísticas Rápidas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 rounded" style={{ backgroundColor: '#F3F2F1' }}>
                                <div className="text-3xl font-bold" style={{ color: '#6264A7' }}>0</div>
                                <div className="text-sm" style={{ color: '#605E5C' }}>Casos Ativos</div>
                            </div>
                            <div className="text-center p-4 rounded" style={{ backgroundColor: '#F3F2F1' }}>
                                <div className="text-3xl font-bold" style={{ color: '#0078D4' }}>0</div>
                                <div className="text-sm" style={{ color: '#605E5C' }}>Casos Este Mês</div>
                            </div>
                            <div className="text-center p-4 rounded" style={{ backgroundColor: '#F3F2F1' }}>
                                <div className="text-3xl font-bold" style={{ color: '#107C10' }}>0</div>
                                <div className="text-sm" style={{ color: '#605E5C' }}>Casos Encerrados</div>
                            </div>
                            <div className="text-center p-4 rounded" style={{ backgroundColor: '#F3F2F1' }}>
                                <div className="text-3xl font-bold" style={{ color: '#FFB900' }}>0</div>
                                <div className="text-sm" style={{ color: '#605E5C' }}>Pendentes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
