import { GraphQLModule } from '@graphql-modules/core';

import { isAuthorised } from '../authentication/middleware';
import typeDefs from './typeDefs';
import { AnalyticsAccountProvider } from './provider';
import { Query, AnalyticsAccount, WebProperty } from './resolvers';

const analyticsAccountsModule = new GraphQLModule({
  typeDefs,
  resolvers: {
    Query,
    AnalyticsAccount,
    WebProperty
  },
  providers: [
    AnalyticsAccountProvider
  ],
  context: session => session,
  // Auth middleware
  resolversComposition: {
    'Query.analyticsAccounts': [isAuthorised()],
    'Query.analyticsAccount': [isAuthorised()]
  }
});

export default analyticsAccountsModule;