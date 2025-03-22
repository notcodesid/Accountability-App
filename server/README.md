# Accountability App - Backend Server

This is the backend server for the Accountability App, a platform that allows users to create and participate in challenges with financial incentives.

## Technologies

- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- Firebase Authentication

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with the following variables:
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

6. Build the TypeScript code:
```bash
npm run build
```

7. Start the server:
```bash
npm start
```

## Firebase Authentication

This application uses Firebase Authentication for user authentication. To set up Firebase:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Set up Google Authentication in the Firebase Console
3. Download your Firebase service account key JSON file
4. Set the path to this file in your `.env` file as `GOOGLE_APPLICATION_CREDENTIALS`

## API Endpoints

### Authentication

- **POST /auth/firebase** - Authenticate with Firebase token
  - Request body: `{ "idToken": "firebase-id-token" }`
  - Response: `{ "user": { ... } }`

- **GET /auth/me** - Get current user information
  - Headers: `Authorization: Bearer {firebase-id-token}`
  - Response: User object

### Challenges

- **GET /challenges** - Get all challenges
- **POST /challenges** - Create a new challenge
- **GET /challenges/:id** - Get a specific challenge
- **POST /challenges/:id/join** - Join a challenge
- **POST /challenges/:id/progress** - Record progress for a challenge

## Development

To run in development mode with hot reloading:
```bash
npm run dev
``` 