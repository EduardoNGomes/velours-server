<h1 align="center">
    Your List
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>
</p>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- NodeJs
- Fastify
- TypeScript
- Prisma
- Jwt
- Multer
- SQlite

## 💻 Projeto

Desafio técnico desenvolvido para uma vaga de desenvolvedor Jr.

## Como usar

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Clonar este repositorio
- Executar o comando ```npm intall```
- criar o arquivo .env no seu projeto, similar ao .env-example
- Executar o comando ```npx prisma migrate dev```
- Executar o comando ```npm rum dev```

#### Para testar toda a aplicação utilize o Front-End
[Your List-Web](https://github.com/EduardoNGomes/velours-web/tree/main)

## EndPoints

### User

- POST /users (name, email, password(min - 8))

### Auth
- POST /auth (email, password)

### Products
- POST /products (name, description, price, image(file))
- PUT /products/:id (name, description, price, image(file))
- GET /products
- GET /products/:id
- DEL /products/:id

### Image
- GET /products/:image
  

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## Desenvolvido por
<table>
   <thead>
      <tr>
        <td valign="bottom">
            <p align="center">
               <a href="https://github.com/eduardongomes">
               <img src="https://github.com/eduardongomes.png?size=100" align="center" />
               </a>
            </p>
         </td>
   </thead>
   <tbody>
      <tr>
         <td><a href="https://github.com/eduardongomes"> Eduardo Gomes</a></td>
      </tr>
   </tbody>
</table>
