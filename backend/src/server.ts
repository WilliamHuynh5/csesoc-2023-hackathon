import { PORT, HOST, DEBUG, SERVER_URL } from '../shared/constants';
import { app } from './app';
import { loadData } from './app/data';

const server = app.listen(PORT, HOST, () => {
  loadData();
  console.log(`⚡️ Local Server listening on port ${PORT} at ${HOST}`);
  console.log(`Open "${SERVER_URL}" for further documentations!`);
  console.log(`\nDEBUG: {${DEBUG}}\n`);
});

process.on('SIGINT', () => {
  server.close(
    () => {
      console.log('Shutting down server gracefully.');
      process.exit();
    }
  );
});
