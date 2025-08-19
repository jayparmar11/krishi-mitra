import { Hono } from 'hono'
import { runRagWorkflow } from '../lib/n8nClient'

const rag = new Hono()

rag.post('/rag', async (c) => {
  const { query } = await c.req.json()
  const response = await runRagWorkflow(query)
  console.log("🚀 ~ response:", response)
  return c.json({ response })
})

export default rag
