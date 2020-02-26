import { ClientResolvers } from '../../generated-types/graphql';
import { BigQueryProvider } from './provider';

export const Client: ClientResolvers = {
  pagespeed: async (root, args, ctx) =>  await ctx.injector.get(BigQueryProvider).getPagespeed(root.id)
};