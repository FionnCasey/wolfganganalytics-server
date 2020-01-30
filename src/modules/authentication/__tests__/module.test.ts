import 'reflect-metadata';
import { execute } from 'graphql';
import { gql } from 'apollo-server-express';
import { GraphQLModule } from '@graphql-modules/core';
import { get } from 'lodash';

import { isAuthorised, hasPermission } from '../middleware';
import { Permission } from '../../../generated-types/graphql';

describe('GraphQLModule: Authentication', () => {
  const { schema: noCtxSchema } = new GraphQLModule({
    typeDefs: gql`
      type Query {
        requiresAuthorisedUser: String!
      }
    `,
    resolvers: {
      Query: {
        requiresAuthorisedUser: () => 'success'
      }
    },
    // Pass skip = false flag to avoid skipping in dev mode
    resolversComposition: {
      'Query.requiresAuthorisedUser': [isAuthorised(false)],
    }
  });

  const { schema: ctxSchema } = new GraphQLModule({
    typeDefs: gql`
      type Query {
        requiresAuthorisedUser: String!
        requiresCreateClientPermission: String!
        requiresUpdateClientPermission: String!
      }
    `,
    resolvers: {
      Query: {
        requiresAuthorisedUser: () => 'success',
        requiresCreateClientPermission: () => 'success',
        requiresUpdateClientPermission: () => 'success'
      }
    },
    context: () => ({
      req: {
        user: {
          permissions: ['CREATE_CLIENTS']
        }
      }
    }),
    // Pass skip = false flag to avoid skipping in dev mode
    resolversComposition: {
      'Query.requiresAuthorisedUser': [isAuthorised(false)],
      'Query.requiresCreateClientPermission': [hasPermission(false, Permission.Create_Clients)],
      'Query.requiresUpdateClientPermission': [hasPermission(false, Permission.Update_Clients)],
    }
  });

  it('isAuthorised: Failure', async () => {
    const { data, errors } = await execute({
      schema: noCtxSchema,
      document: gql`
        query {
          requiresAuthorisedUser
        }
      `
    });

    const code = get(errors, '[0].extensions.code', 'undefined');
    expect(data).toBeFalsy();
    expect(code).toBe('UNAUTHENTICATED');
  });

  it('isAuthorised: Success', async () => {
    const { data, errors } = await execute({
      schema: ctxSchema,
      document: gql`
        query {
          requiresAuthorisedUser
        }
      `
    });
    
    expect(errors).toBeFalsy();
    expect(data.requiresAuthorisedUser).toBe('success');
  });
});