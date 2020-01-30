import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Represents extended view type that contains analytics reports
  """
  type View {
    """
    Returns preset metrics from Google Analytics for the given date range / department
    """
    googleAnalyticsReport(
      dateRanges: [DateRangeInput!]!
      department: Department!
    ): Report
    
    """
    Returns preset AdWords metrics from Google Analytics for the given date range
    """
    googleAdsReport(
      dateRanges: [DateRangeInput!]!
    ): Report
  }

  """
  Input type for 'View'
  """
  input ViewInput {
    id: ID!
    name: String!
    accountId: String!
    webPropertyId: String!
    websiteUrl: String
  }
`;

export default typeDefs;