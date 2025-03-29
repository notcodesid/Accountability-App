"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function resetDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Resetting database...');
        // Delete all existing challenges
        yield prisma.challenge.deleteMany({});
        console.log('All data has been deleted.');
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // First reset the database to remove all existing data
        yield resetDatabase();
        // Create 5 fitness-focused challenges
        const challenges = [
            {
                title: '5K Daily Steps Challenge',
                description: 'Walk 5,000 steps every day to improve cardiovascular health and build a healthy daily movement habit.',
                type: 'Fitness',
                difficulty: client_1.ChallengeDifficulty.EASY,
                image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000',
                startDate: new Date(2024, 3, 15), // April 15, 2024
                endDate: new Date(2024, 4, 14), // May 14, 2024
                duration: '30 days',
                userStake: 2000, // $20.00
                totalPrizePool: 30000, // $300.00
                participantCount: 15,
                rules: [
                    'Complete 5,000 steps daily (tracked by fitness app/device)',
                    'Sync step data with our platform daily',
                    'Steps must be logged within the 24-hour period',
                    'No carry-over of extra steps to the next day'
                ],
                metrics: '5,000 steps daily',
                trackingMetrics: ['Step count', 'Distance covered', 'Consistency']
            },
            {
                title: '20 Push-Ups Challenge',
                description: 'Complete 20 push-ups daily to build upper body strength and establish a consistent exercise routine.',
                type: 'Fitness',
                difficulty: client_1.ChallengeDifficulty.MODERATE,
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000',
                startDate: new Date(2024, 3, 1), // April 1, 2024
                endDate: new Date(2024, 3, 21), // April 21, 2024
                duration: '21 days',
                userStake: 2500, // $25.00
                totalPrizePool: 25000, // $250.00
                participantCount: 10,
                rules: [
                    'Complete exactly 20 push-ups each day',
                    'Post a daily progress photo or video',
                    'You can split your daily goal into multiple sets',
                    'Modified push-ups are acceptable for beginners'
                ],
                metrics: '20 push-ups daily',
                trackingMetrics: ['Push-up count', 'Form quality', 'Consistency']
            },
            {
                title: '30-Minute Daily Workout',
                description: 'Commit to 30 minutes of exercise every day, any form of movement counts as long as you keep your heart rate elevated.',
                type: 'Fitness',
                difficulty: client_1.ChallengeDifficulty.MODERATE,
                image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1000',
                startDate: new Date(2024, 4, 1), // May 1, 2024
                endDate: new Date(2024, 4, 30), // May 30, 2024
                duration: '30 days',
                userStake: 3000, // $30.00
                totalPrizePool: 45000, // $450.00
                participantCount: 15,
                rules: [
                    'Complete 30 minutes of continuous exercise daily',
                    'Log workout type and duration in the app',
                    'Heart rate must reach at least 50% of max during workout',
                    'Any form of exercise is valid (walking, running, cycling, HIIT, etc.)'
                ],
                metrics: '30 minutes of exercise daily',
                trackingMetrics: ['Workout duration', 'Heart rate', 'Exercise type']
            },
            {
                title: '10 Flight Stair Challenge',
                description: 'Climb 10 flights of stairs every day to build lower body strength and improve cardiovascular fitness.',
                type: 'Fitness',
                difficulty: client_1.ChallengeDifficulty.MODERATE,
                image: 'https://images.unsplash.com/photo-1605206809620-f13463473f1a?auto=format&fit=crop&w=1000',
                startDate: new Date(2024, 3, 10), // April 10, 2024
                endDate: new Date(2024, 3, 24), // April 24, 2024
                duration: '14 days',
                userStake: 2000, // $20.00
                totalPrizePool: 24000, // $240.00
                participantCount: 12,
                rules: [
                    'Climb 10 flights of stairs daily (can be cumulative throughout the day)',
                    'Log each stair session with time and location',
                    'Stair-climbing machines at the gym are acceptable',
                    'Each flight must have at least 10 steps to count'
                ],
                metrics: '10 flights of stairs daily',
                trackingMetrics: ['Flights climbed', 'Elevation gain', 'Time to complete']
            },
            {
                title: '1-Mile Daily Run',
                description: 'Run 1 mile every day to build running consistency and improve aerobic capacity.',
                type: 'Fitness',
                difficulty: client_1.ChallengeDifficulty.HARD,
                image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1000',
                startDate: new Date(2024, 5, 1), // June 1, 2024
                endDate: new Date(2024, 5, 30), // June 30, 2024
                duration: '30 days',
                userStake: 4000, // $40.00
                totalPrizePool: 60000, // $600.00
                participantCount: 15,
                rules: [
                    'Run at least 1 mile (1.6km) every day',
                    'Track run with GPS app or device',
                    'Indoor treadmill runs are acceptable',
                    'Minimum pace requirement: must be running, not walking',
                    'No banking miles - each day requires a separate 1-mile minimum run'
                ],
                metrics: '1 mile run daily',
                trackingMetrics: ['Distance', 'Pace', 'Completion time']
            }
        ];
        console.log('Starting to seed fitness challenges...');
        for (const challengeData of challenges) {
            const challenge = yield prisma.challenge.create({
                data: challengeData
            });
            console.log(`Created challenge: ${challenge.title}`);
        }
        console.log('Seeding completed successfully.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
