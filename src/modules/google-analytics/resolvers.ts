import { ViewResolvers } from '../../generated-types/graphql';
import { ClientProvider } from '../clients/provider';
import { GoogleAnalyticsProvider } from './provider';

export const View: ViewResolvers = {
  googleAnalyticsReport: async (root, args, ctx) => {
    // @ts-ignore
    const client = await ctx.injector.get(ClientProvider).getClientById(root.clientId);
    
    const credentials = { accessToken: client.accessToken, refreshToken: client.refreshToken };

    return await ctx.injector.get(GoogleAnalyticsProvider).getGoogleAnalyticsReport(credentials, {
      viewId: root.id,
      ...args
    });
  },

  googleAdsReport: async (root, args, ctx) => {
    // @ts-ignore
    const client = await ctx.injector.get(ClientProvider).getClientById(root.clientId);

    const credentials = { accessToken: client.accessToken, refreshToken: client.refreshToken };

    return await ctx.injector.get(GoogleAnalyticsProvider).getGoogleAdsReport(credentials, {
      viewId: root.id,
      ...args
    });
  }
};