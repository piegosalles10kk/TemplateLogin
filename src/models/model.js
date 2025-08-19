const mongoose = require('mongoose');

// Esquema para Usuários
const UserSchema = new mongoose.Schema({
    nome_usuario: { type: String, required: true },
    email_usuario: { type: String, required: true },
    telefone_usuario: { type: Number, required: true },
    data_nascimento_usuario: { type: Date, required: true },
    cargo_usuario: { type: String, required: true},
    acessos_usuario: { type: Array, required: true },    

    senha_usuario : { type: String, required: true },
    codigoRecuperarSenha: { type: String, required: false },
    
});

// Modelos
const User = mongoose.model('User', UserSchema);

// Exportação dos Modelos
module.exports = {
    User
};