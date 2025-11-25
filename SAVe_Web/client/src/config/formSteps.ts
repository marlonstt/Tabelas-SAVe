// Form steps configuration for SAVe application

export interface FormStep {
    id: string;
    label: string;
    path: string;
    breveOnly?: boolean; // true = only in brief version, undefined = both versions
}

// Complete form steps (Versão Completa)
export const formStepsComplete: FormStep[] = [
    { id: 'dados-entrada', label: 'Dados de Entrada', path: 'dados-entrada' },
    { id: 'identificacao', label: 'Identificação', path: 'identificacao' },
    { id: 'situacao-juridica', label: 'Situação Jurídica', path: 'situacao-juridica' },
    { id: 'saude', label: 'Saúde', path: 'saude' },
    { id: 'habitacao', label: 'Habitação e Território', path: 'habitacao' },
    { id: 'assistencia', label: 'Assistência', path: 'assistencia' },
    { id: 'ensino', label: 'Ensino, Trabalho e Renda', path: 'ensino' },
    { id: 'vinculos', label: 'Vínculos', path: 'vinculos' },
    { id: 'protecao', label: 'Proteção e Segurança', path: 'protecao' },
    { id: 'agressor', label: 'Agressor', path: 'agressor' },
    { id: 'vitimizacao', label: 'Vitimização', path: 'vitimizacao' },
    { id: 'sintese', label: 'Síntese Analítica', path: 'sintese' },
    // Acompanhamento route is plural in the router (acompanhamentos)
    { id: 'acompanhamento', label: 'Acompanhamento', path: 'acompanhamentos' },
    { id: 'encerramento', label: 'Encerramento', path: 'encerramento' }
];

// Brief form steps (Versão Breve) – subset of the complete steps
export const formStepsBreve: FormStep[] = [
    { id: 'dados-entrada', label: 'Dados de Entrada', path: 'dados-entrada' },
    { id: 'identificacao', label: 'Identificação', path: 'identificacao' },
    { id: 'situacao-juridica', label: 'Situação Jurídica', path: 'situacao-juridica' },
    { id: 'protecao', label: 'Proteção e Segurança', path: 'protecao' },
    { id: 'vitimizacao', label: 'Vitimização', path: 'vitimizacao' }
];

// Helper array of step IDs allowed in the brief version (used by guards)
export const breveStepIds = ['dados-entrada', 'identificacao', 'situacao-juridica', 'protecao', 'vitimizacao'];

// Returns the appropriate list of steps based on the current form type
export const getFormSteps = (isBreve: boolean): FormStep[] => {
    return isBreve ? formStepsComplete.filter(step => breveStepIds.includes(step.id)) : formStepsComplete;
};

// Checks whether a given step ID is allowed in the current form version
export const isStepAllowed = (stepId: string, isBreve: boolean): boolean => {
    if (!isBreve) return true; // all steps allowed in the complete version
    return breveStepIds.includes(stepId);
};
