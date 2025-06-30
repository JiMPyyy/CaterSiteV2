# CaterVegas Full-Stack Integration Test Guide

## 🚀 Quick Start Testing

### Prerequisites
1. **Backend Server**: Running on http://localhost:3001
2. **Frontend Client**: Running on http://localhost:3000
3. **Database**: MongoDB (optional for basic testing)

### Test Scenarios

## 1. Frontend-Only Testing (No Database Required)

### ✅ Navigation & UI Testing
- Visit http://localhost:3000
- Test navigation between pages (Order, Schedule)
- Verify responsive design on different screen sizes
- Check that login/signup modals open and close properly

### ✅ Authentication UI Testing
- Click "Sign Up" button → Modal should open with form fields
- Click "Login" button → Modal should open with form fields
- Test form validation (empty fields, password mismatch)
- Verify error messages display correctly

### ✅ Order Page Testing
- Navigate to /order
- Browse menu items (Main Dishes, Desserts, Beverages)
- Add items to cart using + buttons
- Modify quantities with +/- buttons
- Fill out delivery information form
- Verify total calculation
- Test form validation (without submitting)

### ✅ Schedule Page Testing
- Navigate to /schedule
- View FullCalendar interface
- Click on dates (should show "Please log in" message)
- Verify calendar navigation (month/week/day views)

## 2. Backend API Testing (No Database Required)

### ✅ Basic Server Testing
```bash
# Test server health
curl http://localhost:3001
curl http://localhost:3001/api/health

# Test CORS headers
curl -H "Origin: http://localhost:3000" http://localhost:3001

# Test 404 handling
curl http://localhost:3001/api/nonexistent
```

### ✅ API Endpoint Structure Testing
```bash
# These will return database errors but confirm endpoints exist
curl -X POST http://localhost:3001/api/auth/register
curl -X POST http://localhost:3001/api/auth/login
curl -X GET http://localhost:3001/api/schedules
curl -X GET http://localhost:3001/api/orders
```

## 3. Full Integration Testing (Database Required)

### Setup Database Connection
1. **Option A: MongoDB Atlas (Recommended)**
   - Create free account at https://www.mongodb.com/atlas
   - Create cluster and get connection string
   - Update `server/.env` with your connection string

2. **Option B: Local MongoDB**
   - Install MongoDB Community Server
   - Update `server/.env`: `MONGODB_URI=mongodb://localhost:27017/catervegas`

### ✅ Complete User Flow Testing

#### User Registration & Authentication
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill form: username, email, phone, password
4. Submit → Should redirect and show "Welcome, [username]!"
5. Refresh page → Should remain logged in
6. Click "Logout" → Should return to logged-out state

#### Order Management
1. Login to the application
2. Navigate to /order
3. Add multiple items to cart
4. Fill delivery information
5. Submit order → Should show success message
6. Navigate to /profile → Verify user information

#### Schedule Management
1. Login to the application
2. Navigate to /schedule
3. Click on a date → Modal should open
4. Create new event with title, time, attendees
5. Submit → Event should appear on calendar
6. Click existing event → Should open edit modal
7. Update event details → Changes should persist
8. Delete event → Should remove from calendar

#### Profile Management
1. Navigate to /profile
2. Click "Edit Profile"
3. Update username, email, or phone
4. Save changes → Should update immediately
5. Refresh page → Changes should persist

## 4. Error Handling Testing

### ✅ Network Error Testing
1. Stop backend server
2. Try to login → Should show connection error
3. Try to create schedule → Should show error message
4. Restart server → Application should work again

### ✅ Validation Testing
1. Try to register with invalid email → Should show validation error
2. Try to create schedule with past date → Should show error
3. Try to place order without items → Should show error
4. Try to access protected pages without login → Should show auth required

## 5. Browser Compatibility Testing

### ✅ Cross-Browser Testing
- Chrome/Edge: Full functionality
- Firefox: Full functionality
- Safari: Full functionality (if available)

### ✅ Mobile Responsiveness
- Test on mobile viewport (DevTools)
- Verify navigation works on small screens
- Check modal responsiveness
- Test form usability on mobile

## 6. Performance Testing

### ✅ Load Time Testing
- Initial page load should be < 3 seconds
- Navigation between pages should be instant
- API calls should complete within reasonable time

### ✅ Memory Usage
- No memory leaks during navigation
- Proper cleanup of event listeners
- Efficient re-rendering

## 🎯 Success Criteria

### Frontend Integration ✅
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Authentication state persists
- [ ] Forms submit and validate properly
- [ ] Error messages display appropriately

### Backend Integration ✅
- [ ] API endpoints respond correctly
- [ ] Authentication tokens work
- [ ] Data persistence (with database)
- [ ] Error handling works
- [ ] CORS configured properly

### Full-Stack Integration ✅
- [ ] User can register and login
- [ ] Protected routes work correctly
- [ ] Data flows between frontend and backend
- [ ] Real-time updates work
- [ ] Session management works

## 🐛 Common Issues & Solutions

### Database Connection Issues
- **Problem**: "Database connection error"
- **Solution**: Set up MongoDB Atlas or local MongoDB instance

### CORS Issues
- **Problem**: "Access blocked by CORS policy"
- **Solution**: Verify backend CORS configuration includes frontend URL

### Authentication Issues
- **Problem**: "Token expired" or login not persisting
- **Solution**: Check JWT secret and token storage in localStorage

### API Call Issues
- **Problem**: "Network Error" or "404 Not Found"
- **Solution**: Verify backend server is running and API URLs are correct

## 📊 Test Results Summary

When all tests pass, you should see:
- ✅ Frontend loads and navigates properly
- ✅ Backend API responds to requests
- ✅ Authentication flow works end-to-end
- ✅ Data persistence works (with database)
- ✅ Error handling works appropriately
- ✅ Mobile responsiveness works
- ✅ Cross-browser compatibility confirmed

## 🎉 Next Steps

After successful testing:
1. Set up production database (MongoDB Atlas)
2. Deploy frontend (Vercel, Netlify)
3. Deploy backend (Railway, Render, Heroku)
4. Configure production environment variables
5. Set up monitoring and analytics
6. Implement additional features as needed
