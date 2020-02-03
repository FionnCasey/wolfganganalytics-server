import { meanBy } from 'lodash';

import { QueryResolvers, ClientResolvers } from '../../generated-types/graphql';
import { ClientProvider } from '../clients/provider';
import { SEOMonitorProvider } from './provider';

export const Query: QueryResolvers = {
  visibilityScoreSummary: async (root, args, ctx) => {
    // Only get clients that have an SEO Monitor ID
    const clients = await ctx.injector.get(ClientProvider).getClients({ seoMonitorId: { $nin: [null, undefined, ''] } });

    const requests = clients.map(client => {
      return ctx.injector.get(SEOMonitorProvider).getVisbilityScore({
        accountId: client.seoMonitorId as string,
        dates: args.dateRange
      }).catch();
    });

    const data = await Promise.all(requests);

    return {
      dateRanges: [args.dateRange],
      desktopData: {
        current: meanBy(data, 'desktop.current').toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        previous: meanBy(data, 'desktop.previous').toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        delta: (meanBy(data, 'desktop.previous') - meanBy(data, 'desktop.current')).toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 })
      },
      mobileData: {
        current: meanBy(data, 'mobile.current').toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        previous: meanBy(data, 'mobile.previous').toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        delta: (meanBy(data, 'mobile.previous') - meanBy(data, 'mobile.current')).toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 })
      }
    };
  }
};

export const Client: ClientResolvers = {
  visibilityScoreReport: async (root, args, ctx) => {
    if (!root.seoMonitorId) return null;

    const report = await ctx.injector.get(SEOMonitorProvider).getVisbilityScore({
      accountId: root.seoMonitorId,
      dates: args.dateRange
    });

    return {
      dateRanges: [args.dateRange],
      desktopData: {
        current: report.desktop.current.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        previous: report.desktop.previous.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        delta: report.desktop.delta.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 })
      },
      mobileData: {
        current: report.mobile.current.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        previous: report.mobile.previous.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 }),
        delta: report.mobile.delta.toLocaleString('en-GB', { style: 'percent', maximumFractionDigits: 1 })
      }
    };
  }
};