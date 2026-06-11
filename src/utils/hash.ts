import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(data: string): Promise<string> {
  return bcrypt.hash(data, SALT_ROUNDS);
}

export async function comparePassword(
  data: string,
  encrypted: string,
): Promise<boolean> {
  return bcrypt.compare(data, encrypted);
}
