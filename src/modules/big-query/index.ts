import { GraphQLModule } from '@graphql-modules/core';

import { BigQueryProvider } from './provider';
import typeDefs from './typeDefs';
import { Client } from './resolvers';

const bigQueryModule = new GraphQLModule({
  typeDefs,
  providers: [
    BigQueryProvider
  ],
  resolvers: {
    Client
  },
  context: session => session
});

export default bigQueryModule;