import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isStepAllowed } from '../config/formSteps';

interface ProtectedFormPageProps {
    children: React.ReactNode;
    stepId: string;
}

export default function ProtectedFormPage({ children, stepId }: ProtectedFormPageProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [isBreve, setIsBreve] = useState(false);

    useEffect(() => {
        checkAccess();
    }, [id, stepId]);

    const checkAccess = async () => {
        if (!id) {
            setIsAllowed(true);
            return;
        }

        try {
            const response = await api.get(`/cases/${id}`);
            const tipoForm = response.data.geral?.Tipo_Form;
            const breveMode = tipoForm === 'breve';
            setIsBreve(breveMode);

            const allowed = isStepAllowed(stepId, breveMode);
            setIsAllowed(allowed);

            if (!allowed) {
                // Redirect to first allowed page
                setTimeout(() => {
                    navigate(`/cases/${id}/dados-entrada`);
                }, 2000);
            }
        } catch (error) {
            console.error('Error checking access:', error);
            setIsAllowed(true); // Allow access on error
        }
    };

    if (isAllowed === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6264A7] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAllowed) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <div className="text-yellow-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-4">
                        Esta tela não está disponível na <strong>versão breve</strong> do formulário.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Você será redirecionado para a página inicial...
                    </p>
                    <button
                        onClick={() => navigate(`/cases/${id}/dados-entrada`)}
                        className="px-6 py-2 bg-[#6264A7] text-white rounded hover:bg-[#5558a0] transition-colors"
                    >
                        Ir para Dados de Entrada
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
