import { Injectable, ProviderScope } from '@graphql-modules/di';
import { BigQuery } from '@google-cloud/bigquery';
import { omit, camelCase } from 'lodash';

import { PageSpeedReport } from '../../generated-types/graphql';
import { bigQueryConfig } from '../../config';


@Injectable({
  scope: ProviderScope.Session
})
export class BigQueryProvider {
  private bigQuery = new BigQuery(bigQueryConfig);

  async getPagespeed(id: string): Promise<PageSpeedReport[]> {
    const query = `
      SELECT * 
      FROM WolfgangAnalytics.PageSpeedInsights 
      WHERE client_id = "${id}"
      ORDER BY date`;
    const [res] = await this.bigQuery.query(query);

    return res.map(row => {
      return {
        id: row.client_id,
        date: row.date.value,
        ...Object.entries(omit(row, ['client_id', 'date'])).reduce((result, [key, value]) => {
          result[camelCase(key)] = value;
          return result;
        }, {}) as PageSpeedReport
      };
    });
  }
}