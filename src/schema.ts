import 'reflect-metadata';
import { GraphQLModule } from '@graphql-modules/core';

import UserModule from './modules/users';
import ClientModule from './modules/clients';
import AnalyticsAccountModule from './modules/analytics-accounts';

// Root module to import all other GraphQL modules and export schema
const appModule = new GraphQLModule({
  imports:[
    UserModule,
    ClientModule,
    AnalyticsAccountModule
  ]
});

export default appModule.schema;