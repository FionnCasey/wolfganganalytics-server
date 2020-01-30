import { AuthenticationError } from 'apollo-server-core';
import { ModuleContext } from '@graphql-modules/core';
import { get } from 'lodash';

import { Permission } from '../../generated-types/graphql';
import { IS_DEVELOPMENT_MODE } from '../../config';
import { UserDocument } from '../users/model';

type GraphQLMiddlewareFn<T = undefined> = (
  skip?: boolean,
  additionalArgs?: T
) => (
    next: (root: any, args: any, ctx: any, info: any) => void
  ) => (
      root: any,
      args: any,
      ctx: ModuleContext & { user?: UserDocument },
      info: any
    ) => void;

// Checks if there is a current user
export const isAuthorised: GraphQLMiddlewareFn = (skip = IS_DEVELOPMENT_MODE) => next => async (root, args, ctx, info) => {
  if (skip) return next(root, args, ctx, info);

  const user = get(ctx, 'req.user');

  if (!user) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return next(root, args, ctx, info);
};

// Checks if the current user has the required permission for a resolver function
export const hasPermission: GraphQLMiddlewareFn<Permission> = (skip = IS_DEVELOPMENT_MODE, permission) => next => async (root, args, ctx, info) => {
  if (skip) return next(root, args, ctx, info);

  const permissions: Permission[] = get(ctx, 'req.user.permissions', []);

  if (permission && !permissions.includes(permission)) {
    throw new AuthenticationError('You do not have permission to perform this action');
  }
  return next(root, args, ctx, info);
};