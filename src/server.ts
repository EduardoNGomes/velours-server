import fastify from 'fastify'
import multer from 'fastify-multer'
import { join } from 'path'

import { Users } from './routes/Users'
import { ProductsRoutes } from './routes/Products'

const app = fastify()

app.register(multer.contentParser)

app.register(require('@fastify/static'), {
  root: join(__dirname, '../uploads'),
})

app.register(Users)
app.register(ProductsRoutes)

const PORT = 3333

app.listen({ port: PORT }).then(() => {
  console.log('listening on port ', PORT)
})
