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
        class="bg-white rounded-xl shadow-2xl p-10 max-w-4xl w-full mx-4 transform transition-all"
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
                on:click={() => selectType("Breve")}
                class="w-full group relative flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-save-primary hover:bg-blue-50 transition-all duration-200 text-center h-full"
            >
                <div
                    class="h-16 w-16 bg-blue-100 text-save-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-save-primary group-hover:text-white transition-colors"
                >
                    <span class="material-icons text-3xl">description</span>
                </div>
                <div class="flex-1 flex flex-col">
                    <h3
                        class="font-bold text-gray-800 group-hover:text-save-primary text-lg mb-2"
                    >
                        Caso Breve
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">
                        Formulário simplificado para atendimentos rápidos.
                    </p>
                    <div
                        class="mt-auto text-xs text-gray-400 bg-white p-2 rounded border border-gray-100"
                    >
                        <span class="font-semibold block mb-1 text-gray-500"
                            >Telas inclusas:</span
                        >
                        Dados de Entrada, <br />Identificação, <br />Situação
                        Jurídica, <br />Proteção e Segurança <br />e
                        <br />Vitimização.
                    </div>
                </div>
            </button>

            <button
                on:click={() => selectType("Completo")}
                class="w-full group relative flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-save-primary hover:bg-blue-50 transition-all duration-200 text-center h-full"
            >
                <div
                    class="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                >
                    <span class="material-icons text-3xl">assignment</span>
                </div>
                <div class="flex-1 flex flex-col">
                    <h3
                        class="font-bold text-gray-800 group-hover:text-purple-600 text-lg mb-2"
                    >
                        Caso Completo
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">
                        Formulário detalhado com todas as seções disponíveis.
                    </p>
                    <div
                        class="mt-auto text-xs text-gray-400 bg-white p-2 rounded border border-gray-100"
                    >
                        <span class="font-semibold block mb-1 text-gray-500"
                            >Telas inclusas:</span
                        >
                        Todas as do Breve + <br />Ensino/Trabalho/Renda,
                        <br />Assistência, <br />Habitação/Território,
                        <br />Saúde, <br />Vínculos, <br />Agressor,
                        <br />Síntese Analítica, <br />Acompanhamento,
                        <br />Encerramento, <br />Matriz de Risco,
                        <br />e <br />Referências.
                    </div>
                </div>
            </button>
        </div>

        <!-- Info Footer -->
        <div class="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div class="flex items-start">
                <span class="material-icons text-gray-400 mr-2 text-sm mt-0.5"
                    >info</span
                >
                <p class="text-xs text-gray-500 text-left">
                    <span class="font-semibold">Obs:</span> Os formulários salvam
                    automaticamente ao editar os campos, mas, ao final de cada tela,
                    poderá clicar para "Salvar Dados".
                </p>
            </div>
        </div>

        <div class="mt-6 text-center">
            <button
                on:click={close}
                class="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
</div>
