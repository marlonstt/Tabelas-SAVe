<script lang="ts">
  import { onMount } from "svelte";
  import Login from "./routes/Login.svelte";
  import TelaEntrada from "./routes/TelaEntrada.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import CaseDetail from "./routes/CaseDetail.svelte";
  import TelaGestaoUsuarios from "./routes/TelaGestaoUsuarios.svelte";
  import UserProfile from "./components/UserProfile.svelte";

  let currentPath = window.location.pathname;
  // Initialize synchronously to avoid flash of login screen
  let isAuthenticated = !!localStorage.getItem("token");
  let caseId = "";
  let user = JSON.parse(localStorage.getItem("user") || "{}");
  let showProfileMenu = false;

  onMount(() => {
    console.log("App mounted. Path:", currentPath, "Auth:", isAuthenticated);

    // Simple routing
    window.addEventListener("popstate", () => {
      currentPath = window.location.pathname;
      console.log("Path changed:", currentPath);
    });

    // Listen for profile image updates
    window.addEventListener("storage", (e) => {
      if (e.key === "user") {
        user = JSON.parse(e.newValue || "{}");
      }
    });

    // Listen for custom profile update event
    window.addEventListener("profileUpdated", ((e: CustomEvent) => {
      user = e.detail;
    }) as EventListener);

    // Redirect to menu if at root and authenticated
    // if (isAuthenticated && currentPath === "/") {
    //   // window.history.pushState({}, "", "/menu");
    //   // currentPath = "/menu";
    // }
  });

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  // Extract case ID from path
  $: {
    const match = currentPath.match(/^\/case\/(\d+)$/);
    if (match) {
      caseId = match[1];
    }
  }
</script>

<!-- Debug Info (Hidden in production) -->
<div style="display: none;">
  Path: {currentPath}, Auth: {isAuthenticated}
</div>

{#if currentPath === "/login" || !isAuthenticated}
  <Login />
{:else}
  <div class="min-h-screen bg-gray-100 flex flex-col relative">
    <!-- Footer Vinheta -->
    <img
      src="/CasaLilian-vinheta.png"
      alt="Vinheta Casa Lilian"
      class="fixed bottom-0 left-0 w-full h-auto object-cover opacity-50 pointer-events-none z-0"
    />
    <!-- Navbar -->
    <header class="bg-save-primary text-white shadow-md z-50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center space-x-4">
            <a
              href="/menu"
              class="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src="/logo_save_real.png" alt="SAVe Logo" class="h-10" />
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex space-x-4 ml-8">
              <a
                href="/menu"
                class="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium hover:bg-save-secondary transition-colors"
              >
                <span class="material-icons text-lg">home</span>
              </a>
              <a
                href="/"
                class="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium hover:bg-save-secondary transition-colors"
              >
                Casos
              </a>
              {#if user.role === "Admin" || user.role === "admin"}
                <a
                  href="/admin/users"
                  class="flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium hover:bg-save-secondary transition-colors"
                >
                  Usuários
                </a>
              {/if}
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <button
                on:click={() => (showProfileMenu = !showProfileMenu)}
                class="flex items-center space-x-2 focus:outline-none hover:bg-save-secondary p-2 rounded-lg transition-colors"
              >
                <div
                  class="w-8 h-8 bg-white text-save-primary rounded-full flex items-center justify-center font-bold"
                >
                  {user.usuario ? user.usuario.charAt(0).toUpperCase() : "U"}
                </div>
                <span class="hidden md:block text-sm font-medium"
                  >{user.usuario || "Usuário"}</span
                >
              </button>

              <UserProfile
                {user}
                isOpen={showProfileMenu}
                on:close={() => (showProfileMenu = false)}
                on:logout={logout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto relative z-10">
      {#if currentPath === "/menu"}
        <TelaEntrada />
      {:else if currentPath === "/admin/users"}
        <TelaGestaoUsuarios />
      {:else if currentPath === "/"}
        <Dashboard />
      {:else if caseId}
        <CaseDetail id={caseId} />
      {:else}
        <Dashboard />
      {/if}
    </main>
  </div>
{/if}

<style>
  :global(body) {
    font-family: "Inter", sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8fafc; /* save-surface */
  }
</style>
