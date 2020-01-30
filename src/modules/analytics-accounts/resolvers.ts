import { UserInputError } from 'apollo-server-core';

import {
  QueryResolvers,
  AnalyticsAccountResolvers,
  WebPropertyResolvers
} from '../../generated-types/graphql';

import { AnalyticsAccountProvider } from './provider';

export const Query: QueryResolvers = {
  // Return all analytics accounts
  analyticsAccounts: async (root, args, ctx) => await ctx.injector.get(AnalyticsAccountProvider).getAnalyticsAccounts(),

  // Returns an analytics account with the given ID or undefined
  analyticsAccount: async (root, args, ctx) => await ctx.injector.get(AnalyticsAccountProvider).getAnalyticsAccountById(args.id)
};

export const AnalyticsAccount: AnalyticsAccountResolvers = {
  // The root ID is passed internally but not exposed to on the API so codegen doesn't generate the rootId property
  // @ts-ignore
  webProperties: async (root, args, ctx) => {
    const webProperties = await ctx.injector.get(AnalyticsAccountProvider).getWebProperties({
      accessToken: root.accessToken,
      refreshToken: root.refreshToken
    });

    return webProperties.map(webProperty => ({ ...webProperty, rootId: root.id }));
  }
};

export const WebProperty: WebPropertyResolvers = {
  views: async (root, args, ctx) => {
    // The root ID is passed internally but not exposed to on the API so codegen doesn't generate the rootId property
    // @ts-ignore
    const account = await ctx.injector.get(AnalyticsAccountProvider).getAnalyticsAccountById(root.rootId);

    if (!account) {
      throw new UserInputError('Analytics account not found');
    }

    const views = await ctx.injector.get(AnalyticsAccountProvider).getViews({
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accountId: root.accountId,
      webPropertyId: root.id
    });

    // Attach analytics account id
    // @ts-ignore
    return views.map(view => ({ ...view, rootId: root.rootId }));
  }
};