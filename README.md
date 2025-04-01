# Accountability App

<video width="600" controls>
  <source src="https://video.twimg.com/ext_tw_video/1906044061628428290/pu/vid/avc1/1094x720/uQ70r0j-iufrxtHS.mp4?tag=12" type="video/mp4">
  Your browser does not support the video tag.
</video>

A platform that allows users to create and participate in challenges with financial incentives to help them stay accountable to their goals. Users can join challenges, track their progress, and earn rewards for successful completion.

## Features

- **Financial Stakes**: Users join challenges by contributing to a prize pool
- **Challenge Management**: Create and participate in various challenge types
- **Progress Tracking**: Monitor your advancement through challenges
- **Wallet System**: Integrated financial transactions for challenge stakes
- **Leaderboards**: See how you rank against other participants
- **Social Accountability**: Community-driven goal achievement

## Tech Stack

### Backend
- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT token-based auth

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Authentication**: Context API with JWT tokens

## Project Structure

The application consists of two main parts:

```
/
├── server/         # Node.js/Express backend
│   ├── src/          # TypeScript source code
│   ├── prisma/       # Database schema and migrations
│   └── ...
│
└── client/         # React Native mobile app
    ├── app/          # Expo Router screens
    ├── components/   # Reusable UI components 
    ├── constants/    # App constants and configuration
    ├── context/      # React Context providers
    ├── services/     # API and data services
    └── ...
```

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- PostgreSQL database
- iOS Simulator or Android Emulator (for mobile development)

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:
```bash
npx prisma migrate dev
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Follow the instructions in the terminal to run on iOS simulator or Android device/emulator.

## Platform-Specific Setup

### iOS
The app should work out of the box with iOS simulators or physical devices. Press `i` after starting the development server to open in an iOS simulator.

### Android

When running on Android devices or emulators, you need to ensure your app can connect to your development server:

1. **Quick Setup** - Run our automatic IP configuration script:
   ```bash
   cd client/scripts
   ./set-ip.sh
   ```
   
   The script will:
   - Detect your computer's IP address
   - Update the Environment.ts file automatically
   - Create a backup of your original config
   
2. Restart your development server:
   ```bash
   npm start
   ```

3. Make sure your Android device is on the same WiFi network as your development computer.

4. Scan the QR code with the Expo Go app or press `a` to open in an Android emulator.

## Troubleshooting Android Issues

If you're seeing a black screen or connection errors:

1. **Network Issues**:
   - Verify both devices are on the same network
   - Check if your network has client isolation enabled (common in public WiFi)
   - Try using a mobile hotspot from your phone

2. **Server Connection**:
   - Make sure your server is running: `cd server && npm run dev`
   - Try opening `http://YOUR_IP_ADDRESS:5000` in your computer's browser to verify the server is accessible

3. **Firewall Issues**:
   - Check if your computer's firewall is blocking connections
   - Temporarily disable the firewall for testing
   
4. **Different API URL**:
   - If using an Android emulator, try using `10.0.2.2` instead of your IP address
   - Manual edit in `client/constants/Environment.ts`: change `DEV_API_HOST` to your IP

For more detailed troubleshooting, refer to the [Android Troubleshooting Guide](client/ANDROID_GUIDE.md).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `GET /api/auth/me` - Get current user information

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get a specific challenge
- `GET /api/challenges/user/active` - Get user's active challenges
- `POST /api/challenges/:id/join` - Join a challenge

### Wallet
- `GET /api/wallet/balance` - Get user's wallet balance
- `GET /api/wallet/transactions` - Get user's transaction history

### Leaderboard
- `GET /api/leaderboard` - Get the global leaderboard
- `GET /api/leaderboard/user/:userId` - Get a specific user's rank

## Application Workflow

1. **Authentication**: Users sign up or log in
2. **Browse Challenges**: View available challenges
3. **Join Challenge**: Stake funds to join a challenge
4. **Track Progress**: Update and monitor progress
5. **Challenge Completion**: Successful participants receive rewards from the prize pool

## Development

To contribute to development:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT 
