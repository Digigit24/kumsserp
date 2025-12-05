# Token Authentication Debug Guide

## Issue: 401 Unauthorized - Token Not Being Sent

### Problem
API calls are receiving 401 Unauthorized errors because the Authorization header is not being included in requests.

### Solution Applied

1. **Enhanced `fetchApi` in `core.service.ts`**
   - Explicitly retrieves token from localStorage
   - Ensures Authorization header is always added if token exists
   - Double-checks headers before sending request

2. **Added Debug Display in CollegesPage**
   - Shows token presence status
   - Displays first 20 characters of token
   - Warning if no token found

## How to Debug the Issue

### Step 1: Check if Token is Stored After Login

1. **Login to the application**
2. **Open DevTools** → Application → Local Storage → `http://localhost:3030`
3. **Check for** `kumss_auth_token`
4. **Value should be**: `d8988889beddb027ede9d4ddc34dcb88939099af`

**If token is NOT there:**
- The login response handler is not storing it
- Check browser console for errors during login
- Verify login endpoint returns `{ "key": "..." }`

### Step 2: Check Token in Page

1. **Navigate to** `/core/colleges`
2. **Look for yellow debug box** at the top
3. **Should show**:
   - ✅ Token Present: Yes
   - Token: d8988889beddb027ede9d4...

**If shows "No token found":**
- Logout and login again
- Clear localStorage and try again
- Check if token was cleared accidentally

### Step 3: Check Network Request Headers

1. **Open DevTools** → Network tab
2. **Navigate to** `/core/colleges`
3. **Click on the API request** (should be to `/api/v1/core/colleges/`)
4. **Go to Headers tab**
5. **Look for Authorization in Request Headers**

**Should see:**
```
Authorization: Token d8988889beddb027ede9d4ddc34dcb88939099af
Content-Type: application/json
X-Tenant-ID: tenant_001
```

**If Authorization header is missing:**
- This indicates the header is not being added
- Check browser console for any errors
- Try hard refresh (Ctrl+Shift+R)

### Step 4: Manual Token Test

Open browser console and run:

```javascript
// 1. Check if token exists
const token = localStorage.getItem('kumss_auth_token');
console.log('Token:', token);

// 2. Test API call with token
fetch('http://127.0.0.1:8000/api/v1/core/colleges/', {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'tenant_001'
  }
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

**If this works:**
- The token is valid
- The issue is with automatic header injection
- Try clearing browser cache

**If this fails:**
- Token might be invalid
- Check backend token in database
- Try logging in again

## Common Issues & Fixes

### Issue 1: Token Not Stored After Login

**Symptom:** localStorage doesn't have `kumss_auth_token`

**Fix:**
1. Check login response format
2. Verify it returns `{ "key": "..." }`
3. Check `auth.service.ts` line 51-53:
```typescript
if (data.key) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.key);
}
```

### Issue 2: Token Cleared on Page Refresh

**Symptom:** Token disappears after refresh

**Fix:**
- Check if logout is being called accidentally
- Verify no code is calling `clearAuthData()`
- Check browser settings (localStorage should persist)

### Issue 3: Wrong Token Format

**Symptom:** 401 error even with token present

**Fix:**
1. Check token format in header: `Token <key>` (not `Bearer`)
2. Verify backend expects `Token` prefix
3. Check `getDefaultHeaders()` in `api.config.ts`:
```typescript
headers['Authorization'] = `Token ${token}`;
```

### Issue 4: CORS Blocking Authorization Header

**Symptom:** Header present in code but not in network request

**Fix in Django Backend:**
```python
# settings.py
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'x-tenant-id',
    'x-college-id',
]
```

## Verification Checklist

- [ ] Token is stored in localStorage after login
- [ ] Token is visible in yellow debug box on Colleges page
- [ ] Authorization header appears in Network tab requests
- [ ] Header format is `Token <key>` (not Bearer)
- [ ] X-Tenant-ID header is also present
- [ ] Backend CORS allows Authorization header
- [ ] Backend has valid token in database

## Quick Fixes

### Fix 1: Force Re-login

```javascript
// Run in browser console
localStorage.clear();
location.reload();
// Then login again
```

### Fix 2: Manually Set Token

```javascript
// If you have the token, set it manually
localStorage.setItem('kumss_auth_token', 'd8988889beddb027ede9d4ddc34dcb88939099af');
localStorage.setItem('kumss_is_authenticated', 'true');
localStorage.setItem('kumss_user', JSON.stringify({
  id: 1,
  username: 'your_username',
  email: 'your@email.com'
}));
location.reload();
```

### Fix 3: Test Token Directly

```bash
# Test with curl
curl -H "Authorization: Token d8988889beddb027ede9d4ddc34dcb88939099af" \
     -H "X-Tenant-ID: tenant_001" \
     http://127.0.0.1:8000/api/v1/core/colleges/
```

## Backend Verification

### Check Token in Database

```python
# Django shell
python manage.py shell

from rest_framework.authtoken.models import Token
token = Token.objects.get(key='d8988889beddb027ede9d4ddc34dcb88939099af')
print(f"User: {token.user.username}")
print(f"Created: {token.created}")
```

### Verify Authentication Classes

```python
# settings.py - Should have:
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

### Check CORS Settings

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3030",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'x-tenant-id',
]
```

## Expected Behavior

### Successful Request Flow

```
1. User logs in
   → POST /api/v1/auth/login/
   → Response: { "key": "d8988889..." }
   → Token stored in localStorage

2. User navigates to /core/colleges
   → useColleges hook calls API
   → fetchApi() runs
   → Retrieves token from localStorage
   → Adds Authorization header
   → GET /api/v1/core/colleges/
   → Headers include: Authorization: Token d8988889...
   → Backend validates token
   → 200 OK with data

3. Data displays on page
   → Yellow debug box shows token present
   → Colleges list loads
   → No 401 errors
```

## Still Having Issues?

### Check Browser Console

Look for errors like:
- "Failed to fetch"
- "CORS error"
- "Network error"

### Check Network Tab

1. Click on failed request
2. Check Preview/Response tab
3. Look for error message
4. Check Headers tab for what was actually sent

### Enable Verbose Logging

Add to top of `core.service.ts`:

```typescript
const DEBUG = true;

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('kumss_auth_token');

  if (DEBUG) {
    console.log('=== API Request Debug ===');
    console.log('URL:', url);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'NONE');
    console.log('Headers:', headers);
  }

  // ... rest of code
}
```

## Contact Support

If none of the above fixes work:

1. Share browser console screenshot
2. Share Network tab screenshot (Headers section)
3. Share localStorage screenshot
4. Share yellow debug box screenshot from Colleges page

---

**Last Updated:** December 4, 2025
**Status:** Token authentication implemented and debugged
**Build:** ✅ Successful
