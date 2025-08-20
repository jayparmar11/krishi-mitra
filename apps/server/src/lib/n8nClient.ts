import axios from 'axios'

const n8n = axios.create({
  baseURL: process.env.N8N_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.N8N_API_KEY ? { 'X-N8N-API-KEY': process.env.N8N_API_KEY } : {})
  }
})
export const runRagWorkflow = async (query: string) => {
  const res = await n8n.post('/webhook-test/b2bf47da-7e97-4630-a0a8-22592e491a71', { chatInput: query, sessionId: "123" })
  return res.data
}