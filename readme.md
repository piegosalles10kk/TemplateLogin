# 🚀 Template de Login Completo com Node.js

Um template robusto e pronto para produção que fornece um sistema completo de autenticação e gerenciamento de usuários usando Node.js, Express, MongoDB e JWT.

## ✨ Características Principais

- **Autenticação JWT** com tokens seguros
- **CRUD completo** de usuários
- **Sistema de recuperação de senha** via email
- **Validações robustas** e tratamento de erros
- **Middleware de segurança** para rotas protegidas
- **Templates HTML responsivos** para emails
- **Containerização com Docker** para fácil deploy
- **Estrutura modular** e escalável

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash de senhas
- **Nodemailer** - Envio de emails
- **Docker** - Containerização

## 📁 Estrutura de Arquivos

```
src/
├── controllers/
│   ├── userControllers.js     # Lógica de usuários e autenticação
│   └── emailController.js     # Controlador dedicado para emails
├── middleware/
│   └── checkToken.js          # Middleware de validação JWT
├── routes/
│   └── userRoutes.js          # Definição de rotas da API
├── models/
│   └── model.js               # Schema do usuário no MongoDB
├── config/
│   └── config.js              # Configuração do banco de dados
└── utils/
    └── secret.js              # Chave secreta do JWT
```

## 🔧 Configuração e Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/piegosalles10kk/TemplateLogin
cd template-login
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# JWT Secret
SECRET=sua_chave_secreta_jwt_super_segura_aqui

# Configurações de Email (Gmail)
EMAIL_USER=seu.email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail

# Configurações da Aplicação
APP_NAME=Nome da Sua Aplicação
PORT=1000

# MongoDB (se não usar Docker)
MONGODB_URI=mongodb://localhost:27017/LoginTeste
```

### 4. Executar com Docker (Recomendado)
```bash
# Construir e iniciar os containers
docker-compose up --build

# Para executar em background
docker-compose up -d
```

### 5. Executar Localmente
```bash
# Certifique-se que o MongoDB está rodando
npm start
```

## 📋 API Endpoints

### 🔓 Rotas Públicas (sem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Criar nova conta de usuário |
| `POST` | `/api/auth/login` | Autenticar usuário e retornar JWT |
| `GET` | `/api/auth/recover/:email` | Enviar código de recuperação por email |
| `GET` | `/api/auth/verify-code/:email/:codigo` | Verificar código de recuperação |
| `PUT` | `/api/auth/update-password-recovery` | Atualizar senha via recuperação |

### 🔒 Rotas Protegidas (requer JWT token)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/users` | Listar todos os usuários |
| `GET` | `/api/users/:id` | Buscar usuário específico |
| `PUT` | `/api/users/:id` | Atualizar dados do usuário |
| `DELETE` | `/api/users/:id` | Deletar usuário |

## 🔐 Como Usar a Autenticação

### 1. Registrar Usuário
```javascript
POST /api/auth/register
{
    "nome_usuario": "João Silva",
    "email_usuario": "joao@email.com",
    "telefone_usuario": 11999999999,
    "data_nascimento_usuario": "1990-01-01",
    "cargo_usuario": "Desenvolvedor",
    "acessos_usuario": ["admin", "user"],
    "senha_usuario": "senha123",
    "confirmarSenha": "senha123"
}
```

### 2. Fazer Login
```javascript
POST /api/auth/login
{
    "email_usuario": "joao@email.com",
    "senha_usuario": "senha123"
}

// Resposta:
{
    "msg": "Autenticação realizada com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "64a7b8c9d1e2f3g4h5i6j7k8"
}
```

### 3. Usar Token nas Requisições
```javascript
Headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📧 Sistema de Recuperação de Senha

### 1. Configurar Email (Gmail)
Para usar o Gmail, você precisa:
1. Ativar a verificação em 2 etapas na sua conta Google
2. Gerar uma "Senha de app" nas configurações de segurança
3. Usar essa senha no campo `EMAIL_PASS`

### 2. Fluxo de Recuperação

**Passo 1: Solicitar código**
```javascript
GET /api/auth/recover/joao@email.com
```

**Passo 2: Verificar código**
```javascript
GET /api/auth/verify-code/joao@email.com/ABC123
```

**Passo 3: Atualizar senha**
```javascript
PUT /api/auth/update-password-recovery
{
    "email_usuario": "joao@email.com",
    "codigoRecuperarSenha": "ABC123",
    "senha_usuario": "novaSenha123",
    "confirmarSenha": "novaSenha123"
}
```

## 🎨 Customização

### 1. Campos do Schema User

Para adicionar novos campos, edite `src/models/model.js`:

```javascript
const UserSchema = new mongoose.Schema({
    // Campos existentes...
    nome_usuario: { type: String, required: true },
    email_usuario: { type: String, required: true },
    
    // Seus novos campos aqui
    empresa_usuario: { type: String, required: false },
    avatar_usuario: { type: String, required: false },
    status_usuario: { type: String, default: 'ativo' },
    created_at: { type: Date, default: Date.now }
});
```

### 2. Personalizar Validações

Em `src/controllers/userControllers.js`, na função `createUser`:

```javascript
// Validações customizadas
if (telefone_usuario.toString().length !== 11) {
    return res.status(422).json({ 
        message: 'Telefone deve ter 11 dígitos!' 
    });
}

// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email_usuario)) {
    return res.status(422).json({ 
        message: 'Formato de email inválido!' 
    });
}
```

### 3. Personalizar Resposta do Login

```javascript
// Em loginUser(), personalizar retorno
res.status(200).json({
    msg: 'Autenticação realizada com sucesso',
    token,
    user: {
        id: user._id,
        nome: user.nome_usuario,
        email: user.email_usuario,
        cargo: user.cargo_usuario,
        acessos: user.acessos_usuario
    }
});
```

### 4. Templates de Email Customizados

Edite a função `getEmailTemplate` em `userControllers.js`:

```javascript
const getEmailTemplate = (codigo, appName = 'Sua App', userName = '') => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Seus estilos personalizados */
            .custom-button {
                background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Olá ${userName}!</h1>
            <p>Seu código de recuperação:</p>
            <div class="code-container">
                <span class="code">${codigo}</span>
            </div>
            <!-- Seu conteúdo personalizado -->
        </div>
    </body>
    </html>
    `;
};
```

### 5. Middleware de Autorização Personalizado

Crie middlewares específicos para diferentes níveis de acesso:

```javascript
// src/middleware/checkAdmin.js
const checkAdmin = (req, res, next) => {
    // Assumindo que você tem os dados do usuário no req.user
    const user = req.user;
    
    if (!user.acessos_usuario.includes('admin')) {
        return res.status(403).json({ 
            msg: 'Acesso restrito a administradores' 
        });
    }
    
    next();
};
```

## 🛡️ Recursos de Segurança

### ✅ Implementados
- **Hashing de senhas** com bcrypt (salt 12)
- **JWT seguro** com expiração configurável
- **Validação de entrada** robusta
- **Códigos de recuperação** aleatórios e únicos
- **Headers de segurança** básicos via CORS
- **Sanitização** de dados de entrada

### 🔄 Melhorias Sugeridas
- Rate limiting para APIs
- Validação de força de senha
- Logs de auditoria
- Blacklist de tokens JWT
- Captcha para endpoints sensíveis

## 🐳 Docker

O projeto inclui configuração completa para Docker:

**Dockerfile** - Container da aplicação Node.js
**docker-compose.yml** - Orquestração da aplicação + MongoDB

```bash
# Comandos úteis do Docker
docker-compose up --build    # Construir e iniciar
docker-compose down          # Parar containers
docker-compose logs app      # Ver logs da aplicação
docker-compose exec app bash # Acessar container
```

## 📊 Banco de Dados

### Conexão MongoDB
A conexão é configurada em `src/config/config.js`:

```javascript
// Para Docker
const dbURI = `mongodb://mongodb:27017/LoginTeste`;

// Para desenvolvimento local
const dbURI = `mongodb://localhost:27017/LoginTeste`;
```

### Schema do Usuário
```javascript
{
    _id: ObjectId,
    nome_usuario: String,
    email_usuario: String (unique),
    telefone_usuario: Number,
    data_nascimento_usuario: Date,
    cargo_usuario: String,
    acessos_usuario: Array,
    senha_usuario: String (hashed),
    codigoRecuperarSenha: String (opcional)
}
```

## 🧪 Testes

Para testar a API, você pode usar:

### Curl
```bash
# Registrar usuário
curl -X POST http://localhost:1000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome_usuario":"Teste","email_usuario":"teste@email.com","senha_usuario":"123456","confirmarSenha":"123456"}'

# Login
curl -X POST http://localhost:1000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_usuario":"teste@email.com","senha_usuario":"123456"}'
```

### Postman/Insomnia
1. Importe a coleção de endpoints
2. Configure a variável `{{baseURL}}` como `http://localhost:1000`
3. Após o login, configure `{{token}}` com o JWT retornado

## 🚀 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
SECRET=chave_super_secreta_producao_64_caracteres_minimo
MONGODB_URI=mongodb://usuario:senha@host:port/database
EMAIL_USER=noreply@suaempresa.com
EMAIL_PASS=senha_segura_email
```

### Considerações de Produção
- Use um reverse proxy (Nginx)
- Configure SSL/TLS
- Implemente rate limiting
- Configure logs estruturados
- Use variáveis de ambiente seguras
- Configure backup do banco de dados


---

⭐ Se este template foi útil para você, considere dar uma estrela no repositório!
