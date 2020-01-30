import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import session from 'cookie-session';

import { PORT, mongoDbConfig, sessionConfig } from './config';
import schema from './schema';
import passport from './modules/authentication/passport';
import authRouter from './modules/authentication/router';

const app = express();

// Initialise middleware
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Routes for user authentication with Google OAuth
app.use('/auth', authRouter);

const server = new ApolloServer({
  schema,
  context: session => session,
  introspection: true
});

server.applyMiddleware({
  app,
  path: '/api'
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/api`);
});

// Initialise MongoDB connection
mongoose.connect(mongoDbConfig.uri, mongoDbConfig.options, error => {
  if (error) console.log(`MongoDB error: ${error}`);
  else console.log('Connected to MongoDB');
});