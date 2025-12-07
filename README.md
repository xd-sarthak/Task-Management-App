# Task-Management-App

## Authentication Setup - Google OAuth

This application uses Google OAuth for authentication instead of AWS Cognito.

### Client-Side Environment Variables

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration (v5)
AUTH_SECRET=your_nextauth_secret_here
AUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Server-Side Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Neon Database Configuration
# Use the pooled connection string for runtime (from Neon Console)
DATABASE_URL=postgresql://username:password@ep-xxxxxx-pooler.region.aws.neon.tech/dbname?sslmode=require

# Direct connection string for Prisma migrations (from Neon Console)
DIRECT_URL=postgresql://username:password@ep-xxxxxx.region.aws.neon.tech/dbname?sslmode=require

# Google OAuth Configuration (for token verification)
GOOGLE_CLIENT_ID=your_google_client_id_here

# Server Configuration
PORT=3001
```

### Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production URL + `/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your environment variables

### Generating AUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### Setting Up Neon Database

1. **Create a Neon Account:**
   - Go to [Neon Console](https://console.neon.tech/)
   - Sign up or log in
   - Create a new project

2. **Get Connection Strings:**
   - In your Neon project dashboard, click on "Connection Details"
   - You'll see two connection strings:
     - **Pooled Connection** (for `DATABASE_URL`): Use this for runtime connections. It includes `-pooler` in the hostname.
     - **Direct Connection** (for `DIRECT_URL`): Use this for Prisma migrations. This is the direct connection without pooling.

3. **Update Environment Variables:**
   - Copy the pooled connection string to `DATABASE_URL` in your `.env` file
   - Copy the direct connection string to `DIRECT_URL` in your `.env` file

### Database Migration

After setting up the environment variables, run the database migration:

```bash
cd server
npx prisma migrate dev
```

This will apply the migration that changes `cognitoId` to `googleId` in the User table.

**Note:** Prisma Migrate uses the `DIRECT_URL` for migrations, while your application uses the pooled `DATABASE_URL` for runtime connections. This ensures optimal performance.

**Neon Serverless Considerations:**
- Neon is serverless, which means the database may scale to zero when inactive
- The first connection after inactivity may have a slight delay (cold start)
- Connection pooling helps mitigate this by maintaining active connections
- If you experience connection timeouts, you can add timeout parameters to your connection string:
  ```
  ?sslmode=require&connect_timeout=15&pool_timeout=15
  ```

### Installation

1. Install client dependencies:
```bash
cd client
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:3000`
