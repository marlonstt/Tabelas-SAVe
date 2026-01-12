<script lang="ts">
    import { onMount } from "svelte";
    import api from "../lib/api";
    import CaseTypeSelection from "../components/CaseTypeSelection.svelte";

    let user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user.usuario || "Usuário";
    let showCaseTypeSelection = false;

    function openCaseSelection() {
        showCaseTypeSelection = true;
    }

    function closeCaseSelection() {
        showCaseTypeSelection = false;
    }

    async function handleCaseTypeSelect(event: CustomEvent) {
        const type = event.detail; // "Breve" or "Completo"
        closeCaseSelection();

        try {
            const response = await api.post("/cases", { Tipo_Form: type });
            window.location.href = `/case/${response.data.id}`;
        } catch (err: any) {
            console.error(err);
            alert(
                "Erro ao criar caso: " +
                    (err.response?.data?.error || err.message),
            );
        }
    }

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

{#if showCaseTypeSelection}
    <CaseTypeSelection
        on:select={handleCaseTypeSelect}
        on:close={closeCaseSelection}
    />
{/if}

<div
    class="min-h-screen flex flex-col items-center justify-center p-4 relative"
>
    <!-- Modern Title at the Top -->
    <div class="absolute top-8 w-full text-center px-2 z-10 animate-fade-in">
        <h3
            class="text-2xl md:text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-save-primary to-save-secondary tracking-tight drop-shadow-sm uppercase"
        >
            Sistema de Avaliação e Vitimização Eletrônico
        </h3>
        <div
            class="w-20 h-1 bg-save-accent mx-auto mt-3 rounded-full opacity-90 shadow-sm"
        ></div>
    </div>
    <div
        class="bg-white p-2 rounded-lg shadow-2xl max-w-xl w-full text-center z-10 border border-gray-100"
    >
        <h2 class="text-1xl font-bold text-save-primary mb-2">
            Bem-vindo, <br />{userName}!
        </h2>

        <div class="flex justify-center mb-6">
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

        <div class="grid grid-cols-1 md:grid-cols-1 gap-2 max-w-sm mx-auto p-4">
            <a
                href="/"
                class="text-white py-1 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center no-underline"
                style="background: linear-gradient(90deg, #6264A7 0%, #35365A 35%, #35365A 65%, #6264A7 100%);"
            >
                Acessar Casos
            </a>

            <button
                on:click={openCaseSelection}
                class="text-white py-1 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
                style="background: linear-gradient(90deg, #6264A7 0%, #35365A 25%, #35365A 75%, #6264A7 100%);"
            >
                Criar Novo Caso
            </button>

            {#if user.role === "Admin" || user.role === "admin"}
                <a
                    href="/admin/users"
                    class="text-white py-1 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center no-underline"
                    style="background: linear-gradient(90deg, #6264A7 0%, #35365A 25%, #35365A 75%, #6264A7 100%);"
                >
                    Gestão de Usuários
                </a>
            {/if}

            <a
                href="/dashboards"
                class="text-white py-1 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center no-underline"
                style="background: linear-gradient(90deg, #6264A7 0%, #35365A 35%, #35365A 65%, #6264A7 100%);"
            >
                Dashboards
            </a>
        </div>
    </div>
</div>
