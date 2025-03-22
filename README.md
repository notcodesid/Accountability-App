# Accountability App

A platform that allows users to create and participate in challenges with financial incentives to help them stay accountable to their goals. Users can join challenges, track their progress, and earn rewards for successful completion.

## Project Structure

The application consists of two main parts:

1. **Server**: Node.js/Express backend with TypeScript and PostgreSQL database
2. **Client**: React Native mobile app with Expo and Firebase Authentication

## Authentication Flow

This application uses Firebase Authentication for user management:

1. Users sign in with Google through Firebase in the React Native app
2. After successful authentication, the app receives a Firebase ID token
3. The app sends this token to the backend server
4. The server verifies the token using Firebase Admin SDK
5. The server finds or creates a user record in the database
6. User is now authenticated and can access protected resources

## Getting Started

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-service-account.json"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the server:
```bash
npm start
```

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project and enable Google Authentication
   - Update Firebase config in `src/config/firebase.ts`
   - Configure Google Auth client IDs in `src/services/auth.ts`

4. Start the Expo development server:
```bash
npm start
```

## Development

### Server Development

- Use TypeScript for type safety
- Follow RESTful API design principles
- Use Prisma for database operations
- Firebase Admin SDK for token verification

### Client Development

- React Native with Expo for cross-platform mobile development
- Firebase Authentication for user management
- Expo Auth Session for Google Sign-In
- React Navigation for app navigation

## Features

- Goal-Based Financial Pooling: Users join challenges by contributing a fixed amount
- Automated Progress Tracking: Integration with Google Fit, Apple Health, and Fitbit
- Financial Incentive & Reward Distribution: Successful participants get rewards
- Gamification & Community Engagement: Leaderboards and progress tracking

## Technologies

- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Blockchain**: Solana (for secure financial transactions)
- **Frontend**: (To be implemented, likely React Native)

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/me` - Get current user

### Challenges
- `POST /challenges` - Create a new challenge
- `GET /challenges` - Get all challenges
- `GET /challenges/:id` - Get a specific challenge
- `POST /challenges/:id/join` - Join a challenge
- `POST /challenges/:id/progress` - Record progress
- `POST /challenges/:id/payment` - Mark payment as completed

## Blockchain Integration (Coming Soon)

The application will integrate with Solana blockchain for:
- Secure financial transactions
- Transparent pooling of funds
- Automated distribution of rewards

## License

MIT 