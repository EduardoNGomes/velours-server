import request from 'supertest'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/server'
import { execSync } from 'child_process'

describe('Auth routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npx prisma migrate dev')
  })

  it('should auth user', async () => {
    await request(app.server).post('/users').send({
      name: 'eduardo',
      email: 'eduardo@example.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/auth').send({
      email: 'eduardo@example.com',
      password: '12345678',
    })

    expect(response.headers).toHaveProperty('set-cookie')
  })
})
