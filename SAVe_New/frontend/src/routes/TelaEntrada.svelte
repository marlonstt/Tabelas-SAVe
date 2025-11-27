<script lang="ts">
    import { Link } from "svelte-routing";

    // Mock user name (in real app, get from store/localStorage)
    const userName = "Usuário";
</script>

<div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
>
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h1 class="text-3xl font-bold text-save-primary mb-2">
            Bem-vindo ao aplicativo SAVe, {userName}!
        </h1>

        <div class="flex justify-center mb-8">
            <!-- Placeholder for user image if available -->
            <div
                class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400"
            >
                <span class="material-icons" style="font-size: 48px;"
                    >person</span
                >
            </div>
        </div>

        <div
            class="border-2 border-dashed border-gray-300 bg-gray-50 p-6 mb-8 rounded-lg"
        >
            <h2 class="text-xl text-gray-600 font-medium">
                O que deseja fazer a seguir?
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <Link
                to="/"
                class="bg-save-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-save-secondary transition-colors shadow-md flex items-center justify-center"
            >
                Acessar Casos
            </Link>

            <button
                on:click={() => alert("Funcionalidade em desenvolvimento")}
                class="bg-save-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-save-secondary transition-colors shadow-md flex items-center justify-center"
            >
                Criar Novo Caso
            </button>

            <!-- Admin options could be conditional -->
            <button
                on:click={() => alert("Acesso restrito a administradores")}
                class="bg-gray-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center"
            >
                Gestão de Usuários
            </button>

            <button
                on:click={() => alert("Acesso restrito a administradores")}
                class="bg-gray-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center"
            >
                Dashboards
            </button>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
            <button
                on:click={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }}
                class="text-red-600 hover:text-red-800 font-medium flex items-center justify-center mx-auto"
            >
                <span class="material-icons mr-1">logout</span> Sair do Sistema
            </button>
        </div>
    </div>
</div>
