# 📱 M-dawa Mobile App - Testing Guide

## 🚀 How to Run and Test the Mobile App

### Option 1: Test on Physical Device (Recommended)

#### Prerequisites
- Android or iOS smartphone
- Install **Expo Go** app from:
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
  - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

#### Steps
```bash
# 1. Navigate to mobile app directory
cd mobile-app

# 2. Start Expo development server
npm start

# 3. Scan QR code with your phone
# - Android: Use Expo Go app to scan
# - iOS: Use Camera app to scan, then open in Expo Go
```

#### What You'll See
1. QR code appears in terminal
2. Scan with your phone
3. App loads on your device
4. Test the beautiful UI!

---

### Option 2: Test on Android Emulator

#### Prerequisites
- Android Studio installed
- Android emulator configured

#### Steps
```bash
cd mobile-app
npm start

# In another terminal or press 'a' in Expo
npm run android
```

---

### Option 3: Test on iOS Simulator (Mac Only)

#### Prerequisites
- Xcode installed (Mac only)
- iOS simulator configured

#### Steps
```bash
cd mobile-app
npm start

# Press 'i' in Expo terminal
npm run ios
```

---

### Option 4: Test in Web Browser (Quick Preview)

#### Steps
```bash
cd mobile-app
npm start

# Press 'w' in Expo terminal or
npm run web
```

**Note**: Web version may have limited functionality (no QR scanner, etc.)

---

## 🧪 Testing Checklist

### Setup Screen Testing

#### Visual Tests
- [ ] Purple gradient header displays correctly
- [ ] Hospital icon (🏥) shows at top
- [ ] "Welcome to M-dawa" title is visible
- [ ] Form card has white background with shadow
- [ ] All input fields are properly styled
- [ ] Required fields show red asterisk (*)
- [ ] Save button is purple with white text
- [ ] Blue info card shows at bottom

#### Functional Tests
- [ ] Can type in all input fields
- [ ] Form validation works (required fields)
- [ ] Save button responds to tap
- [ ] Success alert appears after save
- [ ] Navigates to Transfer screen after save
- [ ] Data persists after closing app

#### Test Data
```
First Name: John
Last Name: Doe
Date of Birth: 1990-01-15
Gender: male
Phone: +1234567890
Blood Type: O+
```

---

### Data Transfer Screen Testing

#### Visual Tests
- [ ] Purple gradient header with avatar
- [ ] Avatar shows correct initials (JD)
- [ ] Patient name displays correctly
- [ ] Gender and DOB show below name
- [ ] Phone number displays
- [ ] Statistics cards show in 2x2 grid
- [ ] Numbers are large and purple
- [ ] Transfer card has white background
- [ ] Privacy card has orange left border
- [ ] All cards have proper shadows

#### Functional Tests
- [ ] "Generate Transfer Code" button works
- [ ] Tab navigation switches between QR/Text
- [ ] QR code generates and displays
- [ ] QR code has border and padding
- [ ] "Copy Data Instead" button works
- [ ] Clipboard copy shows success alert
- [ ] "Back to Summary" returns to main view
- [ ] JSON text is scrollable
- [ ] "Copy to Clipboard" works in text view

#### Data Verification
- [ ] Medical Records count is correct
- [ ] Prescriptions count is correct
- [ ] Appointments count is correct
- [ ] Lab Results count is correct
- [ ] Patient info matches setup data

---

## 📊 UI/UX Testing

