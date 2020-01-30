import { get, startCase } from 'lodash';

import { Department } from '../../generated-types/graphql';

// Preset metrics for Google Analytics
const googleAnalyticsMetrics = [
  'ga:sessions',
  'ga:transactions',
  'ga:transactionsPerSession'
];

const googleAdsMetrics = [
  'ga:adClicks',
  'ga:impressions',
  'ga:CTR',
  'ga:CPC',
  'ga:adCost',
  'ga:transactions * ga:revenuePerTransaction',
  'ga:costPerConversion',
  'ga:ROAS'
];

// Preset filters for each department in Google Analytics
const filters: { [key in Department]: string[] } = {
  SEARCH_ENGINE_OPTIMIZATION: ['ga:sourceMedium=@organic'],
  PAID_SEARCH: ['ga:sourceMedium=@cpc'],
  PAID_SOCIAL: ['ga:sourceMedium=@facebook / social',
    'ga:sourceMedium=@social / facebook',
    'ga:sourceMedium=@instagram / social',
    'ga:sourceMedium=@instagram / cpc',
    'ga:sourceMedium=@social / instagram',
    'ga:sourceMedium=@paidsocial / facebook',
    'ga:sourceMedium=@facebook / facebook',
    'ga:sourceMedium=@facebook1 / paidsocial'],
  CONTENT: [''],
  CONVERSION_RATE_OPTIMIATION: [''],
  WEB_DEVELOPMENT: [''],
  CREATIVE: ['']
};

export interface GoogleAnalyticsRequestParams {
  viewId: string
  dateRanges: {
    startDate: string
    endDate: string
  }[]
  department: Department
}

// Generates the approriate googleapis request body for Google Analytics
export const generateAnalyticsRequestBody = ({ viewId, dateRanges, department }: GoogleAnalyticsRequestParams) => {
  return {
    viewId,
    dateRanges,
    metrics: googleAnalyticsMetrics.map(expression => ({ expression })),
    filtersExpression: filters[department].join(',')
  };
};

// Generates the approriate googleapis request body for Google Ads
export const generateAdWordsRequestBody = ({ viewId, dateRanges }: Omit<GoogleAnalyticsRequestParams, 'department'>) => {
  return {
    viewId,
    dateRanges,
    metrics: googleAdsMetrics.map(expression => ({ expression })),
    filtersExpression: filters.PAID_SEARCH.join(',')
  };
};

const channels = {
  SEARCH_ENGINE_OPTIMIZATION: 'Organic',
  PAID_SEARCH: 'PPC',
  PAID_SOCIAL: 'Social'
};

export const getChannelName = (department: Department) => get(channels, department, 'All Channels');

// TODO: Make this handle more cases
export const isColourInverted = (metric: string) => metric.toLowerCase().includes('cost');

export const getMetricName = (str: string) => {
  const name = str.replace(/ga:/g, '');
  return ['CPC', 'CTR', 'ROAS'].includes(name)
    ? name
    : name === 'transactions * revenuePerTransaction'
      ? 'Transaction Revenue'
      : startCase(name).replace('Per', '/');
};