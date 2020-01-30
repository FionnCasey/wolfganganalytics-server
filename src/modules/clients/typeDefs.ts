import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Represents a Wolfgang Digital client
  """
  type Client {
    """
    The client's MongoDB ID
    """
    id: ID!
    
    """
    The client's company name
    """
    name: String!

    """
    The departments working on this client
    """
    services: [Department!]

    """
    The pricing tier this client is on - from 1 to 4, with 4 being the lowest tier
    """
    tier: Int!

    """
    The business industry for this client
    """
    industry: String!

    """
    The users assigned as leads to this client
    """
    leads: [User!]

    """
    The other users assigned to this client
    """
    team: [User!]

    """
    The Google Analytics account for this client
    """
    gaAccount: String!

    """
    The Google access token for this client's analytics account
    """
    accessToken: String!

    """
    The Google refresh token for this client's analytics account
    """
    refreshToken: String!

    """
    The client's ID in Facebook Ads
    """
    facebookAdsId: String

    """
    The client's ID in SEO Monitor
    """
    seoMonitorId: String

    """
    The Google Analytics views used by this client
    """
    views: [View!]!

    """
    The ID of the primary view to show for this client
    """
    primaryViewId: String!
  }

  """
  Input type for 'Client'
  """
  input ClientInput {    
    """
    The client's company name
    """
    name: String!

    """
    The departments working on this client
    """
    services: [Department!]

    """
    The pricing tier this client is on - from 1 to 4, with 4 being the lowest tier
    """
    tier: Int!

    """
    The business industry for this client
    """
    industry: String!

    """
    The users assigned as leads to this client
    """
    leads: [String!]

    """
    The other users assigned to this client
    """
    team: [String!]

    """
    The Google Analytics account for this client
    """
    gaAccount: String!

    """
    The client's ID in Facebook Ads
    """
    facebookAdsId: String

    """
    The client's ID in SEO Monitor
    """
    seoMonitorId: String

    """
    The Google Analytics views used by this client
    """
    views: [ViewInput!]!

    """
    The ID of the primary view to show for this client
    """
    primaryViewId: String!
  }

  type Query {
    """
    Returns all clients
    """
    clients: [Client!]!

    """
    Returns a client by client ID
    """
    client(
      id: ID!
    ): Client
  }

  type Mutation {
    createClient(input: ClientInput!): Client
  }
`;

export default typeDefs;