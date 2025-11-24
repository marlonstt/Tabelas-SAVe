import { Link, useLocation } from 'react-router-dom';

interface FormStep {
    id: string;
    label: string;
    path: string;
}

interface FormNavigationProps {
    steps: FormStep[];
    caseId?: string;
}

export default function FormNavigation({ steps, caseId }: FormNavigationProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="bg-white border-b overflow-x-auto">
            <div className="flex space-x-1 p-2 min-w-max">
                {steps.map((step, index) => {
                    const isActive = currentPath.includes(step.path);
                    const isCompleted = false; // TODO: Track completion status

                    return (
                        <Link
                            key={step.id}
                            to={caseId ? `/cases/${caseId}/${step.path}` : `/cases/new/${step.path}`}
                            className={`
                                px-4 py-2 text-sm font-medium rounded whitespace-nowrap
                                ${isActive
                                    ? 'bg-[#6264A7] text-white'
                                    : isCompleted
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'text-gray-500 hover:bg-gray-50'
                                }
                            `}
                        >
                            {step.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
