import { Document, Schema, model } from 'mongoose';

import { User } from '../../generated-types/graphql';

export type UserDocument = Document & User;

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: String,
  department: String,
  permissions: { type: [String], default: [] },
});

export default model<UserDocument>('User', schema);