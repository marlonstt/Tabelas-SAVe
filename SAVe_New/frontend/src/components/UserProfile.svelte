<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import api from "../lib/api";

    export let user: any;
    export let isOpen = false;
    export let positionClass = "absolute right-0 mt-2";

    const dispatch = createEventDispatcher();

    let showChangePassword = false;
    let passwordData = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    let currentPasswordError = "";
    let confirmPasswordError = "";

    function close() {
        dispatch("close");
    }

    function logout() {
        dispatch("logout");
    }

    function validatePasswordStrength(password: string): string {
        if (password.length < 8) {
            return "A senha deve ter no mínimo 8 caracteres.";
        }
        if (!/[A-Z]/.test(password)) {
            return "A senha deve conter pelo menos uma letra maiúscula.";
        }
        if (!/[a-z]/.test(password)) {
            return "A senha deve conter pelo menos uma letra minúscula.";
        }
        if (!/[0-9]/.test(password)) {
            return "A senha deve conter pelo menos um número.";
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return "A senha deve conter pelo menos um caractere especial.";
        }
        return "";
    }

    async function handleChangePassword() {
        // Reset errors
        currentPasswordError = "";
        confirmPasswordError = "";

        // Validate password strength
        const strengthError = validatePasswordStrength(
            passwordData.newPassword,
        );
        if (strengthError) {
            confirmPasswordError = strengthError;
            return;
        }

        // Validate matching passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            confirmPasswordError = "As senhas devem ser iguais!";
            return;
        }

        try {
            await api.post("/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            alert("Senha alterada com sucesso");
            showChangePassword = false;
            passwordData = {
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            };
            currentPasswordError = "";
            confirmPasswordError = "";
        } catch (error: any) {
            // Check if it's a wrong current password error
            const errorMsg = error.response?.data?.error || "";
            if (
                errorMsg.includes("incorreta") ||
                errorMsg.includes("incorrect")
            ) {
                currentPasswordError = "Senha incorreta.";
            } else {
                alert(errorMsg || "Erro ao alterar senha");
            }
        }
    }

    async function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];

        // Criar um elemento de imagem para redimensionar
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = async () => {
            // Criar canvas para redimensionar
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Definir tamanho fixo de 600x600
            const targetSize = 600;
            canvas.width = targetSize;
            canvas.height = targetSize;

            // Calcular dimensões para manter proporção e preencher o quadrado
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = img.width;
            let sourceHeight = img.height;

            // Crop para quadrado (pega o centro da imagem)
            if (img.width > img.height) {
                sourceX = (img.width - img.height) / 2;
                sourceWidth = img.height;
            } else if (img.height > img.width) {
                sourceY = (img.height - img.width) / 2;
                sourceHeight = img.width;
            }

            // Desenhar imagem redimensionada
            ctx?.drawImage(
                img,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                targetSize,
                targetSize,
            );

            // Converter para base64 com qualidade otimizada
            const base64Image = canvas.toDataURL("image/jpeg", 0.85);

            try {
                const response = await api.post("/update-profile-image", {
                    profileImage: base64Image,
                });
                user.profile_image = base64Image;
                localStorage.setItem("user", JSON.stringify(user));

                // Dispatch custom event to update UI across all components
                window.dispatchEvent(
                    new CustomEvent("profileUpdated", {
                        detail: user,
                    }),
                );

                alert("Foto de perfil atualizada com sucesso!");
            } catch (error: any) {
                alert(
                    error.response?.data?.error ||
                        "Erro ao atualizar foto de perfil",
                );
            }
        };

        reader.readAsDataURL(file);
    }
</script>

{#if isOpen}
    <div
        class="{positionClass} w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
    >
        <div class="p-4 border-b border-gray-100 flex items-center space-x-3">
            <input
                type="file"
                accept="image/*"
                class="hidden"
                id="profile-image-upload"
                on:change={handleImageUpload}
            />
            <button
                on:click={() =>
                    document.getElementById("profile-image-upload")?.click()}
                class="w-12 h-12 bg-save-primary rounded-full flex items-center justify-center text-white text-xl font-bold hover:bg-save-secondary transition-colors cursor-pointer relative group flex-shrink-0"
                title="Clique para alterar foto de perfil"
            >
                {#if user.profile_image}
                    <img
                        src={user.profile_image}
                        alt="Profile"
                        class="w-full h-full rounded-full object-cover"
                    />
                {:else}
                    {user.usuario ? user.usuario.charAt(0).toUpperCase() : "U"}
                {/if}
                <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center"
                >
                    <span
                        class="material-icons text-white opacity-0 group-hover:opacity-100 text-sm"
                        >upload</span
                    >
                </div>
            </button>
            <div>
                <h3 class="font-bold text-gray-800">
                    {user.usuario || "Usuário"}
                </h3>
                <p class="text-sm text-gray-500 truncate w-48">{user.email}</p>
                <span
                    class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mt-1 inline-block font-bold uppercase"
                >
                    {user.role || "User"}
                </span>
            </div>
        </div>

        <div class="p-2">
            {#if showChangePassword}
                <div class="p-2 space-y-3">
                    <h4 class="font-medium text-sm text-gray-700">
                        Alterar Senha
                    </h4>
                    <div>
                        <input
                            type="password"
                            placeholder="Senha Atual"
                            class="w-full px-3 py-2 border rounded text-sm text-gray-900 {currentPasswordError
                                ? 'border-red-500'
                                : ''}"
                            bind:value={passwordData.currentPassword}
                        />
                        {#if currentPasswordError}
                            <p class="text-red-600 text-xs mt-1">
                                {currentPasswordError}
                            </p>
                        {/if}
                    </div>
                    <input
                        type="password"
                        placeholder="Nova Senha"
                        class="w-full px-3 py-2 border rounded text-sm text-gray-900"
                        bind:value={passwordData.newPassword}
                    />
                    <div>
                        <input
                            type="password"
                            placeholder="Confirmar Nova Senha"
                            class="w-full px-3 py-2 border rounded text-sm text-gray-900 {confirmPasswordError
                                ? 'border-red-500'
                                : ''}"
                            bind:value={passwordData.confirmPassword}
                        />
                        {#if confirmPasswordError}
                            <p class="text-red-600 text-xs mt-1">
                                {confirmPasswordError}
                            </p>
                        {/if}
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button
                            on:click={() => (showChangePassword = false)}
                            class="text-xs px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            on:click={handleChangePassword}
                            class="text-xs px-3 py-1 bg-save-primary text-white rounded hover:bg-save-secondary"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            {:else}
                <button
                    on:click={() => (showChangePassword = true)}
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-2"
                >
                    <span>Alterar Senha</span>
                </button>
                <button
                    on:click={logout}
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center space-x-2"
                >
                    <span>Sair</span>
                </button>
            {/if}
        </div>
    </div>

    <!-- Overlay to close on click outside -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="fixed inset-0 z-40" on:click={close}></div>
{/if}
