import { Injectable, ProviderScope } from '@graphql-modules/di';
import DataLoader from 'dataloader';
import { omit } from 'lodash';

import { Client, MutationCreateClientArgs } from '../../generated-types/graphql';

import ClientModel from './model';

const batchFunction = async (keys: any) => {
  return await ClientModel.find({ _id: { $in: keys } })
    .populate({ path: 'leads', model: 'User' })
    .populate({ path: 'team', model: 'User' });
};


@Injectable({
  scope: ProviderScope.Session
})
export class ClientProvider {
  private dataLoader = new DataLoader(batchFunction);

  async getClients() {
    const clients = await ClientModel.find({})
      .populate({ path: 'leads', model: 'User' })
      .populate({ path: 'team', model: 'User' });

    return clients.map(client => ({
      ...client.toJSON(),
      id: client._id,
      views: client.views.map(view => ({
        id: view.id,
        name: view.name,
        accountId: view.accountId,
        webPropertyId: view.webPropertyId,
        websiteUrl: view.websiteUrl,
        clientId: client.id
      }))
    }));
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.dataLoader.load(id);

    return {
      ...client.toJSON(),
      id: client._id,
      views: client.views.map(view => ({
        id: view.id,
        name: view.name,
        accountId: view.accountId,
        webPropertyId: view.webPropertyId,
        websiteUrl: view.websiteUrl,
        clientId: client.id
      }))
    };
  }

  async createClient(args: MutationCreateClientArgs & { accessToken: string, refreshToken: string }) {
    const { input, accessToken, refreshToken } = args;

    const client = await ClientModel.create({ ...omit(input, 'views'), accessToken, refreshToken });
    client.views = input.views.map(view => ({ ...view, clientId: client.id }));
    await client.save();
    
    return client;
  }
}