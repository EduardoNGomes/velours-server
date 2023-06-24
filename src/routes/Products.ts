import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { upload } from '../lib/multer'

export async function ProductsRoutes(app: FastifyInstance) {
  app.post(
    '/products/:user_id',
    { preHandler: upload.single('image') },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
      })

      const paramsSchema = z.object({
        user_id: z.string(),
      })
      const image = request.file

      const { price, description, name } = bodySchema.parse(request.body)
      const { user_id } = paramsSchema.parse(request.params)

      if (!image) {
        return reply.status(406).send('Please choose a valid image')
      }

      await prisma.products.create({
        data: {
          description,
          coverUrl: image.filename,
          name,
          price,
          userId: user_id,
        },
      })

      return reply.send('Produto criado com sucesso')
    },
  )

  app.get('/products/:user_id', async (request, reply) => {
    const { user_id } = request.params
    const products = await prisma.products.findMany({
      where: { userId: user_id },
    })

    return reply.status(200).send(products)
  })

  app.get('/products/image/:image', async (request, reply) => {
    const paramsSchema = z.object({
      image: z.string(),
    })
    const { image } = paramsSchema.parse(request.params)

    return reply.sendFile(image)
  })
}
