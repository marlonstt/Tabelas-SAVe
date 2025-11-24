import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    return (
        <MainLayout>
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h1 className="text-2xl font-bold mb-2" style={{ color: '#323130' }}>
                            Alterar Senha
                        </h1>
                        <p className="text-sm mb-6" style={{ color: '#605E5C' }}>
                            Por segurança, altere sua senha padrão
                        </p>

                        {success ? (
                            <div className="p-4 rounded mb-4" style={{ backgroundColor: '#DFF6DD', color: '#107C10' }}>
                                Senha alterada com sucesso! Redirecionando...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded text-sm" style={{ backgroundColor: '#FDE7E9', color: '#D13438' }}>
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                        Senha Atual
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                        style={{ borderColor: '#D2D0CE' }}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                        Nova Senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                        style={{ borderColor: '#D2D0CE' }}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#323130' }}>
                                        Confirmar Nova Senha
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                        style={{ borderColor: '#D2D0CE' }}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 rounded text-white"
                                    style={{ backgroundColor: '#6264A7' }}
                                >
                                    Alterar Senha
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
