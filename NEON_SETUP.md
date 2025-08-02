# Neon Database Setup Guide

## Step 1: Create Neon Account
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in to your account

## Step 2: Create a New Project
1. Click "Create Project"
2. Choose a project name (e.g., "useless-tube")
3. Select a region (choose closest to you)
4. Click "Create Project"

## Step 3: Get Your Connection String
1. In your project dashboard, click on "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database_name?sslmode=require
   ```

## Step 4: Update Environment File
1. Open `.env.local` in your project
2. Replace the DATABASE_URL with your Neon connection string:
   ```env
   DATABASE_URL="your-neon-connection-string-here"
   ```

## Step 5: Run Setup Script
```bash
node scripts/setup-neon.js
```

This will:
- Test the database connection
- Create all necessary tables
- Seed the database with sample data

## Step 6: Start Development Server
```bash
pnpm dev
```

## Troubleshooting

### Connection Issues
- Make sure your Neon project is active
- Check if your IP is allowed (Neon may require IP allowlisting)
- Verify the connection string format

### Database Issues
- If tables don't exist, the setup script will create them
- If you get permission errors, check your Neon user permissions

### File Storage
- The app uses local file storage by default
- Files will be stored in the `./uploads` directory
- No cloud storage setup required for development 