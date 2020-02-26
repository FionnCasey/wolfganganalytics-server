import 'reflect-metadata';

import { batchFunction } from '../provider';

describe('BigQuery', () => {
  it('should work', async () => {
    const data = await batchFunction();
    console.log(JSON.stringify(data, null, 2));
    expect(data).toBeTruthy();
  });
});