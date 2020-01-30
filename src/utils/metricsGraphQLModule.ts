import { GraphQLModule } from '@graphql-modules/core';
import { gql } from 'apollo-server-express';

// Defines common types for returning normalised data from different API data sources
const metricsModule = new GraphQLModule({
  typeDefs: gql`
    """
    Defines display format for numeric values
    """
    enum DisplayFormat {
      INTEGER
      FLOAT
      PERCENT
      CURRENCY
    }

    """
    Represents a single numerical data point from an analytics source
    """
    type Metric {
      """
      This metric's name
      """
      name: String!

      """
      This metric's display format
      """
      displayFormat: DisplayFormat!

      """
      The raw numerical value
      """
      value: Float!

      """
      If true, negative values for this metric are an improvement and should be displayed accordingly
      """
      invertColours: Boolean!
    }

    """
    Represents a range of dates
    """
    type DateRange {
      """
      The first date in this range
      """
      startDate: String!

      """
      The last date in this range
      """
      endDate: String!
    }

    """
    Input type for DateRange
    """
    input DateRangeInput {
      """
      The first date in this range
      """
      startDate: String!

      """
      The last date in this range
      """
      endDate: String!
    }

    """
    Represents a list of metrics from an analytics source within a certain date range
    """
    type Report {
      """
      The date ranges for this report. Max 2
      """
      dateRanges: [DateRange!]!

      """
      The analytics platform these results come from
      """
      source: String!

      """
      Channel name, e.g. Organic, PPC
      """
      channel: String!

      """
      Metric data for this request
      """
      data: [[Metric!]]
    }
  `
});

export default metricsModule;