import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { compare } from 'bcrypt'

export async function AuthRoutes(app: FastifyInstance) {
  app.post('/auth', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new Error('Usuario nao cadastrado')
    }

    const validPassword = await compare(password, user!.password)

    if (!validPassword) {
      throw new Error('Senha invalida')
    }

    const token = app.jwt.sign({ sub: user?.id, expiresIn: '10 days' })

    if (token) {
      return reply
        .setCookie('token', token, {
          secure: true,
          path: '/',
          sameSite: 'none',
        })
        .code(200)
        .send('Authenticated')
    } else {
      reply.code(401).send('your email or password wrong!')
    }
  })
}
