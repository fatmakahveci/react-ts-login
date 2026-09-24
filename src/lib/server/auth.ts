import { betterAuth } from 'better-auth';
import { getDatabase } from './database';
import { sendAccountEmail } from './email';

function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL) throw new Error('Authentication configuration is incomplete');
  if (process.env.NODE_ENV === 'production' && !baseURL.startsWith('https://') && process.env.ALLOW_LOCAL_HTTP !== 'true') {
    throw new Error('HTTPS is required in production');
  }
  return betterAuth({
    appName: 'Forma', secret, baseURL, database: getDatabase(),
    trustedOrigins: [new URL(baseURL).origin],
    emailAndPassword: {
      enabled: true, requireEmailVerification: true, minPasswordLength: 12, maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => sendAccountEmail(user.email, url, 'reset'),
    },
    emailVerification: {
      sendOnSignUp: true, sendOnSignIn: false, autoSignInAfterVerification: false, expiresIn: 3600,
      sendVerificationEmail: async ({ user, url }) => sendAccountEmail(user.email, url, 'verify'),
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, freshAge: 60 * 10 },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 60,
      customRules: { '/sign-in/email': { window: 60, max: 10 }, '/sign-up/email': { window: 60, max: 5 },
        '/request-password-reset': { window: 60, max: 5 }, '/send-verification-email': { window: 60, max: 5 } } },
    advanced: { useSecureCookies: baseURL.startsWith('https://') },
  });
}

let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return instance ??= createAuth(); }
