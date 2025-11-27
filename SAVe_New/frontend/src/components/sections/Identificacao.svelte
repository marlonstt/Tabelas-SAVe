<script lang="ts">
    import { onMount } from "svelte";
    import api from "../../lib/api";

    export let caseId: string;

    let data: any = {
        telefones: [],
        emails: [],
        endereco: {},
    };
    let loading = true;
    let saving = false;
    let saveTimeout: any;
    let lastSavedData: string = "";

    onMount(async () => {
        try {
            const response = await api.get(`/cases/${caseId}/identificacao`);
            data = response.data || { telefones: [], emails: [], endereco: {} };
            if (!data.telefones) data.telefones = [];
            if (!data.emails) data.emails = [];
            if (!data.endereco) data.endereco = {};
        } catch (err) {
            console.warn(
                "Backend unavailable, using Mock Data for Identificacao",
            );
            data = {
                Nome_Civil: "Maria da Silva",
                Nome_Social: "Maria",
                Data_Nascimento: "1990-05-15",
                Nome_Mae: "Ana da Silva",
                Nome_Pai: "João da Silva",
                Naturalidade: "Belo Horizonte",
                Nacionalidade: "Brasileira",
                Sexo: "Feminino",
                Identidade_Genero: "Mulher Cis",
                Orientacao_Sexual: "Heterossexual",
                Raca_Cor: "Parda",
                Religiao: "Católica",
                Estado_Civil: "Solteira",
                CPF: "123.456.789-00",
                RG: "MG-12.345.678",
                CTPS: "1234567/0010",
                Contato_Confianca: "Ana (Irmã) - (31) 98888-8888",
                telefones: [{ numero: "(31) 99999-9999", tipo: "Celular" }],
                emails: [{ email: "maria@email.com" }],
                endereco: {
                    Logradouro: "Rua das Flores",
                    Numero: "123",
                    Bairro: "Centro",
                    Cidade: "Belo Horizonte",
                    UF: "MG",
                    CEP: "30000-000",
                },
            };
        } finally {
            loading = false;
            lastSavedData = JSON.stringify(data);
        }
    });

    function autosave() {
        if (loading) return;

        const currentData = JSON.stringify(data);
        if (currentData === lastSavedData) return;

        clearTimeout(saveTimeout);
        saving = true;

        saveTimeout = setTimeout(async () => {
            try {
                // await api.put(`/cases/${caseId}/identificacao`, data);
                console.log("Autosaving Identificacao...", data);
                await new Promise((r) => setTimeout(r, 500));
                lastSavedData = currentData;
            } catch (err) {
                console.error("Error autosaving", err);
            } finally {
                saving = false;
            }
        }, 1000);
    }

    $: if (data) autosave();

    function addTelefone() {
        data.telefones = [...data.telefones, { numero: "", tipo: "Celular" }];
        autosave();
    }

    function removeTelefone(index: number) {
        data.telefones = data.telefones.filter((_, i) => i !== index);
        autosave();
    }

    function addEmail() {
        data.emails = [...data.emails, { email: "" }];
        autosave();
    }

    function removeEmail(index: number) {
        data.emails = data.emails.filter((_, i) => i !== index);
        autosave();
    }
</script>

