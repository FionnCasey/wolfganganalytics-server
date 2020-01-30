import 'reflect-metadata';
import { execute } from 'graphql';
import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

import { mongoDbConfig } from '../../../config';
import ClientModule from '..';
import Client from '../model';

const mockClient = {
  name: "Slim Jim's",
  industry: 'Retail',
  gaAccount: 'analytics@wolfgangdigital.com',
  tier: 1,
  views: [],
  primaryViewId: '0',
  accessToken: 'access',
  refreshToken: 'refresh'
};

describe('GraphQLModule: Client', () => {
  let client;

  beforeAll(async () => {
    // Initialise db connection and insert a mock client to test with
    await mongoose.connect(mongoDbConfig.uri, mongoDbConfig.options);
    client = await Client.create(mockClient);
  });

  afterAll(async () => {
    // Remove the mock client and close db connection when done
    await Client.findByIdAndDelete(client.id);
    await mongoose.connection.close();
  });

  const { schema } = ClientModule;

  it('Query: clients', async () => {
    const { data, errors } = await execute({
      schema,
      document: gql`
        query {
          clients {
            name
            industry
            gaAccount
            tier
            accessToken
            refreshToken
            primaryViewId
            views {
              id
            }
          }
        }
      `
    });
    
    expect(errors).toBeFalsy();
    expect(data.clients).toContainEqual(mockClient);
  });

  it('Query: client ', async () => {
    const { data, errors } = await execute({
      schema,
      variableValues: {
        id: client.id
      },
      document: gql`
        query($id: ID!) {
          client(id: $id) {
            name
            industry
            gaAccount
            tier
            accessToken
            refreshToken
            primaryViewId
            views {
              id
            }
          }
        }
      `
    });

    expect(errors).toBeFalsy();
    expect(data.client).toMatchObject(mockClient);
  });
});