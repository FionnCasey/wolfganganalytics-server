import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Respresents a Wolfgang Digital analytics account
  """
  type AnalyticsAccount {
    """
    The ID for this account
    """
    id: ID!
    
    """
    The @wolfgangdigital.com email for this account
    """
    email: String!

    """
    The Google Analytics access token for this account
    """
    accessToken: String!

    """
    The Google Analytics refresh token for this account 
    """
    refreshToken: String!

    """
    The web properties for all accounts associated with this Wolfgang Analytics account
    """
    webProperties: [WebProperty!]
  }

  """
  Respresents a single web property in Google Analytics
  """
  type WebProperty {
    """
    The ID for this web property
    """
    id: ID!

    """
    This web property's name in Google Analytics
    """
    name: String!

    """
    The account ID for the Google Analytics account that this web property is part of 
    """
    accountId: String!

    """
    The Google Analytics views associated with this web proprty
    """
    views: [View!]
  }

  """
  Represents a single view in Google Analytics
  """
  type View {
    """
    The ID for this view
    """
    id: ID!

    """
    This view's name in Google Analytics
    """
    name: String!

    """
    The account ID for the Google Analytics account that this view is part of
    """
    accountId: String!

    """
    The ID for the web property associated with this view
    """
    webPropertyId: String!

    """
    The URL associated with this view
    """
    websiteUrl: String

    """
    The active Google Analytics goals for this view
    """
    goals: [Goal!]
  }

  """
  Represents a Google Analytics goal
  """
  type Goal {
    """
    The goal number for this goal in Google Analytics
    """
    id: ID!

    """
    The name for this goal in Google Analytics
    """
    name: String!

    """
    The goal type for this goal
    """
    type: String!

    """
    The destination URL for this goal
    """
    url: String
  }

  type Query {
    """
    Returns all analytics accounts
    """
    analyticsAccounts: [AnalyticsAccount!]!

    """
    Returns an analytics account by ID
    """
    analyticsAccount(
      id: ID!
    ): AnalyticsAccount
  }
`;

export default typeDefs;