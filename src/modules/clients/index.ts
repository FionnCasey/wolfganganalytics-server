import { GraphQLModule } from '@graphql-modules/core';

import GoogleAnalyticsModule from '../google-analytics';
import { AnalyticsAccountProvider } from '../analytics-accounts/provider';
import UserModule from '../users';
import { isAuthorised } from '../authentication/middleware';
import typeDefs from './typeDefs';
import { Query, Mutation } from './resolvers';
import { ClientProvider } from './provider';

// Module for managing Wolfgang Digital clients
const clientsModule = new GraphQLModule({
  typeDefs,
  resolvers: {
    Query,
    Mutation
  },
  imports: [
    UserModule,
    GoogleAnalyticsModule
  ],
  providers: [
    ClientProvider,
    AnalyticsAccountProvider
  ],
  context: session => session,
  // Auth middleware
  resolversComposition: {
    'Query.clients': [isAuthorised()],
    'Query.client': [isAuthorised()]
  }
});

export default clientsModule;