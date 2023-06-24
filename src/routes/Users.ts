import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function Users(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })

    const { email, name, password } = bodySchema.parse(request.body)

    const userExist = await prisma.user.findFirst({ where: { email } })

    if (userExist) {
      return reply.status(409).send('Email ja cadastrado')
    }

    await prisma.user.create({
      data: { email, name, password },
    })

    return reply.send('Cadastro realizado com sucesso')
  })
}
