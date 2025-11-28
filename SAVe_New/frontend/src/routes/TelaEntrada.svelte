<script lang="ts">
    import { onMount } from "svelte";

    let user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.usuario || "Usuário";

    onMount(() => {
        // Listen for profile image updates
        const handleProfileUpdate = ((e: CustomEvent) => {
            user = e.detail;
        }) as EventListener;

        window.addEventListener("profileUpdated", handleProfileUpdate);

        return () => {
            window.removeEventListener("profileUpdated", handleProfileUpdate);
        };
    });
</script>

<div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative"
>
    <div
        class="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full text-center z-10"
    >
        <h1 class="text-3xl font-bold text-save-primary mb-2">
            Bem-vindo ao aplicativo SAVe, {userName}!
        </h1>

        <div class="flex justify-center mb-8">
            <!-- User image or initial -->
            <div
                class="w-24 h-24 bg-save-primary rounded-full flex items-center justify-center text-4xl text-white font-bold overflow-hidden"
            >
                {#if user.profile_image}
                    <img
                        src={user.profile_image}
                        alt="Profile"
                        class="w-full h-full object-cover"
                    />
                {:else}
                    {user.usuario ? user.usuario.charAt(0).toUpperCase() : "U"}
                {/if}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <a
                href="/"
                class="bg-save-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-save-secondary transition-colors shadow-md flex items-center justify-center no-underline"
            >
                Acessar Casos
            </a>

            <button
                on:click={() => alert("Funcionalidade em desenvolvimento")}
                class="bg-save-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-save-secondary transition-colors shadow-md flex items-center justify-center"
            >
                Criar Novo Caso
            </button>

            {#if user.role === "Admin" || user.role === "admin"}
                <a
                    href="/admin/users"
                    class="bg-gray-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center no-underline"
                >
                    Gestão de Usuários
                </a>
            {/if}

            <button
                on:click={() => alert("Funcionalidade em desenvolvimento")}
                class="bg-gray-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center"
            >
                Dashboards
            </button>
        </div>
    </div>

    <!-- Logos Rodapé -->
    <div
        class="absolute bottom-8 left-8 opacity-50 hover:opacity-100 transition-opacity"
    >
        <img
            src="/logo_casa_lilian_real.png"
            alt="Casa Lilian"
            class="h-[60px]"
            style="mix-blend-mode: multiply;"
        />
    </div>
    <div
        class="absolute bottom-8 right-8 opacity-50 hover:opacity-100 transition-opacity"
    >
        <img
            src="/logo_mpmg_real.png"
            alt="MPMG"
            class="h-[60px]"
            style="mix-blend-mode: multiply;"
        />
    </div>
</div>
