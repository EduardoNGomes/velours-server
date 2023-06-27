import fastify from 'fastify'
import multer from 'fastify-multer'
import { join } from 'path'
import jwt from '@fastify/jwt'
import cookies from '@fastify/cookie'
import type { FastifyCookieOptions } from '@fastify/cookie'
import { env } from './env'
import cors from '@fastify/cors'

// routes
import { UsersRoutes } from './routes/Users'
import { ProductsRoutes } from './routes/Products'
import { AuthRoutes } from './routes/Auth'
import { ImagesRoutes } from './routes/Image'

export const app = fastify()

app.register(cors, {
  origin: true,
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})
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
app.register(ImagesRoutes)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('listening on port ', env.PORT)
})
