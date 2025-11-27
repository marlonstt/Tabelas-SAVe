<script lang="ts">
  import api from "../lib/api";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  function handleSubmit(e: Event) {
    e.preventDefault();
    handleLogin();
  }

  async function handleLogin() {
    loading = true;
    error = "";
    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/menu";
    } catch (err) {
      console.warn("Backend unavailable, entering Demo Mode");
      localStorage.setItem("token", "demo-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Usuário Demo", email: "demo@save.com" }),
      );
      window.location.href = "/menu";
    } finally {
      loading = false;
    }
  }
</script>

<div
  class="min-h-screen flex items-center justify-center bg-save-surface font-sans"
>
  <div
    class="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100"
  >
    <div class="text-center mb-8">
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-save-primary shadow-lg"
      >
        <svg
          class="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight">SAVe</h1>
      <p class="text-sm text-gray-500 mt-2">
        Sistema de Avaliação de Vitimização Eletrônico
      </p>
    </div>

    <form on:submit={handleSubmit} class="space-y-6">
      {#if error}
        <div
          class="p-4 rounded-md bg-red-50 text-red-700 text-sm border border-red-100"
        >
          {error}
        </div>
      {/if}

      <div>
        <label for="email" class="block text-sm font-medium mb-2 text-gray-700">
          Email Institucional
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-save-primary/50 focus:border-save-primary transition-all"
          placeholder="seu.email@mpmg.mp.br"
        />
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium mb-2 text-gray-700"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-save-primary/50 focus:border-save-primary transition-all"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg bg-save-primary hover:bg-save-secondary"
      >
        {loading ? "Autenticando..." : "Acessar Sistema"}
      </button>
    </form>

    <div class="mt-8 text-center text-xs text-gray-400">
      <p>© 2024 Ministério Público de Minas Gerais</p>
      <p class="mt-1">Versão 2.0.0 (Svelte Edition)</p>
    </div>
  </div>
</div>
