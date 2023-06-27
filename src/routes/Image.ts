import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function ImagesRoutes(app: FastifyInstance) {
  app.get('/image/:image', async (request, reply) => {
    const paramsSchema = z.object({
      image: z.string(),
    })
    const { image } = paramsSchema.parse(request.params)

    return reply.sendFile(image)
  })
}
