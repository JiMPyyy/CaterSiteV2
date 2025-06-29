# CaterVegas Backend API

This is the Express.js backend API server for CaterVegas.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will start on [http://localhost:3001](http://localhost:3001).

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests (not implemented yet)

## API Endpoints

- `GET /` - Health check endpoint
- `GET /api/health` - Detailed health status

## Tech Stack

- Express.js 5.1.0
- CORS enabled for cross-origin requests
- JSON body parsing middleware

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=3001
CLIENT_URL=http://localhost:3000
```

## Future Development

This server is set up as a foundation for:
- User authentication
- Order management
- Menu/restaurant data
- Scheduling system
- Payment processing
