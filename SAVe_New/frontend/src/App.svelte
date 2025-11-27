<script lang="ts">
  import Login from "./routes/Login.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import CaseDetail from "./routes/CaseDetail.svelte";
  import TelaEntrada from "./routes/TelaEntrada.svelte";
  import { onMount } from "svelte";

  let currentPath = window.location.pathname;
  // Initialize synchronously to avoid flash of login screen
  let isAuthenticated = !!localStorage.getItem("token");
  let caseId = "";

  onMount(() => {
    console.log("App mounted. Path:", currentPath, "Auth:", isAuthenticated);

    // Simple routing
    window.addEventListener("popstate", () => {
      currentPath = window.location.pathname;
      console.log("Path changed:", currentPath);
    });

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
{:else if currentPath === "/menu"}
  <TelaEntrada />
{:else}
  <div class="min-h-screen bg-save-surface font-sans flex flex-col">
    <!-- Global Navbar -->
    <nav class="bg-save-primary text-white shadow-lg z-50">
      <div
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-save-primary font-bold"
          >
            S
          </div>
          <div class="font-bold text-xl tracking-tight">SAVe System</div>
        </div>

        <div class="flex items-center space-x-6">
          <a
            href="/menu"
            class="text-blue-100 hover:text-white transition-colors font-medium flex items-center"
          >
            <span class="material-icons text-sm mr-1">home</span> Menu
          </a>
          <a
            href="/"
            class="text-blue-100 hover:text-white transition-colors font-medium flex items-center"
          >
            <span class="material-icons text-sm mr-1">dashboard</span> Dashboard
          </a>
          <div class="h-4 w-px bg-blue-700"></div>
          <button
            on:click={logout}
            class="px-4 py-1.5 bg-red-600/90 text-white rounded-md hover:bg-red-500 transition-colors text-sm font-medium flex items-center shadow-sm"
          >
            <span class="material-icons text-sm mr-1">logout</span> Sair
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative">
      {#if currentPath.startsWith("/case/")}
        <!-- CaseDetail handles its own layout/container -->
        <CaseDetail id={caseId} />
      {:else}
        <!-- Dashboard Container -->
        <div class="container mx-auto p-6 flex-1">
          <Dashboard />
        </div>
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
