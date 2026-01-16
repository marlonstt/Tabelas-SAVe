<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { toast, type Toast } from "../lib/stores";

    let currentToast: Toast | null = null;
    let timeout: any;

    const unsubscribe = toast.subscribe((value) => {
        // If a new toast comes in
        if (value && (!currentToast || value.id !== currentToast.id)) {
            currentToast = value;

            // Clear existing timeout
            if (timeout) clearTimeout(timeout);

            // Auto dismiss after 3 seconds
            timeout = setTimeout(() => {
                dismiss();
            }, 3000);
        }
    });

    function dismiss() {
        currentToast = null;
        toast.set(null);
    }

    onDestroy(() => {
        unsubscribe();
        if (timeout) clearTimeout(timeout);
    });
</script>

{#if currentToast}
    <div
        class="fixed top-4 right-4 z-50 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 transition-all duration-300 transform translate-y-0 opacity-100"
        role="alert"
    >
        {#if currentToast.type === "success"}
            <div
                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
            >
                <span class="material-icons text-sm">check</span>
            </div>
        {:else if currentToast.type === "error"}
            <div
                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
            >
                <span class="material-icons text-sm">error</span>
            </div>
        {:else}
            <div
                class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200"
            >
                <span class="material-icons text-sm">info</span>
            </div>
        {/if}

        <div class="ml-3 text-sm font-normal">{currentToast.message}</div>

        <button
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            on:click={dismiss}
            aria-label="Close"
        >
            <span class="material-icons text-sm">close</span>
        </button>
    </div>
{/if}
