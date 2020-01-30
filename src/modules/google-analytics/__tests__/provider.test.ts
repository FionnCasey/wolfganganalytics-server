import 'reflect-metadata';

import { Department } from '../../../generated-types/graphql';
import { GoogleAnalyticsProvider } from '../provider';

const credentials = {
  accessToken: decodeURIComponent(process.env.TEST_ACCESS_TOKEN as string),
  refreshToken: decodeURIComponent(process.env.TEST_REFRESH_TOKEN as string)
};

const requestParams = {
  viewId: '104538413',
  dateRanges: [
    {
      startDate: '2019-11-01',
      endDate: '2019-11-30',
    },
    {
      startDate: '2019-12-01',
      endDate: '2019-12-31',
    }
  ],
  department: Department.Search_Engine_Optimization
};

describe('Provider: Google Analytics API', () => {
  const provider = new GoogleAnalyticsProvider();

  it('Request: getGoogleAnalyticsReport', async () => {
    const result = await provider.getGoogleAnalyticsReport(credentials, requestParams);

    expect(result).toMatchObject({
      dateRanges: expect.objectContaining(requestParams.dateRanges),
      source: 'Google Analytics',
      channel: 'Organic',
      data: expect.any(Array)
    });

    expect(result.data).toContainEqual(
      expect.arrayContaining([{
        name: expect.any(String),
        displayFormat: expect.any(String),
        value: expect.any(Number),
        invertColours: expect.any(Boolean)
      }])
    );
  });
});