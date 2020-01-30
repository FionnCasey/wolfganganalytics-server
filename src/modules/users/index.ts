import { GraphQLModule } from '@graphql-modules/core';

import { isAuthorised } from '../authentication/middleware';
import typeDefs from './typeDefs';
import { Query } from './resolvers';
import { UserProvider } from './provider';
  
// Module for managing Wolfgang Digital employees
const usersModule = new GraphQLModule({
  typeDefs,
  resolvers: {
    Query
  },
  providers: [
    UserProvider
  ],
  context: session => session,
  // Auth middleware
  resolversComposition: {
    'Query.users': [isAuthorised()],
    'Query.user': [isAuthorised()]
  }
});

export default usersModule;