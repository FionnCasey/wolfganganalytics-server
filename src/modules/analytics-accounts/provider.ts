import { Injectable, ProviderScope } from '@graphql-modules/di';
import DataLoader from 'dataloader';
import { google } from 'googleapis';
import { get } from 'lodash';

import { googleCredentials } from '../../config';
import AnalyticsAccount from './model';

interface Credentials {
  accountId: string
  webPropertyId: string
  viewId: string
  accessToken: string
  refreshToken: string
}

const batchFunction = async (keys: any) => await AnalyticsAccount.find({ _id: { $in: keys } });

@Injectable({
  scope: ProviderScope.Session
})
export class AnalyticsAccountProvider {
  private dataLoader = new DataLoader(batchFunction);
  private authClient = new google.auth.OAuth2(googleCredentials.clientID, googleCredentials.clientSecret);

  async getAnalyticsAccounts() {
    return await AnalyticsAccount.find({});
  }

  async getAnalyticsAccountById(id: string) {
    return await this.dataLoader.load(id);
  }

  async getAnalyticsAccountByEmail(email: string) {
    return await AnalyticsAccount.findOne({ email });
  }

  // Gets all web properties for every account associated with the given tokens
  async getWebProperties({ accessToken, refreshToken }: Pick<Credentials, 'accessToken' | 'refreshToken'>) {
    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const result = await google.analytics('v3').management.webproperties.list({
      auth: this.authClient,
      accountId: '~all'
    });

    if (result.status !== 200) {
      throw new Error(`Google Analytics API Error: ${result.statusText}`);
    }

    if (!result.data.items) {
      throw new Error('No results found');
    }

    // Filter invalid web properties and return formatted results
    return result.data.items
      .filter(({ id, name, accountId }) => !!id && !!name && !!accountId)
      .map(({ id, name, accountId }) => ({
        id: id as string,
        name: name as string,
        accountId: accountId as string
      }));
  }

  // Gets all views for the given web property
  async getViews({ accessToken, refreshToken, accountId, webPropertyId }: Omit<Credentials, 'viewId'>) {
    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    // Some views are throwing invalid credential errors despite being on the same account & using same tokens
    // Possibly permissions related?
    // TODO: Find out
    try {
      const result = await google.analytics('v3').management.profiles.list({
        auth: this.authClient,
        accountId,
        webPropertyId
      });

      if (result.status !== 200) {
        throw new Error(`Google Analytics API Error: ${result.statusText}`);
      }

      if (!result.data.items) {
        throw new Error('No results found');
      }

      // Filter invalid views and return formatted results
      return result.data.items
        .filter(({ id, name }) => !!id && !!name)
        .map(({ id, name, websiteUrl }) => ({
          id: id as string,
          name: name as string,
          websiteUrl,
          accountId,
          webPropertyId
        }));
    } catch (e) {
      // Return empty array on error for now
      return [];
    }
  }

  // Gets all active goals for the given view
  async getGoals({ accessToken, refreshToken, ...credentials }: Credentials) {
    // Set Google auth tokens
    this.authClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const result = await google.analytics('v3').management.goals.list({
      auth: this.authClient,
      ...credentials,
      profileId: credentials.viewId
    });

    if (result.status !== 200) {
      throw new Error(`Google Analytics API Error: ${result.statusText}`);
    }

    if (!result.data.items) {
      throw new Error('No results found');
    }

    // Filter goals invalid goals and goals that aren't active
    return result.data.items
      .filter(({ id, name, type, active }) => (!!id && !!name && !!type) || !active)
      .map(goal => ({
        id: goal.id as string,
        name: goal.name as string,
        type: goal.type as string,
        url: get(goal, 'urlDestinationDetails.url', '') as string
      }));
  }
}