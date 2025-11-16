# Desktop App Login Fix

## Problem
Getting "Invalid credentials" error when trying to log in to the desktop app.

## Root Cause
The initialization script (`init-demo-data.js`) was storing data in the wrong location. Electron apps store data in a platform-specific location, but the script was using a generic Node.js location.

## Solution ✅

### Quick Fix (Run This)
```bash
cd desktop-app
npm run init
npm start
```

### What This Does
1. `npm run init` - Runs the new initialization script that puts data in the correct location
2. `npm start` - Starts the Electron app

### Login Credentials
After running the init script, you can log in with:

**Doctor:**
```
Email: doctor@mdawa.com
Password: password123
```

**Nurse:**
```
Email: nurse@mdawa.com
Password: nurse123
```

## Data Storage Locations

### Linux
```
~/.config/m-dawa-desktop/config.json
```

### macOS
```
~/Library/Application Support/m-dawa-desktop/config.json
```

### Windows
```
%APPDATA%/m-dawa-desktop/config.json
```

## Manual Verification

Check if data is in the right place:

**Linux/macOS:**
```bash
cat ~/.config/m-dawa-desktop/config.json
# or on macOS:
cat ~/Library/Application\ Support/m-dawa-desktop/config.json
```

**Windows:**
```cmd
type %APPDATA%\m-dawa-desktop\config.json
```

You should see users with emails `doctor@mdawa.com` and `nurse@mdawa.com`.

## If Still Not Working

### 1. Clear Old Data
```bash
# Linux
rm -rf ~/.config/m-dawa-desktop/

# macOS
rm -rf ~/Library/Application\ Support/m-dawa-desktop/

# Windows
rmdir /s %APPDATA%\m-dawa-desktop
```

### 2. Reinitialize
```bash
cd desktop-app
npm run init
```

### 3. Rebuild and Start
```bash
npm run build
npm start
```

## Alternative: Use Web App

If desktop app continues to have issues, the web app works identically:

```bash
cd web-app
npm run dev
```

Then open http://localhost:5173

**Same credentials work:**
- doctor@mdawa.com / password123
- nurse@mdawa.com / nurse123

## Technical Details

### Old Script (Wrong)
`init-demo-data.js` used `electron-store` which stores in:
```
~/.config/electron-store-nodejs/config.json
```

### New Script (Correct)
`init-demo-data-electron.js` writes directly to:
```
~/.config/m-dawa-desktop/config.json
```

This matches where the Electron app actually looks for data.

## Files

- `init-demo-data.js` - Old script (keep for reference)
- `init-demo-data-electron.js` - New script (use this one)
- `package.json` - Updated with `npm run init` command

## Summary

✅ **Fixed:** Data now goes to correct location  
✅ **Command:** `npm run init` to initialize  
✅ **Credentials:** doctor@mdawa.com / password123 or nurse@mdawa.com / nurse123  
✅ **Alternative:** Use web app if issues persist  

---

**Last Updated:** November 16, 2025  
**Status:** FIXED ✅
