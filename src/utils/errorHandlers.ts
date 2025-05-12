import { ServerResponse } from 'http';
import { ERRORS } from '../shared/constants';

export const handle404 = (res: ServerResponse, error?: unknown) => {
  console.error('[404 Error]', error);

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: ERRORS.INVALID_ENDPOINT }));
};

export const handleServerError = (res: ServerResponse, error?: unknown) => {
  console.error('[500 Error]', error);

  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: ERRORS.SERVER_ERROR }));
};