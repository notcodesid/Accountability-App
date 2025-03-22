# Accountability-as-a-Service Application

A mobile-based application that leverages financial incentives and competition to drive goal completion. Users can commit to personal goals, stake money on their success, and compete with others to stay accountable.

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

## Project Structure

```
.
├── server/             # Backend API server
│   ├── src/            # TypeScript source files
│   │   ├── routes/     # API route definitions
│   │   ├── middleware/ # Express middleware
│   │   ├── types/      # TypeScript type definitions
│   │   └── index.ts    # Entry point
│   ├── prisma/         # Prisma ORM schema and migrations
│   └── dist/           # Compiled JavaScript files
└── client/             # Frontend application (to be implemented)
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Solana wallet/tools (for blockchain features)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd accountability
   ```

2. Install dependencies:
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/accountability"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Build the TypeScript code:
   ```bash
   npm run build
   ```

6. Start the server:
   ```bash
   npm start
   ```

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