import fastify from "fastify";

import { Users } from "./routes/Users";

const app = fastify();

app.register(Users)

const PORT = 3333

app.listen({port: PORT}).then(() => {
  console.log('listening on port ', PORT)
})