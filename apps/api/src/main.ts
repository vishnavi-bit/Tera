// Entry point: starts the API on PORT (default 3000).
import { start } from './http/server';

start().then((server) => {
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : addr;
  console.log(`api listening on port ${port}`);
});
