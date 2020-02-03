import { Injectable, ProviderScope } from '@graphql-modules/di';
import { google, analyticsreporting_v4 } from 'googleapis';
import { get } from 'lodash';

import { Report, Metric, DisplayFormat, SummaryMetric } from '../../generated-types/graphql';
import { googleCredentials } from '../../config';
import {
  generateAnalyticsRequestBody,
  generateAdWordsRequestBody,
  getChannelName,
  getMetricName,
  isColourInverted,
  GoogleAnalyticsRequestParams
} from './utils';

interface Credentials {
  accessToken: string
  refreshToken: string
}

export interface MetricTotal {
  name: string
  displayFormat: DisplayFormat
  current: number
  previous: number
  invertColours: boolean
}

@Injectable({
  scope: ProviderScope.Session
})
export class GoogleAnalyticsProvider {
  private authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

  // Gets data from Google Analytics based on preset metrics for each department
  async getGoogleAnalyticsReport(credentials: Credentials, requestParams: GoogleAnalyticsRequestParams) {
    // Need to instantiate new auth client for separate analytics gmails.
    this.authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

    const { accessToken, refreshToken } = credentials;

    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const requestBody = generateAnalyticsRequestBody(requestParams);

    const result = await google.analyticsreporting('v4').reports.batchGet({
      // @ts-ignore
      auth: this.authClient,
      requestBody: {
        reportRequests: [{
          ...requestBody
        }]
      }
    });

    const headers: analyticsreporting_v4.Schema$MetricHeaderEntry[] = get(result, 'data.reports[0].columnHeader.metricHeader.metricHeaderEntries', []);
    const data: analyticsreporting_v4.Schema$ReportRow[] = get(result, 'data.reports[0].data.rows', []);

    // Format the response data to match Metric schema
    const metrics = data.reduce((result: Metric[][], row) => {
      if (!row.metrics) return result;

      const values = row.metrics.map(metric => {
        if (!metric.values) return [];

        return metric.values.map((value, i) => {
          const name = getMetricName(headers[i].name as string);

          return {
            name,
            displayFormat: headers[i].type as DisplayFormat,
            value: parseFloat(value),
            invertColours: isColourInverted(name)
          };
        });
      });

      return result.concat(values);
    }, []);

    const report: Report = {
      source: 'Google Analytics',
      channel: getChannelName(requestParams.department),
      dateRanges: requestParams.dateRanges,
      data: metrics
    };

    return report;
  }

  async getGoogleAdsReport(credentials: Credentials, requestParams: Omit<GoogleAnalyticsRequestParams, 'department'>) {
    // Need to instantiate new auth client for separate analytics gmails.
    this.authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

    const { accessToken, refreshToken } = credentials;

    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const requestBody = generateAdWordsRequestBody(requestParams);

    const result = await google.analyticsreporting('v4').reports.batchGet({
      // @ts-ignore
      auth: this.authClient,
      requestBody: {
        reportRequests: [{
          ...requestBody
        }]
      }
    });

    const headers: analyticsreporting_v4.Schema$MetricHeaderEntry[] = get(result, 'data.reports[0].columnHeader.metricHeader.metricHeaderEntries', []);
    const data: analyticsreporting_v4.Schema$ReportRow[] = get(result, 'data.reports[0].data.rows', []);

    // Format the response data to match Metric schema
    const metrics = data.reduce((result: Metric[][], row) => {
      if (!row.metrics) return result;

      const values = row.metrics.map(metric => {
        if (!metric.values) return [];

        return metric.values.map((value, i) => {
          const name = getMetricName(headers[i].name as string);

          return {
            name,
            displayFormat: headers[i].type as DisplayFormat,
            value: parseFloat(value),
            invertColours: isColourInverted(name)
          };
        });
      });

      return result.concat(values);
    }, []);

    const report: Report = {
      source: 'Google Ads',
      channel: 'PPC',
      dateRanges: requestParams.dateRanges,
      data: metrics
    };

    return report;
  }

  async getGoogleAnalyticsDepartmentSummary(credentials: Credentials, requestParams: GoogleAnalyticsRequestParams) {
    // Need to instantiate new auth client for separate analytics gmails.
    this.authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

    const { accessToken, refreshToken } = credentials;

    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const requestBody = generateAnalyticsRequestBody(requestParams);

    const result = await google.analyticsreporting('v4').reports.batchGet({
      // @ts-ignore
      auth: this.authClient,
      requestBody: {
        reportRequests: [{
          ...requestBody
        }]
      }
    });

    const headers: analyticsreporting_v4.Schema$MetricHeaderEntry[] = get(result, 'data.reports[0].columnHeader.metricHeader.metricHeaderEntries', []);
    const data: analyticsreporting_v4.Schema$DateRangeValues[] = get(result, 'data.reports[0].data.rows[0].metrics', []);
    const currentValues: string[] = get(data, '[1].values', []);
    const previousValues: string[] = get(data, '[0].values', []);

    return currentValues.reduce((result: MetricTotal[], value, i) => {
      const name = getMetricName(headers[i].name as string);
      const previous = get(previousValues, `[${i}]`);

      // Skip if no comparison value. May change this to 0s
      if (!previous) return result;

      result.push({
        name,
        displayFormat: headers[i].type as DisplayFormat,
        current: parseFloat(value),
        previous: parseFloat(previous),
        invertColours: isColourInverted(name)
      });
      return result;
    }, []);
  }

  async getGoogleAdsDepartmentSummary(credentials: Credentials, requestParams: Omit<GoogleAnalyticsRequestParams, 'department'>) {
    // Need to instantiate new auth client for separate analytics gmails.
    this.authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

    const { accessToken, refreshToken } = credentials;

    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const requestBody = generateAdWordsRequestBody(requestParams);

    const result = await google.analyticsreporting('v4').reports.batchGet({
      // @ts-ignore
      auth: this.authClient,
      requestBody: {
        reportRequests: [{
          ...requestBody
        }]
      }
    });

    const headers: analyticsreporting_v4.Schema$MetricHeaderEntry[] = get(result, 'data.reports[0].columnHeader.metricHeader.metricHeaderEntries', []);
    const data: analyticsreporting_v4.Schema$DateRangeValues[] = get(result, 'data.reports[0].data.rows[0].metrics', []);
    const currentValues: string[] = get(data, '[1].values', []);
    const previousValues: string[] = get(data, '[0].values', []);

    return currentValues.reduce((result: MetricTotal[], value, i) => {
      const name = getMetricName(headers[i].name as string);
      const previous = get(previousValues, `[${i}]`);

      // Skip if no comparison value. May change this to 0s
      if (!previous) return result;

      result.push({
        name,
        displayFormat: headers[i].type as DisplayFormat,
        current: parseFloat(value),
        previous: parseFloat(previous),
        invertColours: isColourInverted(name)
      });
      return result;
    }, []);
  }
}