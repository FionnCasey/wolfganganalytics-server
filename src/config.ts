if (process.env.NODE_ENV !== 'production') require('dotenv').config();

export const IS_DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

export const PORT = process.env.PORT || 8000;

export const HOST = IS_DEVELOPMENT_MODE ? `http://localhost:${PORT}` : 'https://analytics.wolfgangdigital.com';

export const googleCredentials = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: decodeURIComponent(process.env.GOOGLE_CLIENT_SECRET as string)
};

export const googleUserScopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

export const googleAnalyticsScopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/analytics.readonly'
];

export const bigQueryConfig = {
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
    private_key: decodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY as string)
  },
  projectId: 'project-id-4791371014168354215',
  scopes: [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/bigquery.insertdata'
  ]
};

export const passportUserConfig = {
  ...googleCredentials,
  callbackURL: `${HOST}/auth/user/redirect`,
  passReqToCallback: false
};

export const passportAnalyticsAccountConfig = {
  ...googleCredentials,
  callbackURL: `${HOST}/auth/analytics-account/redirect`,
  passReqToCallback: false
};

export const mongoDbConfig = {
  uri: process.env.MONGODB_URI as string, 
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
};

export const sessionConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 5,
  keys: [process.env.SESSION_SECRET as string]
};