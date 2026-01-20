# Authentication & Server Configuration Fix Guide

## Issues Fixed

### 1. ✅ Mongoose Model Duplication Error
**Problem:** `Cannot overwrite 'CareInstruction' model once compiled` during hot reload

**Solution:** Updated all Mongoose models to use singleton pattern:
```typescript
let ModelName: mongoose.Model<IModelName>;

try {
  ModelName = mongoose.model<IModelName>("ModelName");
} catch {
  ModelName = mongoose.model<IModelName>("ModelName", schema);
}

export { ModelName };
```

**Files Fixed:**
- CareInstruction.ts
- RepairLog.ts
- Capsule.ts
- MarketplaceListing.ts
- SwapRequest.ts
- Moodboard.ts
- FabricAnalysis.ts
- StyleCircle.ts
- ServiceProvider.ts

### 2. ✅ Authentication Flow Issues
**Problem:** User signs in successfully but profile page redirects back to login

**Solutions Applied:**
- Enhanced logging in auth service to track token storage
- Fixed auth middleware to properly handle fallback/demo mode
- Improved useAuth hook to show auth status
- Enhanced axios interceptors with better error handling
- Updated Profile page to gracefully handle API failures
- Added better logging throughout auth flow

### 3. ✅ Vite Hot Reload Issue
**Problem:** Server restart failure due to model duplication

**Solution:** Singleton pattern prevents re-compilation on hot reload

## Testing the Fix

### 1. Start the Development Server
```bash
npm install
npm run dev
```

Wait for the message:
```
✅ [vite] server running at:
  > Local:   http://localhost:8080
```

### 2. Test Authentication Flow

**Sign In:**
1. Go to `http://localhost:8080/signin`
2. Enter any email and password (fallback mode allows any combination)
3. Click "Sign In"
4. Check browser console (F12) for logs showing:
   - `Sign-in response: {success: true, data: {...}}`
   - `Auth data stored successfully`

**Access Profile:**
1. Click on "Profile" in the navigation menu
2. Profile page should load WITHOUT redirecting back to signin
3. Check console for logs showing:
   - `Loading profile for user: demo-user-email-com`
   - `Fetching full profile from server` (if API works)
   - Or `Using cached profile data` (if API fails - expected in demo mode)

### 3. Run Authentication Test
```bash
node test-auth-flow.js
```

Expected output:
```
✅ Sign In successful
✅ Profile retrieval successful
✅ Correctly rejected request without token
✨ All tests completed!
```

## If Issues Persist

### Clear Cache & Restart
```bash
# Clear node modules and reinstall
rm -rf node_modules pnpm-lock.yaml
npm install

# Clear build artifacts
rm -rf dist

# Restart dev server
npm run dev
```

### Check Logs

**Browser Console (F12):**
- Look for authentication logs starting with:
  - `Checking auth status:`
  - `User authenticated:`
  - `Auth token added to request for:`

**Terminal Console:**
- Look for server logs showing:
  - `⚠️ Using fallback for User authentication`
  - `Sign-in successful for: {email}`
  - `Token verified successfully for userId:`
  - `Using fallback mode - database unavailable`

### MongoDB Connection

If you have MongoDB running:
```bash
# The app will auto-detect and use the database
# Check logs for: "✅ Database connected successfully"
```

If MongoDB is NOT running:
```bash
# The app will use fallback/demo mode automatically
# Check logs for: "⚠️ Using fallback for User authentication"
```

## Key Files Modified

1. **Authentication Service**
   - `client/services/auth.ts` - Added token validation and logging

2. **Auth Middleware**
   - `server/middleware/auth.ts` - Fixed fallback mode handling

3. **Auth Hook**
   - `client/hooks/useAuth.ts` - Added auth status logging

4. **API Client**
   - `client/lib/axios.ts` - Enhanced interceptors with logging

5. **Profile Page**
   - `client/pages/Profile.tsx` - Better error handling for API failures

6. **Protected Route**
   - `client/components/ProtectedRoute.tsx` - More reliable auth checking

7. **All Models** (12 files)
   - Applied singleton pattern to prevent hot reload errors

## Authentication Flow Diagram

```
Sign In Page
    ↓
POST /api/auth/signin
    ↓
    ├─ If DB connected: Validate credentials
    └─ If DB not connected: Use fallback (any credentials accepted)
    ↓
Generate JWT Token
    ↓
Store in localStorage:
    - token
    - userId
    - userName
    - userData
    ↓
useAuth Hook detects auth
    ↓
ProtectedRoute allows access
    ↓
Profile Page loads
    ↓
GET /api/protected/profile (with Bearer token)
    ↓
    ├─ If DB connected: Return user profile
    └─ If DB not connected: Return mock profile with decoded token data
    ↓
Profile displayed successfully
```

## Environment Variables

Create `.env` file in project root:
```bash
# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here

# MongoDB (optional)
MONGODB_URI=mongodb://localhost:27017/eco-wardrobe

# API Base URL
VITE_API_URL=http://localhost:3000/api
```

## Notes

- **Fallback Mode**: The app works without MongoDB. When DB is unavailable, it uses mock data.
- **Demo User**: Any email/password combination works in fallback mode.
- **Token Format**: JWT tokens are valid for 7 days.
- **Hot Reload**: No more "Cannot overwrite model" errors during development.

## Support

If you encounter issues:
1. Check browser console (F12) for client-side logs
2. Check terminal for server-side logs
3. Clear cache: `Ctrl+Shift+Del` in browser
4. Restart dev server: `npm run dev`
