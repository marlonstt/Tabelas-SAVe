<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";

    const dispatch = createEventDispatcher();

    function selectType(type: "Breve" | "Completo") {
        dispatch("select", type);
    }

    function close() {
        dispatch("close");
    }
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    transition:fade
    on:click={close}
    on:keydown={(e) => e.key === "Escape" && close()}
    role="button"
    tabindex="0"
>
    <div
        class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all"
        transition:scale
        on:click|stopPropagation
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
        <div class="text-center mb-8">
            <h2 id="modal-title" class="text-2xl font-bold text-gray-800 mb-2">
                Novo Caso
            </h2>
            <p class="text-gray-600">
                Selecione o tipo de formulário para iniciar o atendimento.
            </p>
        </div>

        <div class="space-y-4">
            <button
                on:click={() => selectType("Breve")}
                class="w-full group relative flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-save-primary hover:bg-blue-50 transition-all duration-200"
            >
                <div
                    class="h-12 w-12 bg-blue-100 text-save-primary rounded-full flex items-center justify-center mr-4 group-hover:bg-save-primary group-hover:text-white transition-colors"
                >
                    <span class="material-icons">description</span>
                </div>
                <div class="text-left">
                    <h3
                        class="font-bold text-gray-800 group-hover:text-save-primary"
                    >
                        Caso Breve
                    </h3>
                    <p class="text-sm text-gray-500">
                        Formulário simplificado para atendimentos rápidos.
                    </p>
                </div>
            </button>

            <button
                on:click={() => selectType("Completo")}
                class="w-full group relative flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-save-primary hover:bg-blue-50 transition-all duration-200"
            >
                <div
                    class="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                >
                    <span class="material-icons">assignment</span>
                </div>
                <div class="text-left">
                    <h3
                        class="font-bold text-gray-800 group-hover:text-purple-600"
                    >
                        Caso Completo
                    </h3>
                    <p class="text-sm text-gray-500">
                        Formulário detalhado com todas as seções disponíveis.
                    </p>
                </div>
            </button>
        </div>

        <div class="mt-8 text-center">
            <button
                on:click={close}
                class="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>
