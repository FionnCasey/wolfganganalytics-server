import { Injectable, ProviderScope } from '@graphql-modules/di';
import DataLoader from 'dataloader';

import User from './model';

const batchFunction = async (keys: any) => await User.find({ _id: { $in: keys } });

@Injectable({
  scope: ProviderScope.Session
})
export class UserProvider {
  private dataLoader = new DataLoader(batchFunction);

  async getUsers() {
    return await User.find({});
  }

  async getUserById(id: string) {
    return await this.dataLoader.load(id);
  }
}