### Color Scheme
- [ ] Primary purple: #667eea
- [ ] Background: #f5f7fa (light gray)
- [ ] Cards: White with shadows
- [ ] Text: Dark gray (#333)
- [ ] Warning: Orange (#ff9800)

### Typography
- [ ] Headers are bold and large
- [ ] Body text is readable (14-16px)
- [ ] Labels are clear
- [ ] Stats numbers are prominent (32px)

### Spacing & Layout
- [ ] Cards have proper margins (15px)
- [ ] Padding inside cards (20px)
- [ ] Elements don't overlap
- [ ] Scrolling works smoothly
- [ ] No horizontal scroll

### Interactions
- [ ] Buttons respond to touch
- [ ] Tap feedback is visible
- [ ] Transitions are smooth
- [ ] Loading states show
- [ ] Alerts are clear

---

## 🔒 Security Testing

### Data Storage
- [ ] Data saves to secure storage
- [ ] Data persists after app restart
- [ ] Data is encrypted (expo-secure-store)
- [ ] No data visible in plain text

### Privacy
- [ ] Patient cannot view detailed records
- [ ] Only summary counts are shown
- [ ] Privacy notice is prominent
- [ ] Transfer requires explicit action

### Transfer
- [ ] QR code contains encrypted data
- [ ] JSON is properly formatted
- [ ] Timestamp is included
- [ ] Signature field present

---

## 📱 Device Testing

### Screen Sizes
- [ ] Works on small phones (< 5")
- [ ] Works on medium phones (5-6")
- [ ] Works on large phones (> 6")
- [ ] Works on tablets
- [ ] Responsive layout adapts

### Orientations
- [ ] Portrait mode works
- [ ] Landscape mode works (if applicable)
- [ ] Rotation doesn't break layout

### Performance
- [ ] App loads quickly (< 2 seconds)
- [ ] Scrolling is smooth (60fps)
- [ ] No lag or freezing
- [ ] Memory usage is reasonable
- [ ] Battery drain is minimal

---

## 🐛 Common Issues & Solutions

### Issue: QR Code Not Showing
**Solution**: Check if `react-native-qrcode-svg` is installed
```bash
npm install react-native-qrcode-svg
```

### Issue: Clipboard Not Working
**Solution**: Ensure Clipboard API is available
```bash
npm install @react-native-clipboard/clipboard
```

### Issue: Secure Storage Error
**Solution**: Reinstall expo-secure-store
```bash
npm install expo-secure-store
```

### Issue: App Won't Start
**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: Styling Looks Wrong
**Solution**: Check React Native version compatibility
```bash
npm install react-native@0.72.6
```

---

## 📸 Screenshot Testing

### Take Screenshots Of:
1. Setup screen (empty form)
2. Setup screen (filled form)
3. Transfer screen (summary view)
4. Transfer screen (QR code view)
5. Transfer screen (JSON text view)
6. Privacy notice card
7. Statistics dashboard

### Compare With:
- Design mockups
- Desktop/web app styling
- Brand guidelines

---

## ✅ Acceptance Criteria

### Must Have
- [x] Professional appearance
- [x] All features functional
- [x] No crashes or errors
- [x] Data persists correctly
- [x] Secure storage works
- [x] QR code generates
- [x] Clipboard copy works
- [x] Privacy notice visible

### Should Have
- [x] Smooth animations
- [x] Loading states
- [x] Error handling
- [x] Success feedback
- [x] Intuitive navigation

### Nice to Have
- [ ] Biometric auth
- [ ] Dark mode
- [ ] Multiple languages
- [ ] Accessibility features

---

## 🎯 Test Scenarios

### Scenario 1: First Time User
1. Open app
2. See setup screen
3. Fill in patient information
4. Save data
5. See transfer screen
6. View data summary
7. Generate QR code
8. Copy to clipboard

**Expected**: Smooth flow, no errors, data saved

### Scenario 2: Returning User
1. Open app
2. Immediately see transfer screen
3. Data loads from storage
4. Statistics show correct counts
5. Can generate new transfer code

**Expected**: Fast load, data persists

### Scenario 3: Data Transfer
1. Generate transfer code
2. Switch between QR and Text tabs
3. Copy JSON to clipboard
4. Paste into doctor's app
5. Verify data received

**Expected**: Successful transfer, data intact

---

## 📊 Performance Benchmarks

### Target Metrics
- **App Launch**: < 2 seconds
- **Screen Transition**: < 300ms
- **QR Generation**: < 500ms
- **Data Load**: < 100ms
- **Scroll FPS**: 60fps
- **Memory Usage**: < 100MB
- **Battery Impact**: Minimal

### Measure With
- React Native Performance Monitor
- Expo Developer Tools
- Device profiling tools

---

## 🎓 User Testing

### Test With Real Users
1. Give them the app
2. Ask them to complete tasks
3. Observe their behavior
4. Note confusion points
5. Collect feedback

### Questions to Ask
- Is the UI intuitive?
- Can you complete tasks easily?
- Do you trust the security?
- Is the design professional?
- Would you use this app?

---

## 📝 Test Report Template

```markdown
## Mobile App Test Report

**Date**: [Date]
**Tester**: [Name]
**Device**: [Device Model]
**OS**: [Android/iOS Version]

### Setup Screen
- Visual: ✅/❌
- Functional: ✅/❌
- Issues: [List any issues]

### Transfer Screen
- Visual: ✅/❌
- Functional: ✅/❌
- Issues: [List any issues]

### Overall Experience
- Rating: [1-5 stars]
- Comments: [Feedback]

### Recommendations
- [List improvements]
```

---

## 🚀 Ready to Test!

**Quick Start Command:**
```bash
cd mobile-app && npm start
```

Then scan the QR code with your phone using Expo Go app!

---

**Happy Testing!** 🎉
