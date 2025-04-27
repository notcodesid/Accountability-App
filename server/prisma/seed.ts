import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const challenges = [
  {
    id: "1",
    title: '10K Steps Daily',
    type: 'Steps',
    duration: '30 days',
    difficulty: "MODERATE",
    userStake: 5000, // $50.00
    totalPrizePool: 780000, // $7,800.00
    participantCount: 156,
    description: 'Walk 10,000 steps every day for 30 days to complete this challenge. Track your progress with any fitness app or device.',
    rules: [
      'Complete 10,000 steps daily',
      'Must sync data with fitness tracker',
      'Rest days are not counted',
      'Missed days will reset progress'
    ],
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-30'),
    metrics: 'Steps Count',
    trackingMetrics: ['Steps Count', 'Distance Covered', 'Calories Burned']
  },
  {
    id: "2",
    title: 'Early Riser Challenge',
    type: 'Daily Routine',
    duration: '21 days',
    difficulty: "EASY",
    userStake: 3000, // $30.00
    totalPrizePool: 126000, // $1,260.00
    participantCount: 42,
    description: 'Wake up before 6:00 AM every day for 21 days. Build discipline and maximize your mornings.',
    rules: [
      'Log wake-up time daily',
      'Proof via time-stamped selfie or app tracker',
      'Missing 2 days will disqualify from rewards'
    ],
    image: 'https://images.unsplash.com/photo-1550345332-09e3ac2296fa?auto=format&fit=crop&w=1000',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-21'),
    metrics: 'Wake Up Time',
    trackingMetrics: ['Wake Up Time', 'Consistency', 'Check-in Proof']
  },
  {
    id: "3",
    title: 'Reading Marathon',
    type: 'Habits',
    duration: '15 days',
    difficulty: "EASY",
    userStake: 2000, // $20.00
    totalPrizePool: 76000, // $760.00
    participantCount: 38,
    description: 'Read at least 20 pages every day for 15 days. Grow your mind one page at a time!',
    rules: [
      'Submit daily reading log',
      'Share book title and pages read',
      'Max 1 skip day allowed'
    ],
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000',
    startDate: new Date('2024-05-05'),
    endDate: new Date('2024-05-20'),
    metrics: 'Pages Read',
    trackingMetrics: ['Pages Read', 'Consistency']
  }
];

async function main() {
  console.log('Seeding database...');

  // Create challenges
  for (const challenge of challenges) {
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: challenge.id },
    });

    if (!existingChallenge) {
      await prisma.challenge.create({
        data: {
          id: challenge.id,
          title: challenge.title,
          type: challenge.type,
          duration: challenge.duration,
          progress: 0.0,
          participantCount: challenge.participantCount,
          contribution: challenge.userStake,
          prizePool: challenge.totalPrizePool,
          status: 'ACTIVE',
          description: challenge.description,
          rules: challenge.rules,
          image: challenge.image,
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          creatorName: 'System',
          trackingMetrics: challenge.trackingMetrics
        }
      });

      console.log(`Created challenge: ${challenge.title}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });