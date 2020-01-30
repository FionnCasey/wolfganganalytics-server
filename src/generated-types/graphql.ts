type Maybe<T> = T | null;
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type AnalyticsAccount = {
  id: Scalars['ID'],
  email: Scalars['String'],
  accessToken: Scalars['String'],
  refreshToken: Scalars['String'],
  webProperties?: Maybe<Array<WebProperty>>,
};

export type Client = {
  id: Scalars['ID'],
  name: Scalars['String'],
  services?: Maybe<Array<Department>>,
  tier: Scalars['Int'],
  industry: Scalars['String'],
  leads?: Maybe<Array<User>>,
  team?: Maybe<Array<User>>,
  gaAccount: Scalars['String'],
  accessToken: Scalars['String'],
  refreshToken: Scalars['String'],
  facebookAdsId?: Maybe<Scalars['String']>,
  seoMonitorId?: Maybe<Scalars['String']>,
  views: Array<View>,
  primaryViewId: Scalars['String'],
};

export type ClientInput = {
  name: Scalars['String'],
  services?: Maybe<Array<Department>>,
  tier: Scalars['Int'],
  industry: Scalars['String'],
  leads?: Maybe<Array<Scalars['String']>>,
  team?: Maybe<Array<Scalars['String']>>,
  gaAccount: Scalars['String'],
  facebookAdsId?: Maybe<Scalars['String']>,
  seoMonitorId?: Maybe<Scalars['String']>,
  views: Array<ViewInput>,
  primaryViewId: Scalars['String'],
};

export type DateRange = {
  startDate: Scalars['String'],
  endDate: Scalars['String'],
};

export type DateRangeInput = {
  startDate: Scalars['String'],
  endDate: Scalars['String'],
};

export enum Department {
  Search_Engine_Optimization = 'SEARCH_ENGINE_OPTIMIZATION',
  Paid_Search = 'PAID_SEARCH',
  Paid_Social = 'PAID_SOCIAL',
  Conversion_Rate_Optimiation = 'CONVERSION_RATE_OPTIMIATION',
  Web_Development = 'WEB_DEVELOPMENT',
  Content = 'CONTENT',
  Creative = 'CREATIVE'
}

export enum DisplayFormat {
  Integer = 'INTEGER',
  Float = 'FLOAT',
  Percent = 'PERCENT',
  Currency = 'CURRENCY'
}

export type Goal = {
  id: Scalars['ID'],
  name: Scalars['String'],
  type: Scalars['String'],
  url?: Maybe<Scalars['String']>,
};

export type Metric = {
  name: Scalars['String'],
  displayFormat: DisplayFormat,
  value: Scalars['Float'],
  invertColours: Scalars['Boolean'],
};

export type Mutation = {
  createClient?: Maybe<Client>,
};


export type MutationCreateClientArgs = {
  input: ClientInput
};

export enum Permission {
  View_User_Performance = 'VIEW_USER_PERFORMANCE',
  Update_Users = 'UPDATE_USERS',
  Delete_Users = 'DELETE_USERS',
  Create_Clients = 'CREATE_CLIENTS',
  Update_Clients = 'UPDATE_CLIENTS',
  Delete_Clients = 'DELETE_CLIENTS'
}

export type Query = {
  currentUser?: Maybe<User>,
  users: Array<User>,
  user?: Maybe<User>,
  clients: Array<Client>,
  client?: Maybe<Client>,
  analyticsAccounts: Array<AnalyticsAccount>,
  analyticsAccount?: Maybe<AnalyticsAccount>,
};


export type QueryUserArgs = {
  id: Scalars['ID']
};


export type QueryClientArgs = {
  id: Scalars['ID']
};


export type QueryAnalyticsAccountArgs = {
  id: Scalars['ID']
};

export type Report = {
  dateRanges: Array<DateRange>,
  source: Scalars['String'],
  channel: Scalars['String'],
  data?: Maybe<Array<Maybe<Array<Metric>>>>,
};

export type User = {
  id: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  profilePicture?: Maybe<Scalars['String']>,
  permissions?: Maybe<Array<Permission>>,
  department?: Maybe<Department>,
};

export type View = {
  googleAnalyticsReport?: Maybe<Report>,
  googleAdsReport?: Maybe<Report>,
  id: Scalars['ID'],
  name: Scalars['String'],
  accountId: Scalars['String'],
  webPropertyId: Scalars['String'],
  websiteUrl?: Maybe<Scalars['String']>,
  goals?: Maybe<Array<Goal>>,
};


export type ViewGoogleAnalyticsReportArgs = {
  dateRanges: Array<DateRangeInput>,
  department: Department
};


export type ViewGoogleAdsReportArgs = {
  dateRanges: Array<DateRangeInput>
};

export type ViewInput = {
  id: Scalars['ID'],
  name: Scalars['String'],
  accountId: Scalars['String'],
  webPropertyId: Scalars['String'],
  websiteUrl?: Maybe<Scalars['String']>,
};

export type WebProperty = {
  id: Scalars['ID'],
  name: Scalars['String'],
  accountId: Scalars['String'],
  views?: Maybe<Array<View>>,
};

import { ModuleContext } from '@graphql-modules/core';

import { GraphQLResolveInfo } from 'graphql';

export type ArrayOrIterable<T> = Array<T> | Iterable<T>;



export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface ISubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export type AnalyticsAccountResolvers<Context = ModuleContext, ParentType = AnalyticsAccount> = {
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  email?: Resolver<Scalars['String'], ParentType, Context>,
  accessToken?: Resolver<Scalars['String'], ParentType, Context>,
  refreshToken?: Resolver<Scalars['String'], ParentType, Context>,
  webProperties?: Resolver<Maybe<ArrayOrIterable<WebProperty>>, ParentType, Context>,
};

