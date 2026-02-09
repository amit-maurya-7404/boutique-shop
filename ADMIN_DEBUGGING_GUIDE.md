# Admin Dashboard - Debugging & Troubleshooting Guide

## If you're seeing "Login redirect" instead of items being added:

This guide will help you fix the issue where forms submit but items don't get added to the database.

---

## Quick Checklist ✓

### 1. **Backend is Running**
```bash
# In your backend folder, run:
cd backend
npm run dev
```

✅ You should see: `🚀 Server running on http://localhost:5000`

### 2. **Database is Connected**
- Check MongoDB connection in `backend/.env`
- Verify your `MONGODB_URI` is correct
- Ensure your MongoDB cluster is accessible

### 3. **Admin User Exists**
```bash
# In your backend folder, run the seed script:
cd backend
npm run seed
```

✅ This creates the admin user: `admin@boutique.com` / `AdminPassword123`

### 4. **Frontend Environment Variable**
Check that `frontend/.env.local` exists with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Test the Backend

### Option 1: Use the Test Page
1. Go to: `http://localhost:3000/admin/test`
2. This page will automatically test all connections
3. Check the results to identify issues

### Option 2: Manual Testing with curl
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@boutique.com","password":"AdminPassword123"}'

# Test creating a product (replace TOKEN with the token from login response)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name":"Test Product",
    "description":"Test",
    "price":100,
    "category":"VALID_CATEGORY_ID",
    "stock":10
  }'
```

---

## Common Issues & Solutions

### ❌ "Backend is not reachable"
**Problem:** Backend is not running  
**Solution:**
```bash
cd backend
npm install  # If you haven't done this first
npm run dev
```

### ❌ "Login failed: Invalid credentials"
**Problem:** Admin user doesn't exist in database  
**Solution:**
```bash
cd backend
npm run seed  # This creates the admin user
```

### ❌ "Database not accessible"
**Problem:** MongoDB connection is broken  
**Solution:**
1. Check `backend/.env` file
2. Verify `MONGODB_URI` is correct
3. Ensure your MongoDB Atlas cluster is active
4. Check your IP whitelist in MongoDB Atlas

### ❌ "CORS error in browser console"
**Problem:** Frontend can't communicate with backend  
**Solution:**
1. Check `backend/.env`:
   ```
   CORS_ORIGIN=http://localhost:3000
   ```
2. Restart backend: `npm run dev`

### ❌ "Token error / Unauthorized"
**Problem:** Token is not being sent properly  
**Solution:**
1. Clear browser localStorage: `localStorage.clear()` (run in console)
2. Login again
3. Check browser console (F12) → Network tab → look at request headers
4. Verify `Authorization: Bearer <token>` is present

---

## Detailed Testing Steps

### Step 1: Test Backend Connection
```javascript
// Run this in browser console (F12)
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Step 2: Test Login
```javascript
// Run this in browser console
fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@boutique.com',
    password: 'AdminPassword123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login response:', data);
  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token);
    console.log('Token saved!');
  }
})
.catch(console.error);
```

### Step 3: Test Adding a Product
```javascript
// First, make sure you're logged in (run Step 2 above)
// Then run this:
const token = localStorage.getItem('authToken');
const API_URL = 'http://localhost:5000/api';

fetch(`${API_URL}/products`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Test Product',
    description: 'This is a test',
    price: 999,
    category: '000000000000000000000001',  // You may need to get a real ID
    stock: 5
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## Check Logs

### Backend Logs
When running `npm run dev` in backend, look for errors like:
- `MongoDB connection error`
- `JWT signing error`
- `Validation error`

### Browser Console Logs
Press `F12` and check:
1. **Console tab** - Any error messages?
2. **Network tab** - Look at the request/response:
   - Is the request going to `http://localhost:5000/api/...`?
   - Does the response have status 200 (success) or 401 (unauthorized)?
   - Are headers being sent correctly?

---

## Still Not Working?

### 1. Check if Backend is Running
```bash
# Should return JSON response
curl http://localhost:5000/api/health
```

### 2. Check Database
```bash
# In MongoDB Atlas, check if you have data
# Should have admin user and categories
```

### 3. Check API URL in Frontend
Make sure `frontend/.env.local` exists and has:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Clear Cache
```bash
# In browser console
localStorage.clear()
sessionStorage.clear()
```
Then refresh the page.

### 5. Restart Everything
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

---

## Need More Help?

Check these files to understand the flow:
- `frontend/lib/api.ts` - API client configuration
- `backend/src/middleware/auth.ts` - Authentication logic
- `backend/src/routes/products.ts` - Route definitions
- `backend/src/controllers/productController.ts` - Business logic

The console logs should tell you exactly what's failing!
