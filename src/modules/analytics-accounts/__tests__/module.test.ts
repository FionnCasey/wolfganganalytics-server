import 'reflect-metadata';
import { execute } from 'graphql';
import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

import { mongoDbConfig } from '../../../config';
import AnalyticsAccountModule from '..';
import AnalyticsAccount from '../model';
import { AnalyticsAccountProvider } from '../provider';

const mockAnalyticsAccount = {
  email: 'mockanalytics@wolfgangdigital.com',
  accessToken: 'access',
  refreshToken: 'refresh'
};

const mockWebProperties = [
  {
    id: 'web_property_id',
    name: 'Jim Ltd.',
    accountId: 'account_id'
  }
];

const mockViews = [
  {
    id: 'view_id',
    name: 'Jim & Sons',
    accountId: mockWebProperties[0].accountId,
    webPropertyId: mockWebProperties[0].id
  }
];

describe('GraphQLModule: AnalyticsAccount', () => {
  let analyticsAccount;

  beforeAll(async () => {
    // Initialise db connection and insert a mock analytics account to test with
    await mongoose.connect(mongoDbConfig.uri, mongoDbConfig.options);
    analyticsAccount = await AnalyticsAccount.create(mockAnalyticsAccount);
  });

  afterAll(async () => {
    // Remove the mock analytics account and close db connection when done
    await AnalyticsAccount.findByIdAndDelete(analyticsAccount.id);
    await mongoose.connection.close();
  });

  const { schema, injector } = AnalyticsAccountModule;

  // @ts-ignore
  injector.provide({
    provide: AnalyticsAccountProvider,
    overwrite: true,
    useValue: {
      getAnalyticsAccounts: (args): any => new Promise(resolve => resolve([mockAnalyticsAccount])),
      getAnalyticsAccountById: (args): any => new Promise(resolve => resolve(mockAnalyticsAccount)),
      getWebProperties: (args): any => new Promise(resolve => resolve(mockWebProperties)),
      getViews: (args): any => new Promise(resolve => resolve(mockViews))
    }
  });

  it('Query: analyticsAccounts', async () => {
    const { data, errors } = await execute({
      schema,
      document: gql`
        query {
          analyticsAccounts {
            email
            accessToken
            refreshToken
            webProperties {
              id
              name
              accountId
              views {
                id
                name
                accountId
                webPropertyId
              }
            }
          }
        }
      `
    });
    expect(errors).toBeFalsy();
    expect(data.analyticsAccounts).toContainEqual({
      ...mockAnalyticsAccount,
      webProperties: [{
        ...mockWebProperties[0],
        views: mockViews
      }]
    });
  });

  it('Query: analyticsAccount', async () => {
    const { data, errors } = await execute({
      schema,
      document: gql`
        query {
          analyticsAccount(id: "test_id") {
            email
            accessToken
            refreshToken
            webProperties {
              id
              name
              accountId
              views {
                id
                name
                accountId
                webPropertyId
              }
            }
          }
        }
      `
    });
    expect(errors).toBeFalsy();
    expect(data.analyticsAccount).toEqual({
      ...mockAnalyticsAccount,
      webProperties: [{
        ...mockWebProperties[0],
        views: mockViews
      }]
    });
  });
});