# Use a imagem oficial do Node.js, versão 18, otimizada para ser menor
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json para o contêiner
# e instala as dependências antes de copiar o resto do código.
# Isso aproveita o cache do Docker para builds mais rápidas.
COPY package*.json ./

# Instala todas as dependências do seu projeto
RUN npm install

# Copia todo o resto do código da sua aplicação para o contêiner
COPY . .

# Expõe a porta que sua aplicação usa (nesse caso, 1000)
# A porta que sua aplicação escuta deve ser configurada no seu arquivo 'app.js'
EXPOSE 1000

# Define o comando que será executado quando o contêiner iniciar
# De acordo com seu package.json, é "npm start"
CMD [ "npm", "start" ]