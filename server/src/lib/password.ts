import bcrypt from 'bcrypt';

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password to compare
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}; 