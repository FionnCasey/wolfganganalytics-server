import 'reflect-metadata';

import { AnalyticsAccountProvider } from '../provider';

const credentials = {
  accessToken: decodeURIComponent(process.env.TEST_ACCESS_TOKEN as string),
  refreshToken: decodeURIComponent(process.env.TEST_REFRESH_TOKEN as string)
};

const testAccount = {
  accountId: '1418971',
  webPropertyId: 'UA-1418971-22'
};

describe('Provider: Analytics Account', () => {
  const provider = new AnalyticsAccountProvider();

  it('API Request: getWebProperties', async () => {
    const result = await provider.getWebProperties(credentials);

    expect(result).toContainEqual({
      id: expect.any(String),
      name: expect.any(String),
      accountId: expect.any(String)
    });
  });

  it('API Request: getWebProperties', async () => {
    const result = await provider.getWebProperties(credentials);

    expect(result).toContainEqual({
      id: expect.any(String),
      name: expect.any(String),
      accountId: testAccount.accountId
    });
  });

  it('API Request: getViews', async () => {
    const result = await provider.getViews({
      ...credentials,
      ...testAccount
    });

    expect(result).toContainEqual({
      id: expect.any(String),
      name: expect.any(String),
      websiteUrl: expect.anything(),
      ...testAccount
    });
  });

  it('API Request: getGoals', async () => {
    const result = await provider.getGoals({
      ...credentials,
      ...testAccount,
      viewId: '104538413'
    });

    expect(result).toContainEqual({
      id: expect.any(String),
      name: expect.any(String),
      type: expect.any(String),
      url: expect.any(String)
    });
  });
});