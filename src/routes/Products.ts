import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { upload } from '../lib/multer'

export async function ProductsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
  app.post(
    '/products/:user_id',
    { preHandler: upload.single('image') },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
      })

      const { price, description, name } = bodySchema.parse(request.body)
      const { sub } = request.user
      const image = request.file

      if (!image) {
        return reply.status(406).send('Please choose a valid image')
      }

      await prisma.products.create({
        data: {
          description,
          coverUrl: image.filename,
          name,
          price,
          userId: sub,
        },
      })

      return reply.send('Produto criado com sucesso')
    },
  )
  app.get('/products/', async (request, reply) => {
    const { sub } = request.user

    const products = await prisma.products.findMany({
      where: { userId: sub },
    })

    return reply.status(200).send(products)
  })
  app.get('/products/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)
    const { sub } = request.user

    const product = await prisma.products.findFirst({
      where: { userId: sub, id },
    })

    return reply.status(200).send(product)
  })
  app.get('/products/image/:image', async (request, reply) => {
    const paramsSchema = z.object({
      image: z.string(),
    })
    const { image } = paramsSchema.parse(request.params)

    return reply.sendFile(image)
  })
  app.put(
    '/products/:id',
    { preHandler: upload.single('image') },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.coerce.number().optional(),
      })
      const paramsSchema = z.object({
        id: z.string(),
      })
      const { id } = paramsSchema.parse(request.params)
      const { sub } = request.user
      const { price, description, name } = bodySchema.parse(request.body)
      const image = request.file

      const product = await prisma.products.findUniqueOrThrow({
        where: { id },
      })

      if (product.userId !== sub) {
        throw new Error('Usuario invalido')
      }

      await prisma.products.update({
        data: {
          name: name || product.name,
          description: description || product.description,
          price: price || product.price,
          coverUrl: image ? image.filename : product.coverUrl,
        },
        where: { id },
      })

      return reply.status(200).send('Produto atualizado com sucesso')
    },
  )
  app.delete('/products/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })
    const { id } = paramsSchema.parse(request.params)

    await prisma.products.delete({ where: { id } })

    return reply.status(200).send('Produto deletado com sucesso')
  })
}
