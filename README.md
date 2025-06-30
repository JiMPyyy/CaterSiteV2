# 🍽️ CaterVegas - Corporate Catering Platform

> **Fast, reliable catering from Las Vegas's favorite spots — delivered when you need it.**

A complete full-stack web application for corporate catering management, built with modern technologies and designed for Las Vegas businesses.

![Tech Stack](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)
![Tech Stack](https://img.shields.io/badge/Backend-Express.js-green?style=for-the-badge&logo=express)
![Tech Stack](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=for-the-badge&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?style=for-the-badge&logo=tailwindcss)

## 🚀 Live Demo

- **Repository**: https://github.com/JiMPyyy/CaterSiteV2
- **Status**: ✅ Production Ready
- **Database**: MongoDB Atlas (Cloud)

## ✨ Features

### 🔐 **Authentication System**
- User registration and login with JWT tokens
- Secure password hashing with bcryptjs
- Persistent sessions with localStorage
- Protected routes and role-based access

### 🛒 **Order Management**
- Browse categorized menu items (Main Dishes, Desserts, Beverages)
- Interactive shopping cart with quantity management
- Real-time total calculation
- Delivery scheduling with date/time selection
- Complete address management
- Order status tracking
- Order history and management

### 📅 **Integrated Schedule & Order Calendar**
- **Unified Calendar View**: See both events and orders on one calendar
- **Smart Date Actions**: Click any date to:
  - 🍽️ Create new catering order for that date
  - 📅 Create new event/meeting
  - 🗑️ Delete existing events or cancel orders
- **Visual Distinction**:
  - 📅 Blue events for scheduled meetings
  - 🍽️ Green/Orange events for catering orders
  - Color-coded by status (confirmed, delivered, cancelled)
- **Event Management**: Create, edit, and delete events with full details
- **Order Integration**: Orders automatically appear on calendar with delivery details

### 👤 **User Profile Management**
- View and edit personal information
- Account status and membership details
- Profile update functionality

### 🎨 **Modern User Interface**
- Responsive design for all devices
- Smooth animations with Framer Motion
- Professional design with Tailwind CSS
- Intuitive navigation and user experience
- Loading states and error handling

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.3.3 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Calendar**: FullCalendar
- **HTTP Client**: Axios
- **State Management**: React Context

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, CORS, input validation
- **Environment**: dotenv configuration

### **Database Schema**
```javascript
// User Model
{
  username: String (unique),
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'user' | 'admin',
  isActive: Boolean,
  timestamps: true
}

// Schedule Model
{
  userId: ObjectId (ref: User),
  title: String,
  date: Date,
  time: String (HH:MM),
  description: String,
  attendees: Number,
  location: String,
  notes: String,
  status: 'scheduled' | 'completed' | 'cancelled',
  timestamps: true
}

// Order Model
{
  userId: ObjectId (ref: User),
  orderNumber: String (auto-generated),
  items: [OrderItem],
  totalAmount: Number,
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  deliveryDate: Date,
  deliveryTime: String,
  deliveryAddress: Address,
  specialInstructions: String,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  timestamps: true
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JiMPyyy/CaterSiteV2.git
   cd CaterSiteV2
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies at once
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # In server directory
   cp server/.env.example server/.env
   ```

   Update `server/.env` with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/catervegas
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
catersite/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── order/     # Order management page
│   │   │   ├── schedule/  # Calendar and scheduling
│   │   │   └── profile/   # User profile page
│   │   ├── components/    # Reusable React components
│   │   │   ├── ui/        # UI components (modals, buttons)
│   │   │   └── layout/    # Layout components (navigation)
│   │   ├── contexts/      # React Context (authentication)
│   │   └── lib/           # API services and utilities
│   │       └── services/  # API service functions
│   └── package.json
├── server/                # Express.js Backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware (auth, validation)
│   ├── models/          # Mongoose database models
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions (JWT)
│   └── package.json
├── docs/                 # Documentation
│   ├── DATABASE_SETUP.md
│   ├── INTEGRATION_TEST_GUIDE.md
│   └── CLOUDFLARE_DEPLOYMENT.md
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run start` - Start both client and server in production mode
- `npm run install:all` - Install dependencies for root, client, and server
- `npm run clean` - Clean all node_modules and build artifacts

### Individual Development
```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Schedules
- `GET /api/schedules` - Get user schedules
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/cancel` - Cancel order

## 🧪 Testing

### Run API Tests
```bash
cd server
node test-database.js  # Full database integration test
node simple-test.js    # Basic server functionality test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Order creation and management
- [ ] Schedule creation and calendar integration
- [ ] Profile management
- [ ] Calendar shows both events and orders
- [ ] Date actions (create order/event, delete)

## 🚀 Deployment

### Option 1: Cloudflare + Railway (Recommended)
- **Frontend**: Cloudflare Pages
- **Backend**: Railway
- **Database**: MongoDB Atlas

### Option 2: Vercel + Render
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs (12 salt rounds)
- Input validation and sanitization
- CORS configuration
- Protected API routes
- Environment variable protection
- SQL injection prevention (NoSQL)

## 🎯 Key Features Highlights

### 🔄 **Integrated Calendar System**
The standout feature is the unified calendar that displays both scheduled events and catering orders:
- **Visual Integration**: Orders appear as calendar events alongside meetings
- **Smart Actions**: Click any date to create orders or events
- **Status Tracking**: Color-coded events show order/event status
- **Unified Management**: Manage your entire schedule in one place

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes
- Progressive Web App ready

### ⚡ **Performance Optimized**
- Server-side rendering with Next.js
- Optimized bundle sizes
- Efficient database queries
- Image optimization ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**JiMPyyy**
- GitHub: [@JiMPyyy](https://github.com/JiMPyyy)
- Repository: [CaterSiteV2](https://github.com/JiMPyyy/CaterSiteV2)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for efficient corporate catering management
- Designed for Las Vegas business community

---

**Ready to revolutionize your corporate catering experience!** 🍽️✨
