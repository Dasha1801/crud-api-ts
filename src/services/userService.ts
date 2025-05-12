import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { User, UserInput } from '../interfaces/user.interface';

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'db.json');

let users: User[] = loadUsers();

function loadUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(): void {
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export const getAllUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
  users.find((user) => user.id === id);

export const createUser = (userInput: UserInput): User => {
  const newUser: User = {
    id: uuidv4(),
    ...userInput,
  };
  users.push(newUser);
  saveUsers();
  return newUser;
};

export const updateUser = (id: string, userInput: UserInput): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return undefined;

  const updatedUser = { id, ...userInput };
  users[userIndex] = updatedUser;
  saveUsers();
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter((user) => user.id !== id);
  if (users.length !== initialLength) {
    saveUsers();
    return true;
  }
  return false;
};