import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {db, UsersCollectionName} from '@/configs/database/users';
import {db as ConfigDb, ConfigsCollectionName} from '@/configs/database/configs';
import {UserStatus} from '@/types/users';
import passwordService from '@/services/password-service';
import {loginSchema} from '@/validations/login-validation';
import {Op} from 'minivium';
import {AUTH_SESSION_MAX_AGE_IN_SECONDS} from '@/configs/auth';

const getConfigs = () => {
  const defaultConfig = {
    AUTH_SESSION_MAX_AGE_IN_SECONDS: AUTH_SESSION_MAX_AGE_IN_SECONDS
  };

  try {
    const configs = ConfigDb.query.select(ConfigsCollectionName, {
      where: {
        key: {
          [Op.in]: [
            'AUTH_SESSION_MAX_AGE_IN_SECONDS'
          ]
        }
      }
    });

    if (configs.length === 0) {
      // eslint-disable-next-line
      console.log(`[nextauth][getConfigs] No configs found. Using defaults.`);
      return defaultConfig;
    }

    const listOfConfigs = configs.reduce((acc, config) => {
      return { ...acc, [config.key]: config.value };
    }, {});

    return {
      ...listOfConfigs,
      AUTH_SESSION_MAX_AGE_IN_SECONDS: +listOfConfigs.AUTH_SESSION_MAX_AGE_IN_SECONDS
    };
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`[nextauth][getConfigs] Failed to fetch configs. Error: ${err.message}`);
    return defaultConfig;
  }
};

const config = getConfigs();

export const authOptions = {
  secret: process.env.AUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g. "Sign in with...")
      name: 'Credentials',

      // `credentials` is used to generate a form on the sign-in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true }
      },

      async authorize(credentials) {
        // Any object returned will be saved in `user` property of the JWT
        // If you return null then an error will be displayed advising the user to check their details.

        try {
          const parsedCredentials = loginSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            return null;
          }

          const users  = await db.query.selectAsync(UsersCollectionName, {
            where: { username: parsedCredentials.data.username, status: UserStatus.active }
          });

          if (users.length !== 1) {
            return null;
          }

          const {
            id,
            username,
            password,
            displayName,
            status,
            type,
            permissions,
            createdAt,
            updatedAt
          } = users[0];

          if (!passwordService.isValidPassword(parsedCredentials.data.password, password)) {
            return null;
          }

          return {
            id,
            username,
            displayName,
            status,
            type,
            permissions,
            createdAt,
            updatedAt
          };
        } catch (error) {
          // eslint-disable-next-line
          console.log('authorize error', error);
          return null;
        }
      }
    })

    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // Add user data to the token
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add token data to the session
      session.token = token;
      session.user = token.user;
      return session;
    }
  },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt' as any,

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: config.AUTH_SESSION_MAX_AGE_IN_SECONDS,

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60 // 24 hours

    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    // generateSessionToken: () => {}
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: config.AUTH_SESSION_MAX_AGE_IN_SECONDS // 15 min
  },
  pages: {
    signIn: '/auth/login'
  }
};

export default function nextAuth(req: any, res: any) {
  const host = req.headers.host || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  process.env.NEXTAUTH_URL = `http://${host}`; // Dynamically update the base URL
  return NextAuth(authOptions)(req, res);
};