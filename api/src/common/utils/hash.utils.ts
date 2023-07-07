import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const encode = async (plainStr: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(plainStr, salt);
  return hashed;
};

const compare = async (
  plainStr: string,
  hashedStr: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainStr, hashedStr);
};

export const hash = { encode, compare };
