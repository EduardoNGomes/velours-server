import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { MULTER } from '../config/multer'
import multer from 'fastify-multer'
import { DiskStorage } from '../provider/DiskStorage'

const upload = multer(MULTER)

export async function ProductsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
  app.post(
    '/products',
    { preHandler: upload.single('image') },
    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
      })
      const { price, description, name } = bodySchema.parse(request.body)
      const { sub } = request.user
      const imageFilename = request.file.filename

      if (!imageFilename) {
        return reply.status(406).send('Please choose a valid image')
      }

      // const diskStorage = new DiskStorage()
      // const filename = await diskStorage.saveFile(imageFilename)

      await prisma.products.create({
        data: {
          description,
          coverUrl: imageFilename,
          name,
          price,
          userId: sub,
        },
      })

      return reply.send('Produto criado com sucesso')
    },
  )
  app.get('/products', async (request, reply) => {
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
      const imageFilename = request.file.filename

      const product = await prisma.products.findUniqueOrThrow({
        where: { id },
      })

      if (product.userId !== sub) {
        throw new Error('Usuario invalido')
      }

      const diskStorage = new DiskStorage()

      // let filename = ''
      if (product.coverUrl && imageFilename) {
        await diskStorage.deleteFile(imageFilename)
        // filename = await diskStorage.saveFile(imageFilename)
      }

      await prisma.products.update({
        data: {
          name: name || product.name,
          description: description || product.description,
          price: price || product.price,
          coverUrl: imageFilename || product.coverUrl,
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
