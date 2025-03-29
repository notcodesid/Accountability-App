"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Create a singleton instance of PrismaClient to be used throughout the app
const prisma = new client_1.PrismaClient();
exports.default = prisma;
