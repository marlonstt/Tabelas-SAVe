import { writable } from 'svelte/store';

export const isGlobalSaving = writable(false);

// Toast Store
export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id?: number;
}

export const toast = writable<Toast | null>(null);

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    toast.set({ message, type, id: Date.now() });

    // Auto clear is handled in component, but good to have a safety net or manual clear if needed
    // For simple implementation, we just set the store.
}
