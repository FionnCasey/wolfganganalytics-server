import { ValidationError } from 'apollo-server-core';

import { QueryResolvers, MutationResolvers } from '../../generated-types/graphql';
import { AnalyticsAccountProvider } from '../analytics-accounts/provider';
import { ClientProvider } from './provider';

export const Query: QueryResolvers = {
  // Returns all clients
  // TODO: Add criteria
  clients: async (root, args, ctx) => await ctx.injector.get(ClientProvider).getClients(),

  // Returns a client with the given ID or undefined
  client: async (root, args, ctx) => await ctx.injector.get(ClientProvider).getClientById(args.id)
};

export const Mutation: MutationResolvers = {
  createClient: async (root, args, ctx) => {
    const account = await ctx.injector.get(AnalyticsAccountProvider).getAnalyticsAccountByEmail(args.input.gaAccount);

    if (!account || !account.accessToken || !account.refreshToken) {
      throw new ValidationError(`Account not found for ${args.input.gaAccount}`);
    }

    const { accessToken, refreshToken } = account;

    return await ctx.injector.get(ClientProvider).createClient({ ...args, accessToken, refreshToken });
  }
};