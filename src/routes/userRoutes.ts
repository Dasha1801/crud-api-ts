import { IncomingMessage, ServerResponse } from 'http';
import { userController } from '../controllers/userController';
import { isBaseUrl, matchUrl } from '../utils/checkUrl';

export const userRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const { method } = req;

  if (isBaseUrl(url)) {
    if (method === 'GET') {
      return userController.getUsers(req, res);
    }
    if (method === 'POST') {
      return userController.postUser(req, res);
    }
  }

  const id = matchUrl(url)?.[1];

  if (id) {
    if (method === 'GET') return userController.getUser(req, res, id);
    if (method === 'PUT') return userController.putUser(req, res, id);
    if (method === 'DELETE') return userController.removeUser(req, res, id);
  }
};