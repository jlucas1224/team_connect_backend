# Backend do Projeto TeamConnect

![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-teal)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)

Backend da plataforma TeamConnect, uma rede social corporativa projetada para aproximar equipes remotas, fortalecer a cultura da empresa e aumentar o engajamento dos colaboradores.

## Tabela de Conteúdos

1.  [Sobre o Projeto](#sobre-o-projeto)
2.  [Funcionalidades Atuais](#funcionalidades-atuais)
3.  [Tecnologias Utilizadas](#tecnologias-utilizadas)
4.  [Configuração do Ambiente Local](#configuração-do-ambiente-local)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Banco de Dados](#banco-de-dados)
5.  [Como Rodar o Projeto](#como-rodar-o-projeto)
6.  [Documentação da API](#documentação-da-api)
    - [Empresas](#empresas)
    - [Usuários](#usuários)
    - [Posts](#posts)
    - [Cargos (Roles)](#cargos-roles)
7.  [Próximos Passos](#próximos-passos)

## Sobre o Projeto

O TeamConnect é uma solução SaaS (Software as a Service) que oferece um espaço privado e seguro para empresas criarem sua própria rede social interna. O objetivo é combater o distanciamento do trabalho home-office, permitindo interações sociais, reconhecimento entre colegas (kudos), organização de eventos e comunicação transparente, tudo alinhado à cultura e aos valores da empresa.

Este repositório contém a API RESTful construída em Node.js que serve como a espinha dorsal da plataforma.

## Funcionalidades Atuais

-   ✅ **Gestão Multi-empresa (Multi-tenancy):** Arquitetura preparada para que múltiplas empresas usem a plataforma de forma isolada e segura.
-   ✅ **Registro de Empresas:** Endpoint para que uma nova empresa se cadastre e crie seu primeiro usuário administrador.
-   ✅ **Sistema de Hierarquia e Permissões:**
    -   Criação de dados iniciais (seeding) para Níveis de Acesso e Permissões.
    -   API completa para **CRUD** (Create, Read, Update, Delete) de **Cargos (Roles)**.
-   ✅ **Feed Social Interativo:**
    -   Criação e listagem de posts.
    -   Sistema de **Likes** (curtir/descurtir).
    -   Sistema de **Comentários** (criar e listar por post).
-   ✅ **Diretório de Pessoas:**
    -   Listagem de usuários com filtros (por departamento) e busca (por nome, cargo, etc.).
    -   Visualização de perfil de usuário individual.

> **Nota:** Atualmente, os endpoints estão abertos para facilitar o desenvolvimento. A implementação de autenticação via JWT e o middleware de verificação de permissões são os próximos passos críticos.

## Tecnologias Utilizadas

-   **Backend:** [Node.js](https://nodejs.org/)
-   **Framework:** [Express.js](https://expressjs.com/pt-br/)
-   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Segurança de Senhas:** [Bcrypt.js](https://www.npmjs.com/package/bcryptjs)

## Configuração do Ambiente Local

Siga os passos abaixo para ter uma cópia do projeto rodando na sua máquina.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [PostgreSQL](https://www.postgresql.org/download/) (versão 12 ou superior)
-   Um cliente de API como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/) para testar os endpoints.

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/teamconnect-backend.git](https://github.com/seu-usuario/teamconnect-backend.git)
    cd teamconnect-backend
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto e configure suas variáveis.
    ```env
    # .env
    DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/teamconnect?schema=public"
    ```

### Banco de Dados

1.  Certifique-se de que seu serviço do PostgreSQL está rodando e crie um banco de dados vazio chamado `teamconnect`.

2.  Execute as migrações do Prisma para criar todas as tabelas:
    ```bash
    npx prisma migrate dev
    ```

3.  Execute o script de "seeding" para popular o banco com dados essenciais (Níveis de Acesso e Permissões):
    ```bash
    npx prisma db seed
    ```

## Como Rodar o Projeto

Após a configuração, inicie o servidor em modo de desenvolvimento:

```bash
npm start