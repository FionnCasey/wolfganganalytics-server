import { Injectable, ProviderScope } from '@graphql-modules/di';
import fetch from 'node-fetch';

import { DateRange } from '../../generated-types/graphql';

interface SEOMonitorArgs {
  accountId: string
  dates: DateRange
  keywordGroupId?: string
  apiKey?: string
}

@Injectable({
  scope: ProviderScope.Session
})
export class SEOMonitorProvider {
  private baseUrl = 'https://api.seomonitor.com/v1';

  async getVisbilityScore({ accountId, dates, apiKey, keywordGroupId = '0' }: SEOMonitorArgs) {
    const url = `${this.baseUrl}/visibility_score_data/${accountId}/${keywordGroupId}/${dates.startDate}/${dates.endDate}`;

    const headers = { Authorization: decodeURIComponent(apiKey || process.env.SEO_MONITOR_KEY as string) };

    const data = await Promise.all([
      fetch(`${url}?device=1`, { headers }).then(res => res.json()),
      fetch(`${url}?device=2`, { headers }).then(res => res.json()),
    ]);

    const desktopPrevious = parseFloat(data[0][0].vscore) / 100;
    const desktopCurrent = parseFloat(data[0][data[0].length - 1].vscore) / 100;
    const mobilePrevious = parseFloat(data[1][0].vscore) / 100;
    const mobileCurrent = parseFloat(data[1][data[1].length - 1].vscore) / 100;

    return {
      desktop: {
        previous: desktopPrevious,
        current: desktopCurrent,
        delta: desktopPrevious - desktopCurrent
      },
      mobile: {
        previous: mobilePrevious,
        current: mobileCurrent,
        delta: mobilePrevious - mobileCurrent
      }
    };
  }
}  