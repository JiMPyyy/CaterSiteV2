# Database Setup Guide

## Option 1: MongoDB Atlas (Cloud Database) - Recommended

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select a cloud provider and region
   - Name your cluster (e.g., "catervegas-cluster")

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Atlas Admin" for development

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Or add your specific IP address

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/catervegas?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

1. **Install MongoDB Community Server**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   - Windows: MongoDB should start automatically as a service
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Update .env File**
   ```env
   MONGODB_URI=mongodb://localhost:27017/catervegas
   ```

## Testing Database Connection

After setting up your database:

1. Update the `MONGODB_URI` in `server/.env`
2. Restart the server: `npm run dev`
3. Check the console for "MongoDB Connected" message
4. Run the full API test: `node test-api.js`

## Database Structure

The following collections will be created automatically:
- `users` - User accounts and authentication
- `schedules` - Event scheduling data
- `orders` - Order and delivery information

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for database users
- In production, restrict network access to specific IP addresses
- Consider using MongoDB Atlas for production deployments
