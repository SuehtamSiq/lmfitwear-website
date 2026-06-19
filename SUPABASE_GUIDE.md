# Configuração do Supabase no Projeto

Este documento orienta como conectar e utilizar o Supabase como banco de dados e serviço de autenticação no site.

## 🚀 Como Começar

### 1. Pré-requisitos
* Conta criada no [Supabase](https://supabase.com)
* Um projeto ativo no painel do Supabase
* Node.js instalado (se usar gerenciador de pacotes)

### 2. Instalação da Biblioteca
Instale o cliente oficial do Supabase no diretório do seu projeto:

```bash
npm install @supabase/supabase-js
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do seu projeto e adicione as suas credenciais (encontradas em *Project Settings > API* no painel do Supabase):

```env
SUPABASE_URL=sua_supabase_url_aqui
SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

---

## 🛠️ Inicialização do Cliente

Crie um arquivo de configuração (ex: `supabaseClient.js` ou `supabaseClient.ts`) e insira o código abaixo:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 📖 Exemplos de Uso Comuns

### Buscar Dados (SELECT)
```javascript
const { data, error } = await supabase
  .from('nome_da_tabela')
  .select('*')
```

### Inserir Dados (INSERT)
```javascript
const { data, error } = await supabase
  .from('nome_da_tabela')
  .insert([{ campo1: 'valor1', campo2: 'valor2' }])
```

### Autenticação (Cadastro de Usuário)
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@email.com',
  password: 'senha_segura_aqui',
})
```

---

## 🔒 Segurança (Políticas de RLS)
Lembre-se de ativar o **Row Level Security (RLS)** no painel do Supabase para todas as tabelas em produção. Crie políticas específicas para permitir que os usuários leiam ou escrevam dados com segurança.
