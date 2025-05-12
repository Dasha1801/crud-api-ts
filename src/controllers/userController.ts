import { IncomingMessage, ServerResponse } from 'http';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../services/userService';
import { handleServerError } from '../utils/errorHandlers';
import { validateUserInput, validateUUID } from '../utils/validators';
import { ERRORS } from '../shared/constants';
import { UserInput } from '../interfaces/user.interface';

const parseBody = (req: IncomingMessage): Promise<UserInput> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

export const userController = {
  async getUsers(_: IncomingMessage, res: ServerResponse) {
    try {
      const users = getAllUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      handleServerError(res, error);
    }
  },

  async getUser(_: IncomingMessage, res: ServerResponse, id: string) {
    if (!validateUUID(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: ERRORS.INVALID_ID }));
    }

    try {
      const user = getUserById(id);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: ERRORS.USER_NOT_FOUND }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      handleServerError(res, error);
    }
  },

  async postUser(req: IncomingMessage, res: ServerResponse) {
    try {
      const data = await parseBody(req);
      const validation = validateUserInput(data);

      if (!validation.valid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: validation.message }));
      }

      const newUser = createUser(data);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));

    } catch (error) {
      handleServerError(res, error);
    }
  },

  async putUser(req: IncomingMessage, res: ServerResponse, id: string) {
    if (!validateUUID(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: ERRORS.INVALID_ID }));
    }

    const data = await parseBody(req);
    const validation = validateUserInput(data);
    if (!validation.valid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: validation.message }));
    }

    try {
      const updated = updateUser(id, data);
      if (!updated) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: ERRORS.USER_NOT_FOUND }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    } catch (error) {
      handleServerError(res, error);
    }
  },

  async removeUser(_: IncomingMessage, res: ServerResponse, id: string) {
    if (!validateUUID(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: ERRORS.INVALID_ID }));
    }

    try {
      const isDeleted = deleteUser(id);
      if (!isDeleted) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: ERRORS.USER_NOT_FOUND }));
      }

      res.writeHead(204);
      res.end();
    } catch (error) {
      handleServerError(res, error);
    }
  },
};