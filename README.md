# CipherVault

A real-time MPC Vault OS built on Linera microchains with secure multi-key approvals and instant execution.

## Features

- 🔐 Multi-party computation (MPC) vault system
- ⚡ Real-time multi-key approvals
- 🔄 Instant execution with SideShift integration
- 🌐 Built on Linea microchains
- 🎨 Modern React frontend with Framer Motion animations
- 🛡️ TypeScript backend with Express.js

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Package Manager**: pnpm
- **Deployment**: Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CipherVault
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend (if needed)
cp .env.production.template .env.local
```

### Development

Start both frontend and backend in development mode:

```bash
# Start backend
pnpm dev:backend

# Start frontend (in another terminal)
pnpm dev:frontend
```

### Building

Build both applications:

```bash
pnpm build
```

## Project Structure

```
CipherVault/
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
├── branding/          # Brand assets and guidelines
├── events/            # Event-related content
├── marketing/         # Marketing materials
├── pricing/           # Pricing information
├── sales/             # Sales materials
└── scripts/           # Utility scripts
```

## License

Private - All rights reserved
