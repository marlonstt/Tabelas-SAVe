import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen" style={{ backgroundColor: '#F3F2F1' }}>
            {/* Sidebar */}
            <div className="w-64 flex flex-col" style={{ backgroundColor: '#464775' }}>
                {/* Logo */}
                <div className="p-6 border-b" style={{ borderColor: '#5A5A8A' }}>
                    <h1 className="text-xl font-bold text-white">SAVe</h1>
                    <p className="text-xs text-gray-300">Sistema de Avaliação de Vitimização</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className="block px-4 py-3 rounded text-white hover:bg-opacity-20 hover:bg-white transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Início</span>
                        </div>
                    </Link>

                    <Link
                        to="/cases"
                        className="block px-4 py-3 rounded text-white hover:bg-opacity-20 hover:bg-white transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Buscar Casos</span>
                        </div>
                    </Link>

                    <Link
                        to="/cases/new"
                        className="block px-4 py-3 rounded text-white hover:bg-opacity-20 hover:bg-white transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Novo Caso</span>
                        </div>
                    </Link>

                    {isAdmin && (
                        <Link
                            to="/users"
                            className="block px-4 py-3 rounded text-white hover:bg-opacity-20 hover:bg-white transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Usuários</span>
                            </div>
                        </Link>
                    )}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t" style={{ borderColor: '#5A5A8A' }}>
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6264A7' }}>
                            <span className="text-white font-medium">{user?.email[0].toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-gray-300">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 rounded text-sm text-white hover:bg-opacity-20 hover:bg-white transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
}
