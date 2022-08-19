# API - Smart Ranking

## Descrição

Esse projeto foi desenvolvido para criação de ranking de jogadores baseado em categorias e pontuações na mesma.

## 🛠 Tecnologias

Esse projeto foi desenvolvido utilizando as tecnologias abaixo:

- [Nest.js](https://nestjs.com/) 🔥
- [TypeScript](https://www.typescriptlang.org/)
- [RabbitMQ](https://www.rabbitmq.com/)

## 🚀 Começando com o projeto

### Requisitos

- [Yarn](https://yarnpkg.com/getting-started/install)
- [Nodejs](https://nodejs.org/en/)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Docker-compose](https://docs.docker.com/compose/)
- [Make](https://community.chocolatey.org/packages/make) (Makefile)

### Faça um clone desse repositório e acesse a pasta do projeto para continuar

```
$ git clone <https://github.com/KevinPagliuca/api-smart-ranking.git> && cd api-smart-ranking

```

### Após clonar o repositório, siga os passos abaixo.

### ATENÇÃO

Antes de subir os containers do docker, você deve criar um arquivo `.env` seguindo o arquivo `.env.example` como exemplo na pasta raiz do projeto, no mesmo local do `docker-compose.yml.`

OBS: Essas variáveis devem ser criadas fora das pastas dos microserviços, pois elas irão ser distrubuídas pelo próprio docker-compose posteriormente.

Além de ter seguido o passo acima, você deve ter o Link de conexão de um banco de dados [MongoDB](https://www.mongodb.com/), para preencher a sua variável: “**MONGODB_URI**” na sua `.env`

E também você deve criar uma conta no site da [Clodinary](https://cloudinary.com/) para que consiga ter o acesso a outras variáveis de ambiente para conseguir realizar uploads de fotos dos jogadores, entre outras ações que envolva a manipulação da imagem deles.

Feito isso, você pode prosseguir.

```
# Para subirmos os containers do projeto, você deve ter instalado o **[Make](https://community.chocolatey.org/packages/make)** em seu computador, porém, caso não queira instalar, não tem problema, leia abaixo algumas instruções parar instalar em seu computador.

**instruções**: [**https://community.chocolatey.org/packages/make**](https://community.chocolatey.org/packages/make)

**# Para iniciar o projeto:**
**$ make up**

**# Caso não tenha instalado o Make:**
**$ npx make up**
```

Após os containers estar rodando, você deve acessar a UI de gerenciamento do RabbitMQ e acessar com o usuário e senha definido na sua `.env` para conseguir monitorar suas emissões de dados que serão feitas via um client HTTP, como o [Insomnia](https://insomnia.rest/), por exemplo.

Por ultímo, caso não tenha nenhum erro, basta importar o arquivo de configuração dos endpoints do insomnia que deixei disponibilizado no projeto. `**SMART-RANKING-COLLECTION.yml**`

### Caso haja outras dúvidas

Você pode me contatar no email → **`kevin.pagliuca@outlook.com`**, ou via [**LinkedIn**](https://www.linkedin.com/in/kevin-pagliuca/)
