import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { initSocket } from './socket.js';

const server = http.createServer(app);
initSocket(server, env.clientUrls);

server.listen(env.port, () => {
  console.log(`Backend running at http://localhost:${env.port}`);
});
