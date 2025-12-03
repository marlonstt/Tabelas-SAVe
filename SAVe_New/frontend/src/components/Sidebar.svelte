<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import UserProfile from "./UserProfile.svelte";
    import api from "../lib/api";
    import CaseTypeSelection from "./CaseTypeSelection.svelte";

    export let user: any;
    export let currentPath: string;
    export let onLogout: () => void;

    let showProfileMenu = false;
    let showCaseTypeSelection = false;
    let isHovered = false;

    const isAdmin = user?.role === "Admin" || user?.role === "admin";

    // Helper to check if link is active
    function isActive(path: string) {
        if (path === "/" && currentPath === "/") return true;
        if (path !== "/" && currentPath.startsWith(path)) return true;
        return false;
    }

    function toggleProfileMenu() {
        showProfileMenu = !showProfileMenu;
    }

    function closeProfileMenu() {
        showProfileMenu = false;
    }

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
</script>

{#if showCaseTypeSelection}
    <CaseTypeSelection
        on:select={handleCaseTypeSelect}
        on:close={closeCaseSelection}
    />
{/if}

<div
    class="flex flex-col h-full text-white relative transition-all duration-300 ease-in-out"
    style="background-color: #464775; width: {isHovered ? '120px' : '70px'};"
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
    role="navigation"
>
    <!-- Logo -->
    <div
        class="p-4 border-b flex justify-center items-center h-20"
        style="border-color: #5A5A8A;"
    >
        <div class="flex items-center justify-center w-full h-full">
            <img
                src="/logo_save_real.png"
                alt="SAVe Logo"
                class="object-contain transition-all duration-300"
                style="max-width: {isHovered
                    ? '80px'
                    : '40px'}; max-height: {isHovered ? '60px' : '40px'};"
            />
        </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-2 space-y-2 overflow-y-auto overflow-x-hidden">
        <a
            href="/menu"
            class="block p-2 rounded transition-colors flex flex-col items-center justify-center {isActive(
                '/menu',
            )
                ? 'bg-white bg-opacity-20'
                : 'hover:bg-white hover:bg-opacity-10'}"
            title={!isHovered ? "Início" : ""}
        >
            <div class="flex items-center justify-center mb-1">
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            </div>
            {#if isHovered}
                <span class="text-[10px] font-medium text-center leading-tight"
                    >Início</span
                >
            {/if}
        </a>

        <a
            href="/"
            class="block p-2 rounded transition-colors flex flex-col items-center justify-center {isActive(
                '/',
            ) && currentPath !== '/menu'
                ? 'bg-white bg-opacity-20'
                : 'hover:bg-white hover:bg-opacity-10'}"
            title={!isHovered ? "Buscar Casos" : ""}
        >
            <div class="flex items-center justify-center mb-1">
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>
            {#if isHovered}
                <span class="text-[10px] font-medium text-center leading-tight"
                    >Buscar Casos</span
                >
            {/if}
        </a>

        <button
            on:click={openCaseSelection}
            class="w-full block p-2 rounded transition-colors hover:bg-white hover:bg-opacity-10 flex flex-col items-center justify-center"
            title={!isHovered ? "Novo Caso" : ""}
        >
            <div class="flex items-center justify-center mb-1">
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>
            {#if isHovered}
                <span class="text-[10px] font-medium text-center leading-tight"
                    >Novo Caso</span
                >
            {/if}
        </button>

        {#if isAdmin}
            <a
                href="/admin/responsaveis"
                class="block p-2 rounded transition-colors flex flex-col items-center justify-center {isActive(
                    '/admin/responsaveis',
                )
                    ? 'bg-white bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'}"
                title={!isHovered ? "Responsáveis" : ""}
            >
                <div class="flex items-center justify-center mb-1">
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
                {#if isHovered}
                    <span
                        class="text-[10px] font-medium text-center leading-tight"
                        >Responsáveis</span
                    >
                {/if}
            </a>

            <a
                href="/admin/users"
                class="block p-2 rounded transition-colors flex flex-col items-center justify-center {isActive(
                    '/admin/users',
                )
                    ? 'bg-white bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'}"
                title={!isHovered ? "Usuários" : ""}
            >
                <div class="flex items-center justify-center mb-1">
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </div>
                {#if isHovered}
                    <span
                        class="text-[10px] font-medium text-center leading-tight"
                        >Usuários</span
                    >
                {/if}
            </a>
        {/if}
    </nav>

    <!-- User Info -->
    <div
        class="p-2 border-t relative flex flex-col items-center"
        style="border-color: #5A5A8A;"
    >
        <button
            on:click={() => (showProfileMenu = !showProfileMenu)}
            class="flex flex-col items-center justify-center mb-3 w-full hover:bg-white hover:bg-opacity-10 p-2 rounded transition-colors"
            title={!isHovered ? user?.usuario || user?.email || "Usuário" : ""}
        >
            <div
                class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden mb-1"
                style="background-color: #6264A7;"
            >
                {#if user?.profile_image}
                    <img
                        src={user.profile_image}
                        alt="Profile"
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <span class="text-white font-medium text-xs"
                        >{user?.usuario
                            ? user.usuario[0].toUpperCase()
                            : "U"}</span
                    >
                {/if}
            </div>
            {#if isHovered}
                <span
                    class="text-[10px] font-medium text-center leading-tight truncate w-full px-1"
                >
                    {user?.usuario || user?.email || "Usuário"}
                </span>
            {/if}
        </button>

        <UserProfile
            {user}
            isOpen={showProfileMenu}
            positionClass="absolute bottom-full left-full mb-2 ml-2"
            on:close={() => (showProfileMenu = false)}
            on:logout={onLogout}
        />

        <button
            on:click={onLogout}
            class="w-full p-2 rounded text-white hover:bg-white hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center"
            title={!isHovered ? "Sair" : ""}
        >
            <div class="flex items-center justify-center mb-1">
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            </div>
            {#if isHovered}
                <span class="text-[10px] font-medium text-center leading-tight"
                    >Sair</span
                >
            {/if}
        </button>
    </div>
</div>
