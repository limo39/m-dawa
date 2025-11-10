# M-dawa Hospital Management System

A hospital management system where doctors manage patient records via desktop app, and patients store encrypted data on their phones.

## Project Structure

```
m-dawa/
├── desktop-app/          # Electron app for doctors
├── mobile-app/           # React Native app for patients
└── shared/               # Shared types and utilities
```

## Features

- **Desktop App (Doctors)**
  - View patient records
  - Edit prescriptions and medical records
  - Role-based access (Doctor, Admin)
  - Receive patient data via direct transfer

- **Mobile App (Patients)**
  - Store encrypted medical data locally
  - Transfer data to doctor's desktop
  - No data viewing capability

## Tech Stack

- Desktop: Electron + React + TypeScript
- Mobile: React Native + TypeScript
- Data Transfer: QR Code / Local Network
- Storage: SQLite (local), Encrypted

## Getting Started

### Desktop App
```bash
cd desktop-app
npm install
npm start
```

### Mobile App
```bash
cd mobile-app
npm install
npm run android  # or npm run ios
```

## Security

- Patient data encrypted at rest
- Role-based authentication
- Secure data transfer protocols
