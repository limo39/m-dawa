# M-dawa Web App

## 🌐 Web-Based Hospital Management System

This is the web version of M-dawa that runs in your browser - no Electron required!

## ✨ Features

All the same features as the desktop app:
- ✅ Patient Management
- ✅ Medical Records
- ✅ Prescriptions
- ✅ Vital Signs Tracking
- ✅ Lab Results
- ✅ Appointments
- ✅ Patient Timeline
- ✅ Data Transfer from Mobile

## 🚀 Running the App

### Development Mode
```bash
npm install
npm run dev
```

The app will open at: **http://localhost:3000**

### Production Build
```bash
npm run build
npm run preview
```

## 🔑 Demo Credentials

- **Email**: doctor@mdawa.com
- **Password**: password123

## 💾 Data Storage

- Uses browser **localStorage** (no backend required)
- Data persists across sessions
- Demo data auto-initializes on first load

## 📊 Demo Data Included

- 1 Doctor user (Dr. Smith)
- 1 Patient (John Doe)
- 1 Medical Record
- 1 Prescription
- 1 Appointment
- 1 Lab Result
- 1 Vital Signs Record

## 🌐 Access the App

The server is running at:
- **Local**: http://localhost:3000
- **Network**: Use `npm run dev -- --host` to expose on network

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **LocalStorage** - Data persistence

## 📱 Features

### Login Screen
- Secure authentication
- Role-based access

### Dashboard
- Patient list with search
- Patient details view
- 7 tabs per patient

### Patient Management
- View patient information
- Record vital signs
- Add medical records
- Prescribe medications
- Order lab tests
- Schedule appointments
- View timeline

## 🎨 UI/UX

- Clean, medical-themed design
- Responsive layout
- Color-coded status indicators
- Intuitive navigation
- Professional appearance

## 🔒 Security

- Client-side only (no server)
- Data stored locally in browser
- No external API calls
- Session management

## 📦 Deployment

### Deploy to Static Hosting

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

### Deploy to Your Server

1. Build the app
2. Copy `dist` folder to your web server
3. Configure web server to serve `index.html` for all routes

## 🌟 Advantages Over Desktop App

- ✅ No installation required
- ✅ Works on any device with a browser
- ✅ Easy to deploy and share
- ✅ Automatic updates (just refresh)
- ✅ Cross-platform (Windows, Mac, Linux, tablets)
- ✅ Lighter weight

## 🔄 Data Import

You can import patient data from the mobile app:
1. Click "Receive Patient Data"
2. Paste JSON from mobile app
3. Data syncs instantly

## 🛠️ Development

### Project Structure
```
web-app/
├── src/
│   ├── components/      # React components
│   ├── api/            # API layer (localStorage)
│   ├── utils/          # Utilities
│   ├── App.tsx         # Main app
│   ├── App.css         # Styles
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.ts      # Vite config
```

### Adding Features

1. Update types in `../shared/types.ts`
2. Add API methods in `src/api/index.ts`
3. Create/update components in `src/components/`
4. Update styles in `src/App.css`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

### Clear Data
Open browser console and run:
```javascript
localStorage.clear()
location.reload()
```

### Reset Demo Data
Refresh the page - demo data auto-initializes if missing

## 📝 Notes

- Data is stored in browser localStorage
- Clearing browser data will delete all records
- For production, consider adding a backend API
- Currently single-user (no multi-user support)

## ✅ Status

**Ready to use!** 🎉

Access the app at: http://localhost:3000
