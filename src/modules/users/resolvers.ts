import { QueryResolvers } from '../../generated-types/graphql';
import { UserProvider } from './provider';

export const Query: QueryResolvers = {
  // Returns the currently logged in user
  currentUser: (root, args, ctx) => ctx.req.user,

  // Returns all users
  // TODO: Add criteria
  users: async (root, args, ctx) => await ctx.injector.get(UserProvider).getUsers(),

  // Returns a user with the given ID or undefined
  user: async (root, args, ctx) => await ctx.injector.get(UserProvider).getUserById(args.id)
};