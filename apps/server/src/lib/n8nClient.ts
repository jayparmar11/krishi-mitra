import axios from 'axios'

const n8n = axios.create({
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.N8N_API_KEY ? { 'X-N8N-API-KEY': process.env.N8N_API_KEY } : {})
  }
})
export const runRagWorkflow = async ({ query, sessionId, city }: { query: string, sessionId: string, city: string }) => {
  const res = await n8n.post(process.env.N8N_WEBHOOK_URL!, { query, sessionId, city })
  console.log("🚀 ~ runRagWorkflow ~ res.data:", res.data)
  return res.data
}