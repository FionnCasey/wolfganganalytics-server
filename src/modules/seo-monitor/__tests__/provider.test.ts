import 'reflect-metadata';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import { SEOMonitorProvider } from '../provider';

const testAccount = {
  id: '49833'
};

describe('Provider: SEO Monitor', () => {
  const provider = new SEOMonitorProvider();

  const dates = {
    startDate: '2019-12-01',
    endDate: '2019-12-31'
  };

  it('Request: getVisibilityScore', async () => {
    const result = await provider.getVisbilityScore({
      accountId: testAccount.id,
      dates,
      apiKey: process.env.SEO_MONITOR_KEY
    });

    expect(result).toMatchObject({
      desktop: {
        current: expect.any(Number),
        previous: expect.any(Number),
        delta: expect.any(Number)
      },
      mobile: {
        current: expect.any(Number),
        previous: expect.any(Number),
        delta: expect.any(Number)
      }
    });
  });
});