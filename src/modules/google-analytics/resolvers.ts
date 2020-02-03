import { pick, mean } from 'lodash';

import { ViewResolvers, QueryResolvers } from '../../generated-types/graphql';
import { ClientProvider } from '../clients/provider';
import { GoogleAnalyticsProvider } from './provider';
import { getChannelName } from './utils';

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

export const Query: QueryResolvers = {
  googleAnalyticsDepartmentSummary: async (root, args, ctx) => {
    const clients = await ctx.injector.get(ClientProvider).getClients();

    const requests = clients.map(client => {
      const credentials = { accessToken: client.accessToken, refreshToken: client.refreshToken };
      return ctx.injector.get(GoogleAnalyticsProvider).getGoogleAnalyticsDepartmentSummary(credentials, {
        viewId: client.primaryViewId,
        ...args
      });
    });

    const data = await Promise.all(requests);

    const summary = data.reduce((result: any, clientData) => {
      clientData.forEach(metric => {
        if (result[metric.name]) {
          result[metric.name].currentValues.push(metric.current);
          result[metric.name].previousValues.push(metric.previous);
        } else {
          result[metric.name] = {
            ...pick(metric, 'name', 'displayFormat', 'invertColours'),
            currentValues: [metric.current],
            previousValues: [metric.previous]
          };
        }
      });
      return result;
    }, {});

    return {
      source: 'Google Analytics',
      channel: getChannelName(args.department),
      dateRanges: args.dateRanges,
      data: Object.values(summary).map((metric: any) => {
        const currentAvgValue = mean(metric.currentValues);
        const previousAvgValue = mean(metric.previousValues);

        return {
          ...pick(metric, 'name', 'displayFormat', 'invertColours'),
          currentAvgValue: currentAvgValue.toLocaleString('en-GB', { useGrouping: true, maximumFractionDigits: currentAvgValue > 1 ? 0 : 1 }),
          previousAvgValue: previousAvgValue.toLocaleString('en-GB', { useGrouping: true, maximumFractionDigits: previousAvgValue > 1 ? 0 : 1 }),
          delta: ((previousAvgValue - currentAvgValue) / previousAvgValue).toLocaleString('en-GB', { style: 'percent' })
        };
      })
    };
  },

  googleAdsDepartmentSummary: async (root, args, ctx) => {
    const clients = await ctx.injector.get(ClientProvider).getClients();

    const requests = clients.map(client => {
      const credentials = { accessToken: client.accessToken, refreshToken: client.refreshToken };
      return ctx.injector.get(GoogleAnalyticsProvider).getGoogleAdsDepartmentSummary(credentials, {
        viewId: client.primaryViewId,
        ...args
      }).catch();
    });

    const data = await Promise.all(requests);

    const summary = data.reduce((result: any, clientData) => {
      clientData.forEach(metric => {
        if (result[metric.name]) {
          result[metric.name].currentValues.push(metric.current);
          result[metric.name].previousValues.push(metric.previous);
        } else {
          result[metric.name] = {
            ...pick(metric, 'name', 'displayFormat', 'invertColours'),
            currentValues: [metric.current],
            previousValues: [metric.previous]
          };
        }
      });
      return result;
    }, {});

    return {
      source: 'Google Ads',
      channel: 'PPC',
      dateRanges: args.dateRanges,
      data: Object.values(summary).map((metric: any) => {
        const currentAvgValue = mean(metric.currentValues);
        const previousAvgValue = mean(metric.previousValues);

        return {
          ...pick(metric, 'name', 'displayFormat', 'invertColours'),
          currentAvgValue: currentAvgValue.toLocaleString('en-GB', { useGrouping: true, maximumFractionDigits: currentAvgValue > 1 ? 0 : 1 }),
          previousAvgValue: previousAvgValue.toLocaleString('en-GB', { useGrouping: true, maximumFractionDigits: previousAvgValue > 1 ? 0 : 1 }),
          delta: ((previousAvgValue - currentAvgValue) / previousAvgValue).toLocaleString('en-GB', { style: 'percent' })
        };
      })
    };
  }
};