import 'reflect-metadata';
import { execute } from 'graphql';
import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';

import { mongoDbConfig } from '../../../config';
import UserModule from '..';
import { UserProvider } from '../provider';
import User from '../model';

const mockUser = {
  firstName: 'Jim',
  lastName: 'Dew',
  email: 'jim@wolfgangdigital.com'
};

describe('GraphQLModule: User', () => {
  let user;

  beforeAll(async () => {
    // Initialise db connection and insert a mock user to test with
    await mongoose.connect(mongoDbConfig.uri, mongoDbConfig.options);
    user = await User.create(mockUser);
  });

  afterAll(async () => {
    // Remove the mock user and close db connection when done
    await User.findByIdAndDelete(user.id);
    await mongoose.connection.close();
  });

  const { schema } = UserModule;

  it('Query: users', async () => {
    const { data, errors } = await execute({
      schema,
      document: gql`
        query {
          users {
            firstName
            lastName
            email
          }
        }
      `
    });
    expect(errors).toBeFalsy();
    expect(data.users).toContainEqual(mockUser);
  });

  it('Query: user', async () => {
    const { data, errors } = await execute({
      schema,
      variableValues: {
        id: user.id
      },
      document: gql`
        query($id: ID!) {
          user(id: $id) {
            firstName
            lastName
            email
          }
        }
      `
    });
    expect(errors).toBeFalsy();
    expect(data.user).toMatchObject(mockUser);
  });
});