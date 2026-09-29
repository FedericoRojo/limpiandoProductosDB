import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import http from 'http';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const { MONGODB_URI, PORT = 4000 } = process.env;
if (!MONGODB_URI) {
  console.error('Falta la variable de entorno MONGODB_URI');
  process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // habilitada también en producción (Render)
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Fuerza Apollo Sandbox embebido incluso con NODE_ENV=production
    ApolloServerPluginLandingPageLocalDefault({ embed: true, includeCookies: false }),
  ],
});

await mongoose.connect(MONGODB_URI);
console.log('Conectado a MongoDB Atlas');

await server.start();

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/graphql', cors(), express.json(), expressMiddleware(server));
app.get('/', (_req, res) => res.redirect('/graphql'));

await new Promise((resolve) => httpServer.listen({ port: PORT, host: '0.0.0.0' }, resolve));
console.log(`Servidor listo en http://localhost:${PORT}/graphql`);
