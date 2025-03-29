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
const password_1 = require("../src/lib/password");
const prisma = new client_1.PrismaClient();
const leaderboardData = [
    { name: 'Goku', points: 2850, avatar: 'https://i.pinimg.com/736x/e2/f0/6c/e2f06c9101dc22814be2a2352f7dc871.jpg', rank: 1 },
    { name: 'Luffy', points: 2720, avatar: 'https://i.pinimg.com/736x/0d/98/b2/0d98b2916254548f2c79a57eb8768969.jpg', rank: 2 },
    { name: 'Levi Ackerman', points: 2540, avatar: 'https://i.pinimg.com/736x/49/0c/9e/490c9ef127fca74c07c339a998e96286.jpg', rank: 3 },
    { name: 'Light Yagami', points: 2350, avatar: 'https://i.pinimg.com/736x/91/3a/7d/913a7d47adda9de9a441c7a6c554a211.jpg', rank: 4 },
    { name: 'Naruto Uzumaki', points: 2180, avatar: 'https://i.pinimg.com/736x/4a/28/78/4a2878cd36ba397be2163c55cfef0026.jpg', rank: 5 },
    { name: 'Itachi Uchiha', points: 2050, avatar: 'https://i.pinimg.com/736x/ad/d7/6f/add76f09ad6577fe5c76f7af54adf633.jpg', rank: 6 },
    { name: 'Edward Elric', points: 1920, avatar: 'https://i.pinimg.com/736x/dd/ee/f5/ddeef5dd4173a48e8f8d69272aa064ca.jpg', rank: 7 },
    { name: 'Gojo Satoru', points: 1870, avatar: 'https://i.pinimg.com/736x/b9/66/8b/b9668b8233a769967e4ba7cdf0e0d3bf.jpg', rank: 8 },
    { name: 'Eren Yeager', points: 1760, avatar: 'https://randomuser.me/api/portraits/men/62.jpg', rank: 9 },
    { name: 'Zoro', points: 1650, avatar: 'https://i.pinimg.com/736x/40/15/36/4015368ab3afc5b1e352fe56b8d356b2.jpg', rank: 10 }
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        // Create demo users for the leaderboard if they don't exist
        for (const leaderData of leaderboardData) {
            // Create a user with the same name (lowercase and no spaces as username)
            const username = leaderData.name.toLowerCase().replace(/\s+/g, '');
            // Check if user already exists
            const existingUser = yield prisma.user.findUnique({
                where: { username }
            });
            if (!existingUser) {
                // Create the user
                const hashedPassword = yield (0, password_1.hashPassword)('password123');
                const user = yield prisma.user.create({
                    data: {
                        email: `${username}@example.com`,
                        username,
                        password: hashedPassword,
                    },
                });
                // Create the leaderboard entry
                yield prisma.leaderboardUser.create({
                    data: {
                        userId: user.id,
                        name: leaderData.name,
                        points: leaderData.points,
                        avatar: leaderData.avatar,
                        rank: leaderData.rank,
                    },
                });
                console.log(`Created user and leaderboard entry for ${leaderData.name}`);
            }
            else {
                // If user exists, just update the leaderboard entry
                const existingLeaderboardEntry = yield prisma.leaderboardUser.findUnique({
                    where: { userId: existingUser.id }
                });
                if (existingLeaderboardEntry) {
                    yield prisma.leaderboardUser.update({
                        where: { id: existingLeaderboardEntry.id },
                        data: {
                            points: leaderData.points,
                            avatar: leaderData.avatar,
                            rank: leaderData.rank,
                        },
                    });
                    console.log(`Updated leaderboard entry for ${leaderData.name}`);
                }
                else {
                    yield prisma.leaderboardUser.create({
                        data: {
                            userId: existingUser.id,
                            name: leaderData.name,
                            points: leaderData.points,
                            avatar: leaderData.avatar,
                            rank: leaderData.rank,
                        },
                    });
                    console.log(`Created leaderboard entry for existing user ${leaderData.name}`);
                }
            }
        }
        console.log('Seeding completed successfully!');
    });
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
