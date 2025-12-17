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

// Root landing page for judges/reviewers
app.get('/', (req: any, res: any) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CipherVault - Secure Crypto Custody Backend</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 40px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                max-width: 600px;
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 10px;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .subtitle {
                font-size: 1.2rem;
                margin-bottom: 30px;
                opacity: 0.9;
            }
            .status {
                background: rgba(34, 197, 94, 0.2);
                border: 2px solid #22c55e;
                padding: 15px 25px;
                border-radius: 10px;
                margin: 20px 0;
                font-weight: 600;
            }
            .features {
                text-align: left;
                margin: 30px 0;
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 10px;
            }
            .features h3 {
                margin-top: 0;
                color: #fbbf24;
            }
            .features ul {
                list-style: none;
                padding: 0;
            }
            .features li {
                padding: 5px 0;
                padding-left: 20px;
                position: relative;
            }
            .features li:before {
                content: "🔐";
                position: absolute;
                left: 0;
            }
            .links {
                margin-top: 30px;
            }
            .links a {
                color: #fbbf24;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
            }
            .links a:hover {
                text-decoration: underline;
            }
            .api-info {
                margin-top: 20px;
                font-size: 0.9rem;
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 CipherVault</h1>
            <div class="subtitle">Secure Cryptocurrency Custody & Compliance Backend</div>
            
            <div class="status">
                ✅ Backend API Live on Vercel
            </div>
            
            <div class="features">
                <h3>Core Features</h3>
                <ul>
                    <li>Multi-signature vault creation and management</li>
                    <li>Time-locked cryptocurrency custody</li>
                    <li>Compliance-ready unlock proposals</li>
                    <li>Secure key holder approval system</li>
                    <li>SideShift integration for crypto exchanges</li>
                    <li>Automated vault self-destruction</li>
                </ul>
            </div>
            
            <div class="api-info">
                <strong>API Endpoints:</strong><br>
                • <code>GET /health</code> - Health check<br>
                • <code>POST /api/vault/create</code> - Create new vault<br>
                • <code>GET /api/vault/:id</code> - Get vault details<br>
                • <code>POST /api/webhook/sideshift</code> - SideShift webhooks
            </div>
            
            <div class="links">
                <a href="https://github.com/Code4livingg/CipherVault_final" target="_blank">📂 GitHub Repository</a>
                <a href="/health">🔍 Health Check</a>
            </div>
        </div>
    </body>
    </html>
  `
  res.send(html)
})

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
