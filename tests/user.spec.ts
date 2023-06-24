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

  it('shouldnt create user', async () => {
    const user = await request(app.server).post('/users').send({
      name: 'eduardo',
      email: 'eduardo@example.com',
      password: '12345678',
    })

    expect(user.text).toEqual('Email ja cadastrado')
  })
})
