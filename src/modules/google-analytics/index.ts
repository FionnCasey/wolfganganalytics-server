import { GraphQLModule } from '@graphql-modules/core';

import MetricsModule from '../../utils/metricsGraphQLModule';
import { ClientProvider } from '../clients/provider';
import UserModule from '../users';
import typeDefs from './typeDefs';
import { GoogleAnalyticsProvider } from './provider';
import { View, Query } from './resolvers';
  
// Module for managing Google Analytics Reporting API requests
const googleAnalyticsModule = new GraphQLModule({
  typeDefs,
  imports: [
    MetricsModule,
    UserModule
  ],
  resolvers: {
    Query,
    View
  },
  providers: [
    ClientProvider,
    GoogleAnalyticsProvider
  ],
  context: session => session
});

export default googleAnalyticsModule;
