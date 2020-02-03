import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Represents the visibility score at the start and end of a date range, as well the difference
  """
  type VisibilityScore {
    previous: String!
    current: String!
    delta: String!
  }

  type VisibilityScoreReport {
    dateRanges: [DateRange!]!
    desktopData: VisibilityScore!
    mobileData: VisibilityScore!
  }

  type Client {
    visibilityScoreReport(dateRange: DateRangeInput!): VisibilityScoreReport
  }

  type Query {
    visibilityScoreSummary(dateRange: DateRangeInput!): VisibilityScoreReport!
  }
`;

export default typeDefs;