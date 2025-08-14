const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/model');
const {secret} = require('../utils/secret');


// ==========================================
// CRUD BÁSICO
// ==========================================

// Buscar todos os usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-senha');
        res.status(200).json({ users });
    } catch (error) {
        console.log('Erro ao buscar usuários:', error);
        res.status(500).json({ msg: 'Erro ao buscar usuários' });
    }
};

// Buscar usuário por ID
const getUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id, '-senha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log('Erro ao buscar usuário:', error);
        res.status(500).json({ msg: 'Erro ao buscar usuário' });
    }
};

// Atualizar usuário
const updateUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ msg: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.log('Erro ao atualizar usuário:', error);
        res.status(500).json({ msg: 'Erro ao atualizar usuário' });
    }
};

// Deletar usuário
const deleteUser = async (req, res) => {
    const id = req.params.id;
    
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.log('Erro ao deletar usuário:', error);
        res.status(500).json({ msg: 'Erro ao deletar usuário' });
    }
};

// ==========================================
// AUTENTICAÇÃO
// ==========================================

// Criar usuário
const createUser = async (req, res) => {
    //console.log('Conteúdo de req.body:', req.body);

    const {  
            nome_usuario,
            email_usuario, 
            telefone_usuario,
            data_nascimento_usuario,
            cargo_usuario,
            acessos_usuario,
            senha_usuario, 
            confirmarSenha 
        } = req.body;


    // Validações básicas
    const missingFields = [];
    if (!nome_usuario) missingFields.push('nome_usuario');
    if (!email_usuario) missingFields.push('email_usuario');
    if (!telefone_usuario) missingFields.push('telefone_usuario');
    if (!data_nascimento_usuario) missingFields.push('data_nascimento_usuario');
    if (!cargo_usuario) missingFields.push('cargo_usuario');
    if (!acessos_usuario) missingFields.push('acessos_usuario');
    if (!senha_usuario) missingFields.push('senha_usuario');
    if (senha_usuario !== confirmarSenha) missingFields.push('Senhas não conferem');

    if (missingFields.length > 0) {
        return res.status(422).json({ message: `Campos obrigatórios: ${missingFields.join(', ')}` });
    }

    try {
        // Verificar se usuário já existe
        const userExists = await User.findOne({ email_usuario });
        if (userExists) {
            return res.status(422).json({ message: 'Email já cadastrado!' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha_usuario, salt);
        console.log(`Senha gerada: ${passwordHash}`);
        

        // Criar usuário
        const user = new User({
            nome_usuario,
            email_usuario,
            telefone_usuario,
            data_nascimento_usuario,
            cargo_usuario,
            acessos_usuario,
            senha_usuario: passwordHash,
        });
        //console.log(user);
        

        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso' });
    } catch (error) {
        console.log('Erro ao criar usuário:', error);       
        res.status(500).json({ msg: 'Erro ao criar usuário' });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email_usuario, senha_usuario } = req.body;

    if (!email_usuario || !senha_usuario) {
        return res.status(422).json({ message: 'email e senha são obrigatórios!' });
    }

    try {
        const user = await User.findOne({ email_usuario });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não cadastrado!' });
        }

        const checkPassword = await bcrypt.compare(senha_usuario, user.senha_usuario);
        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida!' });
        }

        const secret = "PiNdAmOnHangaba";
        const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: '1d'
        });

        res.status(200).json({
            msg: 'Autenticação realizada com sucesso',
            token,
            id: user._id
        });
    } catch (error) {
        console.log('Erro ao autenticar:', error);
        res.status(500).json({ msg: 'Erro ao autenticar usuário' });
    }
};

// ==========================================
// RECUPERAÇÃO DE SENHA
// ==========================================

// Função para gerar código
const gerarCodigo = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        codigo += characters[randomIndex];
    }
    return codigo;
};

// Enviar código de recuperação (sem email - apenas gerar código)
const sendRecoveryCode = async (req, res) => {
    const email = req.params.email;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Email não encontrado' });
        }

        const codigo = gerarCodigo(6);
        
        // Salvar código no usuário
        user.codigoRecuperarSenha = codigo;
        await user.save();

        // Aqui você implementaria o envio do email
        // Por enquanto, apenas retorna sucesso
        console.log(`Código de recuperação para ${email}: ${codigo}`);
        
        res.status(200).json({ msg: 'Código enviado com sucesso!' });
    } catch (error) {
        console.log('Erro ao enviar código:', error);
        res.status(500).json({ msg: 'Erro ao enviar código' });
    }
};

// Verificar código de recuperação
const verificarCodigo = async (req, res) => {
    const { email, codigo } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Email não encontrado' });
        }

        if (user.codigoRecuperarSenha === codigo) {
            return res.status(200).json({ 
                msg: 'Código verificado com sucesso!', 
                idUsuario: user._id 
            });
        } else {
            return res.status(400).json({ msg: 'Código incorreto' });
        }
    } catch (error) {
        console.log('Erro ao verificar código:', error);
        res.status(500).json({ msg: 'Erro ao verificar código' });
    }
};

// Atualizar senha via recuperação
const updatePasswordRecovery = async (req, res) => {
    const { email, codigoRecuperarSenha, senha, confirmarSenha } = req.body;

    if (!senha || senha !== confirmarSenha) {
        return res.status(422).json({ msg: 'Senhas não conferem!' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        if (user.codigoRecuperarSenha !== codigoRecuperarSenha) {
            return res.status(400).json({ msg: 'Código incorreto' });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(senha, salt);

        user.senha = passwordHash;
        user.codigoRecuperarSenha = undefined;
        await user.save();

        res.status(200).json({ msg: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.log('Erro ao atualizar senha:', error);
        res.status(500).json({ msg: 'Erro ao atualizar senha' });
    }
};

module.exports = {
    // CRUD
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    
    // Auth
    loginUser,
    
    // Recovery
    sendRecoveryCode,
    verificarCodigo,
    updatePasswordRecovery
};