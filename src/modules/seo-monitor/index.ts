import { GraphQLModule } from '@graphql-modules/core';

import MetricsModule from '../../utils/metricsGraphQLModule';
import { ClientProvider } from '../clients/provider';
import typeDefs from './typeDefs';
import { SEOMonitorProvider } from './provider';
import { Query, Client } from './resolvers';

// Module for managing SEO Monitor API requests
const seoMonitorModule = new GraphQLModule({
  typeDefs,
  imports: [
    MetricsModule
  ],
  resolvers: {
    Query,
    Client
  },
  providers: [
    ClientProvider,
    SEOMonitorProvider
  ],
  context: session => session
});

export default seoMonitorModule;