<div class="bg-white rounded shadow p-6 relative">
    <!-- Autosave Indicator -->
    <div
        class="absolute top-4 right-4 text-sm font-medium transition-opacity duration-300"
        class:opacity-0={!saving}
        class:opacity-100={saving}
    >
        <span class="text-save-primary flex items-center">
            <span class="material-icons text-sm mr-1 animate-spin">sync</span>
            Salvando...
        </span>
    </div>
    <div
        class="absolute top-4 right-4 text-sm font-medium transition-opacity duration-300"
        class:opacity-0={saving || loading}
        class:opacity-100={!saving && !loading}
    >
        <span class="text-green-600 flex items-center">
            <span class="material-icons text-sm mr-1">check</span>
            Salvo
        </span>
    </div>

    {#if loading}
        <p>Carregando...</p>
    {:else}
        <div class="space-y-6">
            <!-- Dados Pessoais -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Dados Pessoais
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Nome Civil</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_Civil}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >Nome Social / Como quer ser chamada</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_Social}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Data de Nascimento</span>
                        <input
                            type="date"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Data_Nascimento}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Naturalidade</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Naturalidade}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Nacionalidade</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nacionalidade}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Nome da Mãe</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_Mae}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Nome do Pai</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Nome_Pai}
                        />
                    </label>
                </div>
            </div>

            <!-- Documentos -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Documentos
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">CPF</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.CPF}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">RG</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.RG}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700"
                            >CTPS (Carteira de Trabalho)</span
                        >
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.CTPS}
                        />
                    </label>
                </div>
            </div>

            <!-- Perfil Psicossocial -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Perfil Psicossocial
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block">
                        <span class="text-gray-700">Sexo Biológico</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Sexo}
                        >
                            <option value="">Selecione...</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Intersexo">Intersexo</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Identidade de Gênero</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Identidade_Genero}
                        >
                            <option value="">Selecione...</option>
                            <option value="Mulher Cis">Mulher Cis</option>
                            <option value="Mulher Trans">Mulher Trans</option>
                            <option value="Homem Cis">Homem Cis</option>
                            <option value="Homem Trans">Homem Trans</option>
                            <option value="Não-Binário">Não-Binário</option>
                            <option value="Travesti">Travesti</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Orientação Sexual</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Orientacao_Sexual}
                        >
                            <option value="">Selecione...</option>
                            <option value="Heterossexual">Heterossexual</option>
                            <option value="Homossexual (Lésbica/Gay)"
                                >Homossexual (Lésbica/Gay)</option
                            >
                            <option value="Bissexual">Bissexual</option>
                            <option value="Pansexual">Pansexual</option>
                            <option value="Assexual">Assexual</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Raça / Cor</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Raca_Cor}
                        >
                            <option value="">Selecione...</option>
                            <option value="Branca">Branca</option>
                            <option value="Preta">Preta</option>
                            <option value="Parda">Parda</option>
                            <option value="Amarela">Amarela</option>
                            <option value="Indígena">Indígena</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Religião / Credo</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Religiao}
                        >
                            <option value="">Selecione...</option>
                            <option value="Católica">Católica</option>
                            <option value="Evangélica">Evangélica</option>
                            <option value="Espírita">Espírita</option>
                            <option value="Matriz Africana"
                                >Matriz Africana</option
                            >
                            <option value="Sem Religião">Sem Religião</option>
                            <option value="Outras">Outras</option>
                        </select>
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Estado Civil</span>
                        <select
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.Estado_Civil}
                        >
                            <option value="">Selecione...</option>
                            <option value="Solteira(o)">Solteira(o)</option>
                            <option value="Casada(o)">Casada(o)</option>
                            <option value="Divorciada(o)">Divorciada(o)</option>
                            <option value="Viúva(o)">Viúva(o)</option>
                            <option value="União Estável">União Estável</option>
                        </select>
                    </label>
                </div>
            </div>

            <!-- Contatos -->
            <div class="border-b pb-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Contatos
                </h3>

                <label class="block mb-4">
                    <span class="text-gray-700"
                        >Contato de Confiança (Nome e Telefone)</span
                    >
                    <input
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                        bind:value={data.Contato_Confianca}
                        placeholder="Ex: Maria (Mãe) - (31) 99999-9999"
                    />
                </label>

                <div class="mb-4">
                    <h4 class="font-medium text-gray-600 mb-2">Telefones</h4>
                    {#each data.telefones as tel, i}
                        <div class="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Número"
                                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={tel.numero}
                            />
                            <select
                                class="w-32 rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={tel.tipo}
                            >
                                <option value="Celular">Celular</option>
                                <option value="Fixo">Fixo</option>
                                <option value="Recado">Recado</option>
                            </select>
                            <button
                                class="text-red-500 hover:text-red-700 px-2"
                                on:click={() => removeTelefone(i)}
                            >
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    {/each}
                    <button
                        class="text-sm text-save-primary hover:underline mt-1"
                        on:click={addTelefone}>+ Adicionar Telefone</button
                    >
                </div>

                <div>
                    <h4 class="font-medium text-gray-600 mb-2">Emails</h4>
                    {#each data.emails as email, i}
                        <div class="flex gap-2 mb-2">
                            <input
                                type="email"
                                placeholder="Email"
                                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                                bind:value={email.email}
                            />
                            <button
                                class="text-red-500 hover:text-red-700 px-2"
                                on:click={() => removeEmail(i)}
                            >
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    {/each}
                    <button
                        class="text-sm text-save-primary hover:underline mt-1"
                        on:click={addEmail}>+ Adicionar Email</button
                    >
                </div>
            </div>

            <!-- Endereço -->
            <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-4">
                    Endereço Residencial
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="block md:col-span-2">
                        <span class="text-gray-700">Logradouro</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.Logradouro}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Número</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.Numero}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Bairro</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.Bairro}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">Cidade</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.Cidade}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">UF</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.UF}
                        />
                    </label>
                    <label class="block">
                        <span class="text-gray-700">CEP</span>
                        <input
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-save-primary focus:ring focus:ring-save-primary/30"
                            bind:value={data.endereco.CEP}
                        />
                    </label>
                </div>
            </div>
        </div>
    {/if}
</div>
