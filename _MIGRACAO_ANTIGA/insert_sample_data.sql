-- Inserir dados de teste no banco SAVe

-- Inserir casos de exemplo
INSERT INTO "SAVe_Geral" ("ID_Caso", "Nome", "Num_Processo", "Tipo_Vitima", "Comarca", "Data", "Tipo_Crime", "Encerrado")
VALUES 
(1, 'Maria Silva Santos', '0001234-56.2024.8.13.0024', 'Primária', 'Belo Horizonte', '2024-01-15', 'Violência Doméstica', 'Não'),
(2, 'João Pedro Oliveira', '0002345-67.2024.8.13.0145', 'Secundária', 'Contagem', '2024-02-20', 'Ameaça', 'Não'),
(3, 'Ana Paula Costa', '0003456-78.2024.8.13.0024', 'Primária', 'Belo Horizonte', '2024-03-10', 'Lesão Corporal', 'Sim');

-- Inserir dados de entrada
INSERT INTO "SAVe_DadosDeEntrada" ("ID_Caso", "Data", "Comarca_origem", "Quem_encaminha", "PE_nome", "Classificacao_crime", "Classificacao_vitima")
VALUES 
(1, '2024-01-15', 'Belo Horizonte', 'Delegacia Especializada', 'Dr. Carlos Mendes', 'Violência Doméstica', 'Vítima Direta'),
(2, '2024-02-20', 'Contagem', 'Ministério Público', 'Dra. Fernanda Lima', 'Ameaça', 'Vítima Direta'),
(3, '2024-03-10', 'Belo Horizonte', 'Defensoria Pública', 'Dr. Roberto Santos', 'Lesão Corporal', 'Vítima Direta');

-- Inserir identificação
INSERT INTO "SAVe_Identificacao" ("ID_Caso", "Nome_RC", "Data_nascimento", "Idade", "Naturalidade", "Nacionalidade")
VALUES 
(1, 'Maria Silva Santos', '1985-05-20', '39', 'Belo Horizonte', 'Brasileira'),
(2, 'João Pedro Oliveira', '1990-08-15', '34', 'Contagem', 'Brasileira'),
(3, 'Ana Paula Costa', '1978-12-03', '46', 'Belo Horizonte', 'Brasileira');

-- Inserir endereços
INSERT INTO "SAVe_Identificacao_endereco" ("ID_Caso", "Endereco", "Numero", "Bairro", "Cidade", "UF", "CEP")
VALUES 
(1, 'Rua das Flores', '123', 'Centro', 'Belo Horizonte', 'MG', '30110-000'),
(2, 'Avenida Brasil', '456', 'Industrial', 'Contagem', 'MG', '32010-000'),
(3, 'Rua Paraíba', '789', 'Funcionários', 'Belo Horizonte', 'MG', '30130-000');

-- Confirmar inserção
SELECT 'Dados de teste inseridos com sucesso!' as status;
SELECT COUNT(*) as total_casos FROM "SAVe_Geral";
