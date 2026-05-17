# Pre-Deployment Checklist

## Code Quality
- [ ] No secrets hardcoded in source files
- [ ] All environment variables use `System/getenv`
- [ ] `.env` file created locally from `.env.example`
- [ ] `.env` is in `.gitignore`
- [ ] Lint passes: `lein kibit` (optional)
- [ ] Tests pass: `lein test` (when tests added)

## Build Verification
- [ ] `lein deps` downloads all dependencies
- [ ] `lein uberjar` builds successfully
- [ ] JAR file exists at `target/uberjar/limelight-yardstick-*-standalone.jar`

## Local Testing
- [ ] Local PostgreSQL running
- [ ] `lein run` starts without errors
- [ ] App listens on `0.0.0.0:8080` (not just 127.0.0.1)
- [ ] `curl http://localhost:8080/api/health` returns `{"status":"ok"}`
- [ ] Google OAuth flow works (redirect → login → callback)

## Fly.io Configuration
- [ ] `fly.toml` uses `[http_service]` format (modern)
- [ ] No `[[services]]` or `[deploy]` sections causing conflicts
- [ ] `internal_port` matches app port (8080)
- [ ] `force_https = true` enabled
- [ ] Health check path is `/api/health` (endpoint exists)

## Google OAuth Setup
- [ ] Google Cloud project created
- [ ] OAuth 2.0 credentials created (Web application type)
- [ ] Redirect URI added to Google Console: `https://limelight-yardstick.fly.dev/auth/google/callback`
- [ ] Client ID obtained
- [ ] Client Secret obtained

## Fly.io Secrets
- [ ] `GOOGLE_CLIENT_ID` set
- [ ] `GOOGLE_CLIENT_SECRET` set
- [ ] `OAUTH_REDIRECT_URI` set (exact match with Google Console)
- [ ] Database secrets auto-set by `fly postgres attach`
- [ ] Verify secrets: `fly secrets list`

## Database Setup
- [ ] PostgreSQL database created on Fly.io: `fly postgres create --name limelight-yardstick-db`
- [ ] Database attached to app: `fly postgres attach limelight-yardstick-db -a limelight-yardstick`
- [ ] `DATABASE_URL` secret auto-created by attachment
- [ ] Database tables auto-initialize on first app start

## Docker Build
- [ ] Dockerfile stage 1: Build layer with clojure:temurin-21-lein-2.11.2
- [ ] Dockerfile stage 2: Runtime layer with eclipse-temurin:21-jre-alpine
- [ ] JAR path correct: `target/uberjar/limelight-yardstick-*-standalone.jar`
- [ ] WORKDIR set to `/app`
- [ ] EXPOSE 8080
- [ ] Entrypoint uses `dumb-init` for signal handling
- [ ] No `[[services]]` configuration in fly.toml

## Deployment Execution
- [ ] Current directory is limelight-yardstick root
- [ ] Git status clean (all files committed or in .gitignore)
- [ ] Run: `fly deploy --remote-only`
- [ ] Monitor: `fly logs -a limelight-yardstick --follow`

## Post-Deployment Validation
- [ ] App deployed successfully: `fly status -a limelight-yardstick`
- [ ] Machines running: `fly machines list -a limelight-yardstick`
- [ ] Health checks passing: Check Fly dashboard
- [ ] Test health endpoint: `curl https://limelight-yardstick.fly.dev/api/health`
- [ ] OAuth flow works: Visit `https://limelight-yardstick.fly.dev/auth/google`
- [ ] Database connected: Check logs for connection success

## Troubleshooting

**If machines restart repeatedly**:
- ✅ Already fixed: App binds to 0.0.0.0 (check core.clj jetty config)
- ✅ Already fixed: fly.toml uses [http_service]
- [ ] Check logs: `fly logs -a limelight-yardstick`
- [ ] Verify DATABASE_URL secret is set

**If OAuth fails**:
- [ ] Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- [ ] Verify OAUTH_REDIRECT_URI matches exactly in Google Console
- [ ] Check logs for OAuth exchange errors

**If database won't connect**:
- [ ] Verify database is running: `fly postgres status -a limelight-yardstick-db`
- [ ] Check DATABASE_URL is set: `fly secrets list -a limelight-yardstick`
- [ ] View connection logs: `fly logs -a limelight-yardstick`

## Emergency Rollback

```bash
# View deployment history
fly releases -a limelight-yardstick

# Rollback to previous version
fly releases rollback -a limelight-yardstick
```

## Success Indicators

✅ App is running on https://limelight-yardstick.fly.dev
✅ Health check endpoint responds
✅ OAuth login redirect works
✅ Machines are stable (not restarting)
✅ Database is connected and initialized
✅ Logs show "Starting Limelight Yardstick"
