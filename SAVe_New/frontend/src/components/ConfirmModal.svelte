<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let isOpen = false;
    export let title = "Confirmar Exclusão";
    export let message = "Tem certeza que deseja excluir este item?";
    export let confirmText = "Excluir";
    export let cancelText = "Cancelar";
    export let confirmColor = "bg-red-600 hover:bg-red-700";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function confirm() {
        dispatch("confirm");
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
    >
        <div class="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-gray-800">{title}</h2>
            <p class="text-gray-600 mb-6">{message}</p>
            <div class="flex justify-end space-x-3">
                <button
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    on:click={close}
                >
                    {cancelText}
                </button>
                <button
                    class="px-4 py-2 text-white rounded transition-colors {confirmColor}"
                    on:click={confirm}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
{/if}
