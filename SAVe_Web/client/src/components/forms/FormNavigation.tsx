import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FileText, List } from 'lucide-react';
import api from '../../services/api';
import type { FormStep } from '../../config/formSteps';
import { getFormSteps, isStepAllowed } from '../../config/formSteps';

interface FormNavigationProps {
    caseId?: string;
}

export default function FormNavigation({ caseId }: FormNavigationProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [isBreve, setIsBreve] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch form type on mount or when caseId changes
    useEffect(() => {
        if (caseId) {
            fetchFormType();
        } else {
            setLoading(false);
        }
    }, [caseId]);

    const fetchFormType = async () => {
        try {
            const response = await api.get(`/cases/${caseId}`);
            const tipoForm = response.data.geral?.Tipo_Form;
            setIsBreve(tipoForm === 'breve');
        } catch (error) {
            console.error('Error fetching form type:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFormType = async () => {
        if (!caseId) return;
        const newType = isBreve ? 'completa' : 'breve';
        try {
            await api.put(`/cases/${caseId}/geral`, { Tipo_Form: newType });
            setIsBreve(!isBreve);
            // If the current step is not allowed in the new version, redirect
            const currentStepId = getCurrentStepId();
            if (currentStepId && !isStepAllowed(currentStepId, !isBreve)) {
                navigate(`/cases/${caseId}/dados-entrada`);
            }
        } catch (error) {
            console.error('Error toggling form type:', error);
            alert('Erro ao alternar versão do formulário');
        }
    };

    const getCurrentStepId = (): string | null => {
        const steps = getFormSteps(false); // all steps
        const currentStep = steps.find((step) => currentPath.includes(step.path));
        return currentStep?.id || null;
    };

    const currentStepId = getCurrentStepId();
    const isCurrentStepAllowed = !currentStepId || isStepAllowed(currentStepId, isBreve);
    const displaySteps = getFormSteps(isBreve);

    if (loading) {
        return (
            <div className="bg-white border-b p-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-b">
            {/* Toggle Button */}
            {caseId && (
                <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                    <button
                        onClick={toggleFormType}
                        className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                        title={`Alternar para versão ${isBreve ? 'completa' : 'breve'}`}
                    >
                        {isBreve ? (
                            <>
                                <List size={14} />
                                <span>Versão Breve</span>
                                <span className="text-gray-400">→ Completa</span>
                            </>
                        ) : (
                            <>
                                <FileText size={14} />
                                <span>Versão Completa</span>
                                <span className="text-gray-400">→ Breve</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="overflow-x-auto">
                <div className="flex space-x-1 p-2 min-w-max">
                    {displaySteps.map((step) => {
                        const isActive = currentPath.includes(step.path);
                        const isCompleted = false; // TODO: track completion status
                        return (
                            <Link
                                key={step.id}
                                to={caseId ? `/cases/${caseId}/${step.path}` : `/cases/new/${step.path}`}
                                className={`px-4 py-2 text-sm font-medium rounded whitespace-nowrap ${isActive
                                        ? 'bg-[#6264A7] text-white'
                                        : isCompleted
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {step.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Warning if current step is not allowed */}
            {!isCurrentStepAllowed && (
                <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
                    <p className="text-xs text-yellow-800">
                        ⚠️ Esta tela não está disponível na versão breve.
                        <button
                            onClick={() => navigate(`/cases/${caseId}/dados-entrada`)}
                            className="ml-2 underline hover:text-yellow-900"
                        >
                            Voltar para Dados de Entrada
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
}
