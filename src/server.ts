import fastify from 'fastify'
import multer from 'fastify-multer'
import { join } from 'path'
import jwt from '@fastify/jwt'
import cookies from '@fastify/cookie'
import type { FastifyCookieOptions } from '@fastify/cookie'

// routes
import { UsersRoutes } from './routes/Users'
import { ProductsRoutes } from './routes/Products'
import { AuthRoutes } from './routes/Auth'

const app = fastify()

app.register(multer.contentParser)

app.register(jwt, { secret: 'loocked' })
app.register(cookies, {} as FastifyCookieOptions)

app.register(require('@fastify/static'), {
  root: join(__dirname, '../uploads'),
})
// Routes
app.register(AuthRoutes)
app.register(UsersRoutes)
app.register(ProductsRoutes)

const PORT = 3333

app.listen({ port: PORT }).then(() => {
  console.log('listening on port ', PORT)
})
