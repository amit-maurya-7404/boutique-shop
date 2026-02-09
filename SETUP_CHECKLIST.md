# ✅ Setup Checklist - Admin Dashboard

Complete these steps in order to get your admin dashboard fully working:

## Step 1: Backend Setup
- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Check `.env` file exists with valid `MONGODB_URI`
- [ ] Seed the database: `npm run seed`
  - This creates the admin user: `admin@boutique.com` / `AdminPassword123`
- [ ] Start backend: `npm run dev`
- [ ] Verify: See message "🚀 Server running on http://localhost:5000"

## Step 2: Frontend Setup
- [ ] Navigate to frontend folder: `cd frontend`
- [ ] Check `.env.local` exists with: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Install dependencies if needed: `npm install`
- [ ] Start frontend: `npm run dev`
- [ ] Verify: Backend running and accessible

## Step 3: Test the Connection
- [ ] Open browser: `http://localhost:3000/admin/test`
- [ ] Run all tests automatically
- [ ] All tests should show ✅ (green/success)
- [ ] If any test fails, read the troubleshooting guide

## Step 4: Login
- [ ] Go to: `http://localhost:3000/admin/login`
- [ ] Enter email: `admin@boutique.com`
- [ ] Enter password: `AdminPassword123`
- [ ] Click Login
- [ ] Should redirect to dashboard

## Step 5: Test Adding Items
- [ ] Click "ADD NEW PRODUCT"
- [ ] Fill in the form with test data:
  - Name: "Test Product"
  - Price: 999
  - Description: "Test product"
  - Category: Select any category
  - Stock: 10
- [ ] Click "Create Product"
- [ ] Should see success message "Product created successfully"
- [ ] Should redirect to products page
- [ ] Check if product appears in the list

## Step 6: Repeat for Other Items
- [ ] Test adding Category
- [ ] Test adding Offer
- [ ] Test adding Review
- [ ] Test editing items
- [ ] Test deleting items

## Troubleshooting

### ❌ Backend not starting?
- Check MongoDB URI in `backend/.env`
- Check if port 5000 is already in use
- Run: `npm install` first

### ❌ Connection test fails?
- Visit `/admin/test` page
- It will tell you exactly what's wrong
- Follow the suggestions provided

### ❌ Can't login?
- Check if you ran: `npm run seed` in backend
- Verify credentials: admin@boutique.com / AdminPassword123
- Check backend logs for errors

### ❌ Form redirects to login on submit?
- Check browser console (F12) for errors
- Check backend logs
- Ensure `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Clear localStorage: `localStorage.clear()` in console
- Try logging in again

### ❌ Blank page at /admin/test?
- Check if backend is running
- Check browser console (F12) for errors
- Reload the page

## Debug Commands

### Test backend health:
```bash
curl http://localhost:5000/api/health
```

### Test login:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@boutique.com","password":"AdminPassword123"}'
```

### Clear browser data:
```javascript
// Run in browser console (F12)
localStorage.clear()
sessionStorage.clear()
window.location.reload()
```

## Important Files to Check

If something doesn't work, check these files:

1. **Backend Configuration**
   - `backend/.env` - Database and API config

2. **Frontend Configuration**
   - `frontend/.env.local` - API URL

3. **Debugging**
   - `ADMIN_DEBUGGING_GUIDE.md` - Full troubleshooting
   - `ADMIN_DASHBOARD_FIX_SUMMARY.md` - What was fixed
   - `/admin/test` - Automatic diagnostics

## What Should Happen

After completing all steps:

✅ Dashboard loads with stats  
✅ Products page shows list of products  
✅ Can click "ADD NEW PRODUCT"  
✅ Form loads without redirect  
✅ Can fill form and submit  
✅ Success message appears  
✅ Redirected to products page  
✅ New product appears in list  

## Need Help?

1. **Read**: `ADMIN_DEBUGGING_GUIDE.md` in project root
2. **Visit**: `http://localhost:3000/admin/test` for auto-diagnostics
3. **Check**: Browser console (F12) for error messages
4. **Check**: Backend terminal for error logs

**Good luck! 🚀**