export type ClientResolvers<Context = ModuleContext, ParentType = Client> = {
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  services?: Resolver<Maybe<ArrayOrIterable<Department>>, ParentType, Context>,
  tier?: Resolver<Scalars['Int'], ParentType, Context>,
  industry?: Resolver<Scalars['String'], ParentType, Context>,
  leads?: Resolver<Maybe<ArrayOrIterable<User>>, ParentType, Context>,
  team?: Resolver<Maybe<ArrayOrIterable<User>>, ParentType, Context>,
  gaAccount?: Resolver<Scalars['String'], ParentType, Context>,
  accessToken?: Resolver<Scalars['String'], ParentType, Context>,
  refreshToken?: Resolver<Scalars['String'], ParentType, Context>,
  facebookAdsId?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
  seoMonitorId?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
  views?: Resolver<ArrayOrIterable<View>, ParentType, Context>,
  primaryViewId?: Resolver<Scalars['String'], ParentType, Context>,
};

export type DateRangeResolvers<Context = ModuleContext, ParentType = DateRange> = {
  startDate?: Resolver<Scalars['String'], ParentType, Context>,
  endDate?: Resolver<Scalars['String'], ParentType, Context>,
};

export type GoalResolvers<Context = ModuleContext, ParentType = Goal> = {
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  type?: Resolver<Scalars['String'], ParentType, Context>,
  url?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
};

export type MetricResolvers<Context = ModuleContext, ParentType = Metric> = {
  name?: Resolver<Scalars['String'], ParentType, Context>,
  displayFormat?: Resolver<DisplayFormat, ParentType, Context>,
  value?: Resolver<Scalars['Float'], ParentType, Context>,
  invertColours?: Resolver<Scalars['Boolean'], ParentType, Context>,
};

export type MutationResolvers<Context = ModuleContext, ParentType = Mutation> = {
  createClient?: Resolver<Maybe<Client>, ParentType, Context, MutationCreateClientArgs>,
};

export type QueryResolvers<Context = ModuleContext, ParentType = Query> = {
  currentUser?: Resolver<Maybe<User>, ParentType, Context>,
  users?: Resolver<ArrayOrIterable<User>, ParentType, Context>,
  user?: Resolver<Maybe<User>, ParentType, Context, QueryUserArgs>,
  clients?: Resolver<ArrayOrIterable<Client>, ParentType, Context>,
  client?: Resolver<Maybe<Client>, ParentType, Context, QueryClientArgs>,
  analyticsAccounts?: Resolver<ArrayOrIterable<AnalyticsAccount>, ParentType, Context>,
  analyticsAccount?: Resolver<Maybe<AnalyticsAccount>, ParentType, Context, QueryAnalyticsAccountArgs>,
};

export type ReportResolvers<Context = ModuleContext, ParentType = Report> = {
  dateRanges?: Resolver<ArrayOrIterable<DateRange>, ParentType, Context>,
  source?: Resolver<Scalars['String'], ParentType, Context>,
  channel?: Resolver<Scalars['String'], ParentType, Context>,
  data?: Resolver<Maybe<ArrayOrIterable<Maybe<ArrayOrIterable<Metric>>>>, ParentType, Context>,
};

export type UserResolvers<Context = ModuleContext, ParentType = User> = {
  id?: Resolver<Scalars['String'], ParentType, Context>,
  firstName?: Resolver<Scalars['String'], ParentType, Context>,
  lastName?: Resolver<Scalars['String'], ParentType, Context>,
  email?: Resolver<Scalars['String'], ParentType, Context>,
  profilePicture?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
  permissions?: Resolver<Maybe<ArrayOrIterable<Permission>>, ParentType, Context>,
  department?: Resolver<Maybe<Department>, ParentType, Context>,
};

export type ViewResolvers<Context = ModuleContext, ParentType = View> = {
  googleAnalyticsReport?: Resolver<Maybe<Report>, ParentType, Context, ViewGoogleAnalyticsReportArgs>,
  googleAdsReport?: Resolver<Maybe<Report>, ParentType, Context, ViewGoogleAdsReportArgs>,
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  accountId?: Resolver<Scalars['String'], ParentType, Context>,
  webPropertyId?: Resolver<Scalars['String'], ParentType, Context>,
  websiteUrl?: Resolver<Maybe<Scalars['String']>, ParentType, Context>,
  goals?: Resolver<Maybe<ArrayOrIterable<Goal>>, ParentType, Context>,
};

export type WebPropertyResolvers<Context = ModuleContext, ParentType = WebProperty> = {
  id?: Resolver<Scalars['ID'], ParentType, Context>,
  name?: Resolver<Scalars['String'], ParentType, Context>,
  accountId?: Resolver<Scalars['String'], ParentType, Context>,
  views?: Resolver<Maybe<ArrayOrIterable<View>>, ParentType, Context>,
};

export type IResolvers<Context = ModuleContext> = {
  AnalyticsAccount?: AnalyticsAccountResolvers<Context>,
  Client?: ClientResolvers<Context>,
  DateRange?: DateRangeResolvers<Context>,
  Goal?: GoalResolvers<Context>,
  Metric?: MetricResolvers<Context>,
  Mutation?: MutationResolvers<Context>,
  Query?: QueryResolvers<Context>,
  Report?: ReportResolvers<Context>,
  User?: UserResolvers<Context>,
  View?: ViewResolvers<Context>,
  WebProperty?: WebPropertyResolvers<Context>,
};

export type IDirectiveResolvers<Context = ModuleContext> = {};
