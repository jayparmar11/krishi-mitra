import axios from 'axios'

const n8n = axios.create({
  baseURL: process.env.N8N_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.N8N_API_KEY ? { 'X-N8N-API-KEY': process.env.N8N_API_KEY } : {})
  }
})
export const runRagWorkflow = async (query: string) => {
  const res = await n8n.post('/webhook/c57b4d3d-becb-44bf-98e2-3a388f2d1d27', { chatInput: query, sessionId: "123" })
  return res.data
}