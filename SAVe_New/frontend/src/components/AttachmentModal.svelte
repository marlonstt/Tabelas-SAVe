<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import api from "../lib/api";

    export let isOpen = false;
    export let caseId: string;
    export let activeTabId: string;
    export let visibleSections: { id: string; label: string }[] = [];

    const dispatch = createEventDispatcher();

    let attachments: any[] = [];
    let loading = false;
    let uploadLoading = false;
    let fileInput: HTMLInputElement;
    let selectedFile: File | null = null;

    $: activeSectionLabel =
        visibleSections.find((s) => s.id === activeTabId)?.label || activeTabId;

    // Group attachments by screen label
    $: groupedAttachments = visibleSections.reduce(
        (acc, section) => {
            // Find all attachments for this section ID (using strict check or normalized check)
            // The backend saves the 'Tela' as string. Ideally we save the ID.
            // Let's assume we save the ID (activeTabId) to DB 'Tela' column
            const sectionAttachments = attachments.filter(
                (a) => a.Tela === section.id,
            );
            if (sectionAttachments.length > 0) {
                acc[section.label] = sectionAttachments;
            }
            return acc;
        },
        {} as Record<string, any[]>,
    );

    $: if (isOpen && caseId) {
        loadAttachments();
        selectedFile = null;
    }

    async function loadAttachments() {
        loading = true;
        try {
            const res = await api.get(`/cases/${caseId}/attachments`);
            attachments = res.data;
        } catch (err) {
            console.error("Error loading attachments:", err);
            alert("Erro ao carregar anexos.");
        } finally {
            loading = false;
        }
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedFile = target.files[0];
        }
    }

    async function uploadFile() {
        if (!selectedFile) return;

        uploadLoading = true;
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("tela", activeTabId); // Saving 'dadosEntrada', 'identificacao', etc.

        try {
            await api.post(`/cases/${caseId}/attachments`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Arquivo anexado com sucesso!");
            selectedFile = null;
            if (fileInput) fileInput.value = "";
            await loadAttachments();
        } catch (err) {
            console.error("Error uploading file:", err);
            alert("Erro ao enviar arquivo.");
        } finally {
            uploadLoading = false;
        }
    }

    async function downloadFile(attachment: any) {
        try {
            // Using window.open or creating a temporary link to trigger download
            // Since the endpoint sets Content-Disposition attachment, standard link works.
            // However, auth token is needed. 'api' is configured with interceptor probably?
            // Usually axios interceptor adds token. Simple href won't work if auth encoded in header only.
            // We must fetch blob and save.
            const response = await api.get(
                `/attachments/${attachment.ID}/download`,
                {
                    responseType: "blob",
                },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", attachment.Nome_Arquivo);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed:", err);
            alert("Erro ao baixar arquivo.");
        }
    }

    async function deleteAttachment(attachment: any) {
        if (
            !confirm(
                `Tem certeza que deseja excluir o anexo "${attachment.Nome_Arquivo}"?`,
            )
        ) {
            return;
        }

        try {
            await api.delete(`/attachments/${attachment.ID}`);
            await loadAttachments();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Erro ao excluir arquivo.");
        }
    }

    function close() {
        dispatch("close");
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
    >
        <div
            class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        >
            <!-- Header -->
            <div
                class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center"
            >
                <h3
                    class="text-xl font-bold text-gray-800 flex items-center gap-2"
                >
                    <span class="material-icons text-save-primary"
                        >attach_file</span
                    >
                    Gerenciar Anexos
                </h3>
                <button
                    on:click={close}
                    class="text-gray-500 hover:text-gray-700"
                >
                    <span class="material-icons">close</span>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto flex-1">
                <!-- Upload Section -->
                <div
                    class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                    <h4
                        class="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wide"
                    >
                        Anexar em: {activeSectionLabel}
                    </h4>

                    <div class="flex gap-2 items-center">
                        <input
                            bind:this={fileInput}
                            type="file"
                            class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                file:cursor-pointer hover:file:bg-blue-600"
                            on:change={handleFileSelect}
                        />

                        <button
                            disabled={!selectedFile || uploadLoading}
                            on:click={uploadFile}
                            class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                        >
                            {#if uploadLoading}
                                <span
                                    class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"
                                ></span>
                            {:else}
                                <span class="material-icons text-sm"
                                    >cloud_upload</span
                                >
                            {/if}
                            Enviar
                        </button>
                    </div>
                </div>

                <!-- List Section -->
                <div>
                    <h4
                        class="text-lg font-bold text-gray-800 mb-4 border-b pb-2"
                    >
                        Arquivos Anexados
                    </h4>

                    {#if loading}
                        <div class="flex justify-center py-8">
                            <span
                                class="animate-spin h-8 w-8 border-4 border-save-primary rounded-full border-t-transparent"
                            ></span>
                        </div>
                    {:else if Object.keys(groupedAttachments).length === 0}
                        <p class="text-gray-500 text-center py-4 italic">
                            Nenhum anexo encontrado para as seções visíveis.
                        </p>
                    {:else}
                        <div class="space-y-6">
                            {#each Object.entries(groupedAttachments) as [label, files]}
                                <div class="bg-white">
                                    <h5
                                        class="font-bold text-gray-700 mb-2 flex items-center gap-2"
                                    >
                                        <span
                                            class="w-1.5 h-1.5 bg-save-accent rounded-full"
                                        ></span>
                                        {label}
                                    </h5>
                                    <ul class="space-y-2 pl-4">
                                        {#each files as file}
                                            <li
                                                class="flex items-center justify-between group p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors"
                                            >
                                                <div
                                                    class="flex items-center gap-3 overflow-hidden"
                                                >
                                                    <!-- Icon based on type? Simplification: generic icon -->
                                                    <span
                                                        class="material-icons text-gray-400"
                                                        >description</span
                                                    >
                                                    <span
                                                        class="text-sm font-medium text-gray-700 truncate"
                                                        title={file.Nome_Arquivo}
                                                        >{file.Nome_Arquivo}</span
                                                    >
                                                    <span
                                                        class="text-xs text-gray-400"
                                                        >({new Date(
                                                            file.Criado_Em,
                                                        ).toLocaleDateString()})</span
                                                    >
                                                </div>

                                                <div class="flex items-center">
                                                    <button
                                                        on:click={() =>
                                                            downloadFile(file)}
                                                        class="p-1 text-blue-600 hover:bg-blue-100 rounded tooltip"
                                                        title="Baixar"
                                                    >
                                                        <span
                                                            class="material-icons text-base"
                                                            >download</span
                                                        >
                                                    </button>
                                                    <button
                                                        on:click={() =>
                                                            deleteAttachment(
                                                                file,
                                                            )}
                                                        class="p-1 text-red-600 hover:bg-red-100 rounded tooltip ml-1"
                                                        title="Excluir"
                                                    >
                                                        <span
                                                            class="material-icons text-base"
                                                            >delete</span
                                                        >
                                                    </button>
                                                </div>
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-end">
                <button
                    on:click={close}
                    class="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    </div>
{/if}
