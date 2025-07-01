# Email Setup for Order Notifications

## Overview
When users successfully place orders, an email notification is automatically sent to `pottejae@gmail.com` with all order details.

## Setup Instructions

### 1. Gmail App Password Setup
To send emails through Gmail, you need to create an App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (enable if not already enabled)
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 2. Update Environment Variables
Edit the `server/.env` file and update these values:

```env
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Important:** 
- Use your actual Gmail address for `EMAIL_USER`
- Use the 16-character app password (not your regular Gmail password) for `EMAIL_PASS`
- Never commit real credentials to version control

### 3. Email Content
The notification email includes:
- Order number and customer details
- Total amount and order status
- Delivery date, time, and address
- Complete list of ordered items
- Special instructions (if any)
- Timestamp of when the order was placed

### 4. Error Handling
- If email sending fails, the order creation still succeeds
- Email errors are logged to the console but don't affect the user experience
- The system gracefully handles email service outages

### 5. Testing
To test the email functionality:
1. Ensure your `.env` file has correct email credentials
2. Start the server: `npm run dev`
3. Place a test order through the frontend
4. Check `pottejae@gmail.com` for the notification email
5. Check server console for email success/error messages

## Security Notes
- App passwords are more secure than using your main Gmail password
- The email service only sends to the hardcoded address `pottejae@gmail.com`
- Email credentials are stored in environment variables, not in code
- Consider using a dedicated business email service for production

## Troubleshooting
- **"Invalid login"**: Check that 2-Step Verification is enabled and you're using an App Password
- **"Connection refused"**: Check your internet connection and Gmail service status
- **No email received**: Check spam folder and verify the recipient email address
