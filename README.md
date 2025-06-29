# CaterVegas - Corporate Catering Platform

A full-stack catering platform for Las Vegas businesses, featuring a Next.js frontend and Express.js backend.

## Project Structure

```
catervegas/
├── client/          # Next.js frontend application
│   ├── src/
│   │   ├── app/     # Next.js app router pages
│   │   ├── components/  # React components
│   │   └── lib/     # Utility functions
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
├── server/          # Express.js backend API
│   ├── index.js     # Main server file
│   └── package.json # Backend dependencies
└── package.json     # Root package.json for monorepo management
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Start both client and server in development mode:
```bash
npm run dev
```

This will start:
- Frontend (Next.js) on http://localhost:3000
- Backend (Express.js) on http://localhost:3001

### Individual Development

To run client or server separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start both client and server in production mode
- `npm run install:all` - Install dependencies for root, client, and server
- `npm run clean` - Clean all node_modules and build artifacts

## Technology Stack

### Frontend (Client)
- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Calendar**: FullCalendar

### Backend (Server)
- **Framework**: Express.js 5.1.0
- **CORS**: Enabled for cross-origin requests
- **Environment**: Node.js

## Development

- Frontend code is in the `client/` directory
- Backend code is in the `server/` directory
- Both can be developed independently
- The root package.json manages the monorepo with concurrent development
