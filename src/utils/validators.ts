import { validate as uuidValidate } from 'uuid';
import { UserInput } from '../interfaces/user.interface.js';
import { ERRORS } from '../shared/constants.js';

export const validateUUID = (id: string): boolean => uuidValidate(id);

export const validateUserInput = (user: Partial<UserInput>): { valid: boolean; message?: string } => {
  if (!user.username || !user.age || !user.hobbies) {
    return { valid: false, message: ERRORS.MISSING_FIELDS };
  }

  if (typeof user.username !== 'string') {
    return { valid: false, message: ERRORS.INVALID_BODY };
  }

  if (typeof user.age !== 'number' || user.age <= 0) {
    return { valid: false, message: ERRORS.INVALID_BODY };
  }

  if (!Array.isArray(user.hobbies) || !user.hobbies.every((hobby) => typeof hobby === 'string')) {
    return { valid: false, message: ERRORS.INVALID_BODY };
  }

  return { valid: true };
};