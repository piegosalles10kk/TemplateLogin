# Templates Genéricos de Login

## 📁 Estrutura de Arquivos

```
src/
├── controllers/
│   ├── userController.js
│   └── emailController.js
├── middleware/
│   └── checkToken.js
├── routes/
│   ├── userRoutes.js
└── models/
    └── model.js
```

## 🔧 Variáveis de Ambiente

Adicione no seu arquivo `.env`:

```env
# JWT
SECRET=sua_chave_secreta_jwt_aqui

# Email (opcional - para recuperação de senha)
EMAIL_USER=seu.email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail

# App
APP_NAME=Nome da Sua Aplicação
```

## 🚀 Como Usar

### 1. Controller de Usuário

O `userController.js` inclui:
- ✅ **CRUD completo** (criar, buscar, atualizar, deletar)
- ✅ **Login** com JWT
- ✅ **Recuperação de senha** (gerar e verificar código)

### 2. Rotas

As rotas estão organizadas em:

**Rotas Públicas (sem token):**
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Login
- `GET /auth/recover/:email` - Enviar código
- `GET /auth/verify-code/:email/:codigo` - Verificar código
- `PUT /auth/update-password-recovery` - Atualizar senha

**Rotas Protegidas (com token):**
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### 3. Middleware

O middleware `checkToken` valida com base no token gerado pelo login (duração de 1h)

## 📧 Email (Opcional)

Se quiser implementar envio de email:

1. Configure as variáveis de ambiente
2. Use o `emailController.js`
3. Adicione as rotas de email

**Exemplo de uso do Gmail:**
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de app"
3. Use essa senha no `EMAIL_PASS`

## 🔄 Personalização

### Campos do Usuário
Ajuste no `createUser` os campos específicos do seu schema:

```javascript
const user = new User({
            nome_usuario,
            email_usuario,
            telefone_usuario,
            data_nascimento_usuario,
            cargo_usuario,
            acessos_usuario,
            senha_usuario: passwordHash,
    // etc...
});
```

### Validações
Adicione validações específicas conforme necessário:

```javascript
const missingFields = [];
if (!email_usuario) missingFields.push('email');
if (!nome_usuario) missingFields.push('nome');
// Adicione suas validações aqui
```

### Resposta do Login
Customize o que retornar no login:

```javascript
res.status(200).json({
    msg: 'Autenticação realizada com sucesso',
    token,
    id: user._id,
    // Adicione outros dados do usuário
    tipoDeConta: user.tipoDeConta,
    nome_usuario: user.nome_usuario
});
```

## 🛡️ Segurança

- ✅ Senhas são hasheadas com bcrypt (salt 12)
- ✅ JWT seguro usando variável de ambiente
- ✅ Códigos de recuperação aleatórios
- ✅ Middleware de autenticação robusto

## 📝 Exemplo de Schema User

Certifique-se que seu schema tenha pelo menos:

```javascript
const userSchema = new mongoose.Schema({
    email_usuario: { type: String, required: true, unique: true },
    nome_usuario: { type: String, required: true },
    senha_usuario: { type: String, required: true },
    codigoRecuperarSenha: { type: String }, // Para recuperação
    // Seus outros campos...
});
```

## 🔗 Integração no App

No seu `app.js` ou `server.js`:

```javascript
const userRoutes = require('./src/routes/userRoutes');
app.use('/api', userRoutes);

// Se usar email:
const emailRoutes = require('./src/routes/emailRoutes');
app.use('/api', emailRoutes);
```

## ✅ Funcionalidades Prontas

- [x] Criar conta com validações
- [x] Login com JWT
- [x] CRUD completo de usuários
- [x] Recuperação de senha (gerar/verificar código)
- [x] Middleware de autenticação
- [x] Envio de email (opcional)
- [x] Templates HTML para email
- [x] Validações de segurança

