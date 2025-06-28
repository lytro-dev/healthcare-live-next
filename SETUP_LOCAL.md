# Local Development Setup with Mock Database

This guide will help you run the HealthCare Doctor Appointment app locally using a mock database instead of Appwrite.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env.local` file in the project root with the following content:

```env
# ADMIN ACCESS
NEXT_PUBLIC_ADMIN_PASSKEY=123123
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features Available

### Mock Database Features

- **Patient Registration**: Register new patients with full medical details
- **Appointment Booking**: Schedule appointments with doctors
- **Admin Dashboard**: Manage appointments (schedule, cancel, view details)
- **Mock SMS Notifications**: SMS notifications are logged to console
- **File Upload**: Mock file upload functionality
- **Sample Data**: The app comes with sample patient and appointment data

### Sample Data

The mock database is pre-seeded with:
- 1 sample patient (John Doe)
- 1 sample appointment (pending status)

### Admin Access

- **Admin Passkey**: `123123`
- Access the admin dashboard at `/admin`
- Use the passkey to view and manage appointments

## File Structure Changes

The following files have been modified to support mock database:

- `lib/mock-db.ts` - Mock database implementation
- `lib/mock.config.ts` - Mock configuration that mimics Appwrite
- `types/mock.types.ts` - Mock types compatible with existing code
- `lib/actions/patient.actions.ts` - Updated to use mock database
- `lib/actions/appointment.actions.ts` - Updated to use mock database
- `components/PatientModal.tsx` - Updated to use mock database
- API routes updated to use mock database

## Switching Back to Appwrite

To switch back to using Appwrite:

1. Update the import statements in action files from `mock.config` to `appwrite.config`
2. Update type imports from `mock.types` to `appwrite.types`
3. Create a proper `.env.local` file with your Appwrite credentials
4. Remove the mock database files

## Troubleshooting

### Build Errors
If you encounter build errors, make sure:
- All dependencies are installed: `npm install`
- The `.env.local` file exists with the admin passkey
- No syntax errors in the mock database files

### Runtime Errors
- Check the browser console for any JavaScript errors
- Check the terminal for server-side errors
- Ensure the development server is running on port 3000

### Mock Database Issues
- The mock database is in-memory and will reset when you restart the server
- Sample data is automatically seeded when the server starts
- All data is stored in memory and will be lost on server restart

## Development Notes

- The mock database provides the same API interface as Appwrite
- SMS notifications are logged to the console instead of being sent
- File uploads are simulated but not actually stored
- All timestamps are in ISO string format for consistency 