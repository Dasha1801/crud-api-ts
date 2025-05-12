import dotenv from 'dotenv';
import http from 'http';
import { requestListener } from './app';
import { DEFAULT_PORT } from './shared/constants';

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});