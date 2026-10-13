# NMAI login and Google setup

The local preview uses `http://127.0.0.1:3000`. The login page is `/login` and the administrator page is `/admin`.

## Current behavior

- Unknown email/password combinations return “Details not found”. Passwords here are NMAI account passwords, never Gmail passwords.
- Signup creates an account with a salted password hash and immediately opens the portal with zero courses assigned. The internal pending status means no course approval yet; it does not block portal access.
- The first screen shows Sign up with Gmail. Only this action creates a new account after Google verification and opens the portal with all courses locked. Existing accounts are directed to Login with Gmail; trying to log in with an unknown Gmail account never creates an account.
- In Admin → Courses → Course Management, add/edit/delete course catalog entries and change availability. Under Student Course Access (also available in Students), select courses and Save course access. New students have no assignments. Updates persist on the local server and refresh in open student portals within 30 seconds or on focus.
- Suspend access revokes existing server sessions. Open portal tabs recheck within 30 seconds or when focused.
- Existing browser-only demo accounts and old localStorage sessions do not grant access. Legacy records remain visible in a collapsed section for reference.
- The previous default admin key was moved into `.env.local` for this local setup. It is no longer checked or shipped by frontend code. Alternate fallback keys no longer work. Change `NMAI_ADMIN_PASSKEY` before public deployment since the original key appeared in earlier source code.

## Connect Google

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or choose your project.
2. Open Google Auth Platform. Configure Branding (app name NMAI and support email), Audience, and contact information. When using External / Testing, add your own Gmail address and your initial testers as test users.
3. Under Clients, create an OAuth client with application type **Web application**.
4. Add this exact authorized redirect URI:

   `http://127.0.0.1:3000/api/auth/google/callback`

5. Put the client values in `.env.local`:

   ```dotenv
   NMAI_BASE_URL=http://127.0.0.1:3000
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

   Keep the existing `NMAI_ADMIN_PASSKEY` entry. Do not share this file or paste secrets into chat.

6. Restart the development server with `npm run dev -- --hostname 127.0.0.1 --webpack`.
7. Choose Sign up with Gmail on `/login`, verify your account on Google's own page, then explore the portal with courses locked. In `/admin`, assign the required courses under Student Course Access. Returning students use Login with Gmail. A repeat signup shows Account already exists and switches to the login option.

If using `localhost` or a production domain instead, update both `NMAI_BASE_URL` and the exact Google redirect URI. Use one consistent hostname because cookies are host-specific. Production requires HTTPS.

Reference: [Google web-server OAuth documentation](https://developers.google.com/identity/protocols/oauth2/web-server).

## Local storage scope

Local development stores accounts, courses, assignments and sessions in `.local-data/auth.json`, ignored by Git. On Vercel, `DATABASE_URL` is required and the application uses Postgres. A database transaction and row lock protect updates across instances. Missing database configuration fails closed; production never falls back to temporary filesystem storage.

To initialize a new database once, pull production configuration into the ignored `.env.production.local`, then run `node scripts/initialize-database.mjs`. This copies the local accounts and course catalog, excludes sessions, and never overwrites an existing production record. Subsequent deployments use the same database without reseeding deleted accounts.

Production uses `https://nmai-main-website.vercel.app`. Configure `NMAI_BASE_URL` to that origin and add `https://nmai-main-website.vercel.app/api/auth/google/callback` to the Google OAuth client's authorized redirects. Store Google credentials and `NMAI_ADMIN_PASSKEY` as production environment variables. GitHub updates to the production branch automatically deploy to the existing domain.

The course catalog and access assignments are now server-managed. Tool catalog and profile editing still use their existing browser storage. Course management edits metadata and access; it does not author video lessons or create new lesson pages. Any future paid video/download API must also enforce server-side course authorization.
