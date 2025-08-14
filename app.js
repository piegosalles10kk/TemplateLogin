const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const connectDB = require('./src/config/config');

const app = express();
const PORT = 1000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rota principal indicando que o servidor está online
app.get('/', (req, res) => {
    res.send('🚀 Servidor está online e funcionando corretamente!');
});

// Usar as rotas importadas.
app.use('/api', userRoutes);

// Inicia o servidor E a conexão com o banco de dados
const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (err) {
        console.error("Falha ao iniciar o servidor:", err);
    }
};

startServer();