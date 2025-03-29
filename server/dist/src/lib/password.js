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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;
/**
 * Hash a password using bcrypt
 * @param password Plain text password to hash
 * @returns Hashed password
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
    return bcrypt_1.default.hash(password, salt);
});
exports.hashPassword = hashPassword;
/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password to compare
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
exports.comparePassword = comparePassword;
