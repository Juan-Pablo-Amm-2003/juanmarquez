import express, { Request, Response } from 'express'
import { transformAndValidateTasks, bulkUpsertTasks } from '../utils/dataProcessor'
import { ExcelTask } from '../types/task'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const excelTasks = req.body as ExcelTask[]
    if (!Array.isArray(excelTasks)) {
      return res.status(400).json({ error: 'Payload must be an array of tasks' })
    }
    const supabaseTasks = transformAndValidateTasks(excelTasks)
    const summary = await bulkUpsertTasks(supabaseTasks, () => {})
    res.json(summary)
  } catch (error: any) {
    console.error('Error in upsert endpoint:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
