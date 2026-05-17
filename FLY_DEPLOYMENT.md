# Limelight Yardstick - Fly.io Deployment Guide

## Project Overview

This is a Clojure web application with:
- **Ring** web framework for HTTP handling
- **Compojure** for routing
- **PostgreSQL** for data storage
- **Google OAuth 2.0** for authentication
- **Fly.io** deployment target

## Pre-Deployment Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application type)
5. Add authorized redirect URI: `https://<YOUR_APP_NAME>.fly.dev/auth/google/callback`
6. Note your Client ID and Client Secret

### 2. Fly.io Account Setup

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly
fly auth login

# Create app
fly apps create limelight-yardstick
```

### 3. PostgreSQL Database

```bash
# Create managed Postgres database on Fly.io
fly postgres create --name limelight-yardstick-db

# Attach database to app (this creates DATABASE_URL secret automatically)
fly postgres attach limelight-yardstick-db -a limelight-yardstick
```

### 4. Set Secrets

```bash
# Set all required environment variables
fly secrets set \
  GOOGLE_CLIENT_ID=<your_client_id> \
  GOOGLE_CLIENT_SECRET=<your_client_secret> \
  OAUTH_REDIRECT_URI=https://limelight-yardstick.fly.dev/auth/google/callback \
  LOG_LEVEL=INFO
```

## Local Development

### Prerequisites

- Java 21+
- Leiningen
- PostgreSQL (local or Docker)

### Running Locally

```bash
# 1. Set up local database
createdb limelight
createuser limelight_user -P  # Set password

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your local database and Google OAuth credentials

# 3. Run the app
lein run
```

The app will start on `http://localhost:8080`

### Testing Authentication Flow

1. Visit `http://localhost:8080/auth/google`
2. Sign in with your Google account
3. Should redirect back to `/dashboard?user=<user_id>`

## Deployment

### First Deployment

```bash
# Deploy to Fly.io
fly deploy

# View logs
fly logs

# Check app status
fly status
```

### Health Check

The app exposes `/api/health` endpoint. Fly.io health checks this every 10 seconds.

```bash
curl https://limelight-yardstick.fly.dev/api/health
# Should return: {"status":"ok"}
```

## Key Configuration Files

- **`project.clj`** - Clojure dependencies and build configuration
- **`Dockerfile`** - Two-stage Docker build (Clojure builder → Alpine runtime)
- **`fly.toml`** - Fly.io application configuration
- **`resources/logback.xml`** - Logging configuration
- **`.env.example`** - Environment variable template

## Important Implementation Notes

### Authentication Module (`src/limelight_yardstick/auth.clj`)

Currently implements:
- ✅ Google OAuth 2.0 login flow
- ✅ Token exchange
- ✅ ID token verification (basic - needs production-grade JWT validation)
- ⚠️ Session management (stub - integrate with Ring session middleware)
- ⚠️ Protected route handlers (stubs)

**TODO**: Replace basic ID token decoding with proper JWT library

### Database Module (`src/limelight_yardstick/db.clj`)

Provides:
- ✅ Connection pooling (HikariCP)
- ✅ Schema initialization
- ✅ User CRUD operations
- ✅ Movie storage operations
- ✅ Session management

### Core Application (`src/limelight_yardstick/core.clj`)

Routes:
- `GET /` → Redirects to `/index.html`
- `GET /api/health` → Health check
- `GET /auth/google` → Initiate Google OAuth
- `GET /auth/google/callback` → OAuth callback handler
- `GET /api/user` → Get current user (requires auth)
- `GET /api/movies` → List user's movies (requires auth)
- `POST /api/movies` → Create movie (requires auth)

## Common Issues

### Machine Restarts

**Symptom**: App crashes repeatedly on Fly.io

**Causes**:
1. ✅ Fixed: App now binds to `0.0.0.0` (not just 127.0.0.1)
2. ✅ Fixed: fly.toml uses modern `[http_service]` format
3. Database connection failures - check DATABASE_URL secret

### Build Failures

**Check**:
- JAR path is correct (`target/uberjar/*-standalone.jar`)
- All dependencies download successfully locally (`lein deps`)
- Java version is compatible (JDK 21)

### OAuth Redirect Loop

**Check**:
- `OAUTH_REDIRECT_URI` matches exactly in Fly.io secrets and Google Console
- Google credentials are correct
- Session management is working

## Next Steps

1. **Production JWT Validation** - Replace basic ID token decode with proper JWT library
2. **Session Middleware** - Integrate Ring sessions with database backend
3. **Frontend** - Create `resources/public/index.html` for UI
4. **API Endpoints** - Implement movie list, create, update, delete
5. **TMDB Integration** - Connect to TMDB API in `src/limelight_yardstick/tmdb_client.clj`
6. **Tests** - Add unit tests in `test/` directory

## Useful Commands

```bash
# Monitor logs in real-time
fly logs -a limelight-yardstick --follow

# SSH into running machine
fly ssh console -a limelight-yardstick

# Scale instances
fly scale count 2

# Redeploy without rebuilding
fly deploy --strategy canary

# View secrets (values hidden)
fly secrets list

# Check database connection
fly postgres connect -a limelight-yardstick-db
```

## Documentation Links

- [Fly.io Clojure Guide](https://fly.io/docs/languages-and-frameworks/clojure/)
- [Ring Documentation](https://github.com/ring-clojure/ring)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [PostgreSQL on Fly.io](https://fly.io/docs/postgres/)
