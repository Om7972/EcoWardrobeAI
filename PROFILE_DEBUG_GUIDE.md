# Profile Page Display Troubleshooting Guide

## Issue Summary
User signs in successfully, profile data is logged in console, but the Profile page UI is not displaying.

## What We Know ✅
1. **Sign-in works** - User receives JWT token and it's stored in localStorage
2. **Auth middleware works** - Token is verified successfully on the server
3. **Profile API returns data** - Server is returning profile data with fallback
4. **Console logs show data** - Profile data is being logged to the browser console
5. **Server reloads work** - All model compilation issues are fixed

## Debug Steps (Follow Carefully)

### Step 1: Check Browser Console
Press `F12` to open Developer Tools, go to **Console** tab and look for:

```
✅ Profile.tsx: Loading profile for user: demo-user-xxx
✅ Profile.tsx: Fetching full profile from server with token
✅ Profile.tsx: Profile response received: 200 true
✅ Profile.tsx: Profile updated successfully
✅ Profile.tsx: Profile loading completed
```

**If you see these:** Profile component is loading correctly ✅

**If you don't see these:** There might be an issue with the component not mounting

### Step 2: Check for Redirects
In the Console, look for:
```
ProtectedRoute: checking auth status { isAuthenticated: true, loading: false }
ProtectedRoute: user is authenticated, allowing access
ProtectedRoute: rendering protected content
```

**If you see these:** Auth is working ✅

**If not:** ProtectedRoute might be redirecting

### Step 3: Check for JavaScript Errors
In the Console, look for any red error messages. If you see errors, they might be preventing the Profile page from rendering.

### Step 4: Check Network Tab
1. Open DevTools
2. Go to **Network** tab
3. Look for the `/api/protected/profile` request
4. Click on it and check the **Response** tab
5. Should show JSON with `"success": true`

### Step 5: Manual Profile Page Test
Try visiting directly:
```
http://localhost:8080/profile
```

Expected behavior:
1. Redirect to signin if not authenticated
2. If authenticated, show profile page with user data

### Step 6: Check localStorage
In Console, type:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('UserId:', localStorage.getItem('userId'));
console.log('UserName:', localStorage.getItem('userName'));
console.log('UserData:', localStorage.getItem('userData'));
```

All should have values after sign-in.

## Common Issues & Solutions

### Issue: Redirects back to signin
**Solution:**
- Check localStorage has token: `localStorage.getItem('token')`
- Token should not be empty
- Check axios interceptor response handling

### Issue: Page is blank/white
**Solution:**
- Check Network tab for errors (404, 500, etc.)
- Check Console for JavaScript errors
- Clear browser cache: `Ctrl+Shift+Del`
- Hard refresh: `Ctrl+Shift+R`

### Issue: API returns error
**Solution:**
- Check server console for error logs
- Token might be invalid
- Restart dev server: `npm run dev`

### Issue: Data is in console but not displayed
**Solution:**
- Check Layout component is rendering properly
- Check CSS isn't hiding the content
- Check for TypeScript/React errors
- Verify Tabs component is working

## Manual Test Steps

### Test 1: Direct API Call (from Browser Console)
```javascript
const token = localStorage.getItem('token');
fetch('/api/protected/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('Profile API response:', data));
```

Expected: Shows profile data in console

### Test 2: Check useAuth Hook
```javascript
// In Console
console.log('useAuth state should show user data in logs above');
```

### Test 3: Verify Component Mount
Add a simple text to verify page loads. The Profile page has "Profile Settings" as header.
If you don't see this text, the page isn't rendering.

## If Profile Still Doesn't Display

### Option 1: Clear Everything
```bash
# Clear browser cache, localStorage, etc.
# Then sign out and sign in again
```

### Option 2: Check Component State
In DevTools React DevTools (if installed):
- Navigate to Profile component
- Check `profileLoaded` state
- Check `profileData` state
- Check if form fields have values

### Option 3: Enable Detailed Logging
The code now has extensive logging with emojis:
- 🔄 = Loading/Processing
- ✅ = Success
- ❌ = Error
- ⚠️ = Warning

Watch the console for these emojis to track the flow.

## Expected Console Output Flow

1. **Sign In Page:**
   ```
   Checking auth status: { token: false, userId: false, userName: false }
   No valid auth data found in localStorage
   ```

2. **Sign In:**
   ```
   Sign-in response: {success: true, data: {...}}
   Auth data stored successfully
   ```

3. **Navigate to Profile:**
   ```
   Checking auth status: { token: true, userId: true, userName: true }
   User authenticated: {userId: "...", email: "...", name: "..."}
   ProtectedRoute: checking auth status { isAuthenticated: true, loading: false }
   ProtectedRoute: user is authenticated, allowing access
   ProtectedRoute: rendering protected content
   🔄 Profile.tsx: Loading profile for user: demo-user-...
   🔄 Profile.tsx: Fetching full profile from server with token
   ✅ Profile.tsx: Profile response received: 200 true
   ✅ Profile.tsx: Profile updated successfully
   ✅ Profile.tsx: Profile loading completed
   ```

## Quick Fix Checklist

- [ ] Stop dev server: `Ctrl+C`
- [ ] Clear node modules: `rm -rf node_modules`
- [ ] Reinstall: `npm install`
- [ ] Start fresh: `npm run dev`
- [ ] Clear browser cache: `Ctrl+Shift+Del`
- [ ] Hard refresh page: `Ctrl+Shift+R`
- [ ] Sign out and sign in again
- [ ] Check console for all logs above

## Files That Might Need Debugging

If issues persist, check these files:
1. `client/pages/Profile.tsx` - Main profile component
2. `client/components/ProtectedRoute.tsx` - Route protection
3. `client/hooks/useAuth.ts` - Auth state management
4. `client/lib/axios.ts` - API client interceptors
5. `server/routes/auth.ts` - Server auth endpoints
6. `client/components/Layout.tsx` - Layout wrapper

## Still Having Issues?

If none of the above works:

1. **Check the server logs** - Look for "✅ Profile fetched successfully"
2. **Verify token is valid** - Check JWT isn't expired
3. **Test with curl** - From terminal:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/api/protected/profile
   ```
4. **Check for TypeScript errors** - Compile check: `npm run build`
5. **Review recent code changes** - Make sure nothing broke the flow

## Next Steps

After trying these steps, check:
- Browser console for specific error messages
- Server console (terminal) for error logs
- Network tab for API response details
- React DevTools for component state

These logs will help identify exactly where the issue is occurring.
