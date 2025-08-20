import axios from 'axios'

const n8n = axios.create({
  baseURL: process.env.N8N_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.N8N_API_KEY ? { 'X-N8N-API-KEY': process.env.N8N_API_KEY } : {})
  }
})
export const runRagWorkflow = async ({ query, sessionId, city }: { query: string, sessionId: string, city: string }) => {
  const res = await n8n.post('/webhook/b2bf47da-7e97-4630-a0a8-22592e491a71', { query, sessionId, city })
  console.log("🚀 ~ runRagWorkflow ~ res.data:", res.data)
  return res.data
}