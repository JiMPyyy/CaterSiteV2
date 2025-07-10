# CaterLV Backend API

This is the Express.js backend API server for CaterLV, providing authentication, order management, and scheduling functionality.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm run dev
```

The server will start on [http://localhost:3001](http://localhost:3001).

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests (not implemented yet)

## Tech Stack

- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

## Environment Variables

Create a `.env` file in the server directory (use `.env.example` as template):

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/catervegas

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Environment
NODE_ENV=development
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /api/health` - Detailed health status

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Schedules (`/api/schedules`) - All Protected
- `GET /api/schedules` - Get user's schedules (with pagination)
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/:id` - Get specific schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Orders (`/api/orders`) - All Protected
- `GET /api/orders` - Get user's orders (with pagination)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/cancel` - Cancel order

## Database Models

### User
- username (unique, required)
- email (unique, required)
- phone (optional)
- password (hashed, required)
- role (user/admin)
- isActive (boolean)
- timestamps

### Schedule
- userId (reference to User)
- title (required)
- date (required)
- time (required, HH:MM format)
- description (optional)
- status (scheduled/completed/cancelled)
- attendees (number)
- location (optional)
- notes (optional)
- timestamps

### Order
- userId (reference to User)
- orderNumber (auto-generated, unique)
- items (array of order items)
- totalAmount (calculated)
- status (pending/confirmed/preparing/ready/delivered/cancelled)
- deliveryDate (required)
- deliveryTime (required, HH:MM format)
- deliveryAddress (complete address object)
- specialInstructions (optional)
- paymentStatus (pending/paid/failed/refunded)
- timestamps

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional array for validation errors
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
