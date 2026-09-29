// Levanta la API con una MongoDB en memoria (sin Atlas) y datos de ejemplo.
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri('products');
process.env.KEEP_CONNECTION = '1';
await import('./seed.js');
await import('./index.js');

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    await mongod.stop();
    process.exit(0);
  });
}
