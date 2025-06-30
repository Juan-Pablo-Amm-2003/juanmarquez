import request from 'supertest'
import express from 'express'
import upsertRouter from '../src/api/upsert-tasks'
import { describe, it, expect, vi } from 'vitest'
import { bulkUpsertTasks } from '../src/utils/dataProcessor'

vi.mock('../src/utils/dataProcessor', async () => {
  const mod = await vi.importActual<typeof import('../src/utils/dataProcessor')>('../src/utils/dataProcessor')
  return {
    ...mod,
    bulkUpsertTasks: vi.fn(async () => ({ totalRows: 1, processed: 1, upserted: 1, errors: 0 }))
  }
})

const app = express()
app.use(express.json())
app.use('/api/upsert-tasks', upsertRouter)

describe('POST /api/upsert-tasks', () => {
  it('returns summary for valid payload', async () => {
    const response = await request(app)
      .post('/api/upsert-tasks')
      .send([{ 'Id. de tarea': '1' }])
      .expect(200)

    expect(response.body.upserted).toBe(1)
  })

  it('rejects invalid payload', async () => {
    const response = await request(app)
      .post('/api/upsert-tasks')
      .send({})
      .expect(400)

    expect(response.body.error).toBeDefined()
  })
})
