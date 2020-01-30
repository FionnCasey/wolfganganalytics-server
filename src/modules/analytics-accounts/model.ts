import { Document, Schema, model } from 'mongoose';

import { AnalyticsAccount } from '../../generated-types/graphql';

export type AnalyticsAccountDocument = Document & AnalyticsAccount;

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }
});

export default model<AnalyticsAccountDocument>('AnalyticsAccount', schema);