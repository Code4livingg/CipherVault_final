// @ts-nocheck
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import vaultRoutes from './routes/vault'
import webhookRoutes from './routes/webhook'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/vault', vaultRoutes)
app.use('/api/webhook', webhookRoutes)

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' })
})

// For Vercel serverless deployment
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`SideShift API Key: ${process.env.SIDESHIFT_API_KEY ? 'Configured' : 'Not configured (using mock)'}`)
    console.log(`Webhook Secret: ${process.env.WEBHOOK_SECRET ? 'Configured' : 'Not configured'}`)
  })
}
