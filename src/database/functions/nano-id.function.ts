import { customAlphabet } from 'nanoid';

const ID_LENGTH = 10;
export const nanoid = customAlphabet('1234567890abcdefABCDEF', ID_LENGTH)
