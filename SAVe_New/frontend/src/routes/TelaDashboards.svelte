<script lang="ts">
    import { onMount } from "svelte";

    // Placeholder for future PowerBI integration
    let powerBiUrl = "";
</script>

<div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboards</h1>

    <div
        class="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center min-h-[400px]"
    >
        {#if powerBiUrl}
            <iframe
                title="PowerBI Report"
                width="100%"
                height="600"
                src={powerBiUrl}
                frameborder="0"
                allowFullScreen={true}
            ></iframe>
        {:else}
            <div class="text-center">
                <svg
                    class="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                </svg>
                <h2 class="text-xl font-semibold text-gray-700 mb-2">
                    Integração com PowerBI
                </h2>
                <p class="text-gray-500 max-w-md mx-auto">
                    Este espaço está reservado para a exibição dos dashboards do
                    PowerBI. A integração será configurada futuramente.
                </p>
            </div>
        {/if}
    </div>
</div>
