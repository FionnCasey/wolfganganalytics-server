import { gql } from 'apollo-server-express';

const typeDefs = gql`
  """
  Defines read/write access privileges for users
  """
  enum Permission {
    VIEW_USER_PERFORMANCE
    UPDATE_USERS
    DELETE_USERS
    CREATE_CLIENTS
    UPDATE_CLIENTS
    DELETE_CLIENTS
  }

  """
  Defines Wolfgang Digital departments
  """
  enum Department {
    SEARCH_ENGINE_OPTIMIZATION,
    PAID_SEARCH,
    PAID_SOCIAL,
    CONVERSION_RATE_OPTIMIATION,
    WEB_DEVELOPMENT,
    CONTENT,
    CREATIVE
  }

  """
  Represents a Wolfgang Digital employee
  """
  type User {
    """
    The MongoDB ID of this user
    """
    id: String!

    """
    This user's first name - provided by Google account
    """
    firstName: String!
    
    """
    This user's last name - provided by Google account
    """
    lastName: String!

    """
    The @wolfgangdigital.com email for this user
    """
    email: String!

    """
    This user's profile picture - provided by Google account
    """
    profilePicture: String

    """
    This user's read/write permissions
    """
    permissions: [Permission!]

    """
    This user's department
    """
    department: Department
  }

  type Query {
    """
    Returns the currently logged in user
    """
    currentUser: User

    """
    Returns all users
    """
    users: [User!]!

    """
    Returns a user by user ID
    """
    user(
      id: ID!
    ): User
  }
`;

export default typeDefs;