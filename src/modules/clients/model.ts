import { Document, Schema, SchemaTypes, model } from 'mongoose';

import { Client } from '../../generated-types/graphql';

export type ClientDocument = Document & Client;

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  services: { type: [String], default: [] },
  tier: { type: Number, required: true },
  leads: { type: [SchemaTypes.ObjectId], ref: 'User', default: [] },
  team: { type: [SchemaTypes.ObjectId], ref: 'User', default: [] },
  gaAccount: { type: String, required: true },
  industry: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  facebookAdsId: String,
  seoMonitorId: String,
  views: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    accountId: { type: String, required: true },
    webPropertyId: { type: String, required: true },
    websiteUrl: String,
    clientId: { type: String, required: true }
  }],
  primaryViewId: { type: String, required: true },
  pagespeedUrls: { type: [String], default: [] }
});

export default model<ClientDocument>('Client', schema);