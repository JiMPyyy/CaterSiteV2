# Admin System Setup Guide

## Overview
The CaterSite admin system allows designated users to:
- View and manage all orders
- Update order statuses (pending, confirmed, preparing, ready, delivered, cancelled)
- View and manage all users
- Ban/unban users
- Reset user passwords
- Promote users to admin status
- View dashboard statistics

## Creating Your First Admin User

### Method 1: Using the Script (Recommended)
1. Make sure you have a user account created through the normal signup process
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Run the admin promotion script:
   ```bash
   node scripts/makeAdmin.js your-email@example.com
   ```
4. The script will promote the user with that email to admin status

### Method 2: Direct Database Update
If you have direct database access, you can manually update a user's role:
```javascript
// In MongoDB shell or compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Accessing the Admin Dashboard

1. **Login** with your admin account
2. **Look for the Admin link** in the navigation (purple shield icon)
3. **Click "Admin"** to access the dashboard

The admin dashboard has three main sections:

### 1. Overview Tab
- Dashboard statistics (users, orders, revenue)
- Quick action buttons
- System health overview

### 2. Orders Tab
- View all orders with filtering options
- Update order statuses
- Add admin notes to orders
- View detailed order information
- Filter by status, date, etc.

### 3. Users Tab
- View all registered users
- Search users by name or email
- Ban/unban users with optional reason
- Reset user passwords
- Promote users to admin status

## Admin Features

### Order Management
- **Status Updates**: Change order status and notify customers via email
- **Order Details**: View complete order information including customer details
- **Filtering**: Filter orders by status, date, or other criteria
- **Admin Notes**: Add internal notes to orders

### User Management
- **User Search**: Find users by username or email
- **Ban System**: Temporarily disable user accounts with reason tracking
- **Password Reset**: Generate new passwords and send via email
- **Admin Promotion**: Promote trusted users to admin status

### Email Notifications
The system automatically sends email notifications for:
- Order status updates
- Account bans/unbans
- Password resets
- Admin promotions

## Security Features

- **Admin-only routes**: All admin endpoints require admin role
- **Self-protection**: Admins cannot ban themselves
- **Admin protection**: Regular users cannot ban admin users
- **Audit trail**: All admin actions are logged

## Environment Variables

Make sure these are set in your `.env` file:

```env
# Email configuration (optional - uses test emails in development)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CaterVegas <noreply@catervegas.com>
```

## Troubleshooting

### "Access Denied" Error
- Make sure your user account has `role: "admin"` in the database
- Try logging out and logging back in
- Check that you're accessing `/admin` while logged in

### Admin Link Not Showing
- Verify your user role is set to "admin"
- Clear browser cache and refresh
- Check browser console for any JavaScript errors

### Email Not Sending
- In development, emails use test accounts (check console for preview URLs)
- In production, configure EMAIL_USER and EMAIL_PASS environment variables
- Make sure your email provider allows app passwords

## Best Practices

1. **Limit Admin Access**: Only promote trusted users to admin
2. **Regular Monitoring**: Check the dashboard regularly for pending orders
3. **Clear Communication**: Use admin notes to communicate with team members
4. **Password Security**: When resetting passwords, encourage users to change them immediately
5. **Ban Reasons**: Always provide clear reasons when banning users

## API Endpoints

For developers, here are the admin API endpoints:

```
GET    /api/admin/stats                    - Dashboard statistics
GET    /api/admin/orders                   - List all orders
PUT    /api/admin/orders/:id/status        - Update order status
GET    /api/admin/users                    - List all users
PUT    /api/admin/users/:id/ban            - Ban/unban user
PUT    /api/admin/users/:id/reset-password - Reset user password
PUT    /api/admin/users/:id/promote        - Promote user to admin
```

All endpoints require authentication and admin role.
