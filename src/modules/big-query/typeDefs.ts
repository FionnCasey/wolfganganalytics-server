import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Represents extended client type that contains data from BigQuery
  """
  type Client {
    pagespeed: [PageSpeedReport!]
  }

  """
  Returns a page report for the stored client website
  """
  type PageSpeedReport {
    id: ID!
    date: String!
    url: String!
    device: String!
    firstContentfulPaint: Float!
    speedIndex: Float!
    timeToInteractive: Float!
    firstMeaningfulPaint: Float!
    firstCpuIdle: Float!
    estimatedInputLatency: Float!
  }
`;

export default typeDefs;