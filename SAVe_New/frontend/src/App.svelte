<script lang="ts">
  import { onMount } from "svelte";
  import Login from "./routes/Login.svelte";
  import TelaEntrada from "./routes/TelaEntrada.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import CaseDetail from "./routes/CaseDetail.svelte";
  import TelaGestaoUsuarios from "./routes/TelaGestaoUsuarios.svelte";
  import TelaDashboards from "./routes/TelaDashboards.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Responsaveis from "./components/Responsaveis.svelte";

  let currentPath = window.location.pathname;
  // Initialize synchronously to avoid flash of login screen
  let isAuthenticated = !!localStorage.getItem("token");
  let caseId = "";
  let user = JSON.parse(localStorage.getItem("user") || "{}");

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
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar {user} {currentPath} onLogout={logout} />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col relative overflow-hidden"
      style="background: linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%);"
    >
      <!-- Footer Vinheta (Background) -->
      <img
        src="/CasaLilian-vinheta.png"
        alt="Vinheta Casa Lilian"
        class="absolute bottom-0 right-0 w-full h-auto object-cover opacity-40 pointer-events-none z-0"
      />

      <!-- Content Scrollable -->
      <main class="flex-1 overflow-auto relative z-10 p-4">
        {#if currentPath === "/menu"}
          <TelaEntrada />
        {:else if currentPath === "/admin/users"}
          <TelaGestaoUsuarios />
        {:else if currentPath === "/admin/responsaveis"}
          <Responsaveis />
        {:else if currentPath === "/"}
          <Dashboard />
        {:else if currentPath === "/dashboards"}
          <TelaDashboards />
        {:else if caseId}
          <CaseDetail id={caseId} />
        {:else}
          <Dashboard />
        {/if}
      </main>
    </div>
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
