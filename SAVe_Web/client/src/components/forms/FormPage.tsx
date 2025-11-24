import { type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import FormNavigation from '../../components/forms/FormNavigation';
import { formStepsComplete, formStepsBreve } from '../../config/formSteps';

interface FormPageProps {
    title: string;
    description: string;
    children: ReactNode;
    isBreve?: boolean;
}

export default function FormPage({ title, description, children, isBreve = false }: FormPageProps) {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save and navigate to next step
    };

    const steps = isBreve ? formStepsBreve : formStepsComplete;

    return (
        <MainLayout>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Barra de Navegação Horizontal Superior */}
                <FormNavigation steps={steps} caseId={id} />

                {/* Conteúdo do Formulário */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <p className="text-gray-500">{description}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {children}

                            <div className="flex justify-between pt-6 border-t" style={{ borderColor: '#D2D0CE' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 rounded border hover:bg-gray-50 transition-colors"
                                    style={{ borderColor: '#D2D0CE', color: '#323130' }}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#6264A7' }}
                                >
                                    Salvar e Continuar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
