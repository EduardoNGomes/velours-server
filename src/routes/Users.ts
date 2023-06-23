import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function Users(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    await prisma.user.create({
      data: { email: 'eduardo@email.com', name: 'eduardo', password: '123456' },
    })

    return reply.send('Hello world')
  })
}
