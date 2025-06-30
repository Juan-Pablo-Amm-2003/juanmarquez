import express from 'express'
import upsertRouter from './api/upsert-tasks'

const app = express()
app.use(express.json())

app.use('/api/upsert-tasks', upsertRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
