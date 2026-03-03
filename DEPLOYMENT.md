# Deployment Guide - Nepal Election 2082 Platform

This guide covers deploying the Election 2082 platform to production on Vercel.

## Prerequisites

- Vercel account (free tier available at vercel.com)
- Supabase project created and schema initialized
- OpenAI API key with GPT-4 access
- GitHub repository connected to this code
- All 3,487 candidates imported into database

## Step 1: Prepare Your Environment

### 1.1 Set Up Supabase (if not already done)

1. Go to https://supabase.com and create a new project
2. Wait for the project to be initialized (5-10 minutes)
3. Go to **Project Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (anon key or service role key)
4. Run the schema migration locally first:
   ```bash
   # Copy content of scripts/01-create-schema.sql
   # Paste into Supabase SQL Editor and execute
   ```

### 1.2 Import Candidate Data Locally

Before deploying, ensure your database has all candidate data:

```bash
# Set up local .env.local
cp .env.example .env.local

# Add your Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...

# Run the import script
npx ts-node scripts/02-import-candidates.ts

# Wait for completion (1-2 minutes)
# You should see "All candidates imported successfully!"
```

### 1.3 Verify Data Import

Check that candidates were imported successfully:

1. Go to Supabase dashboard
2. Navigate to **SQL Editor** → New Query
3. Run:
   ```sql
   SELECT COUNT(*) as total_candidates FROM candidates;
   ```
4. You should see `total_candidates: 3487`

## Step 2: Connect to Vercel

### 2.1 Deploy from GitHub

1. Go to https://vercel.com/new
2. Select **Import Git Repository**
3. Find your GitHub repository and click **Import**
4. Vercel will auto-detect Next.js configuration
5. Click **Deploy** (first deployment without env vars will fail, but that's expected)

### 2.2 Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the CLI prompts to connect your GitHub account and project.

## Step 3: Configure Environment Variables

After initial deployment, set environment variables:

### Via Vercel Dashboard:

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
```

4. For each variable:
   - Select **Production**, **Preview**, and **Development** (or your deployment targets)
   - Click **Save**

### Via Vercel CLI:

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY

# Re-deploy to apply changes
vercel --prod
```

## Step 4: Verify Deployment

Once environment variables are set and deployment completes:

### 4.1 Check Deployment URL

1. Go to https://vercel.com and find your project
2. Click the latest deployment
3. Open the preview URL (usually `https://your-project-name.vercel.app`)

### 4.2 Test Each Feature

- **Homepage** - `/` - Should load with feature cards
- **Candidates** - `/candidates` - Should load and paginate
- **Parties** - `/parties` - Should show charts and statistics
- **Geography** - `/geography` - Should show province distribution
- **AI Q&A** - `/ai-qa` - Should load chat interface

### 4.3 Test API Endpoints

Open a terminal and test APIs:

```bash
# Test candidates API
curl "https://your-project.vercel.app/api/candidates?limit=10"

# Test parties API
curl "https://your-project.vercel.app/api/parties"

# Test search API
curl "https://your-project.vercel.app/api/search?q=test"
```

### 4.4 Test AI Q&A

1. Navigate to `/ai-qa` 
2. Click one of the example questions or type your own
3. Should see the chat respond with AI-generated insights
4. Response will stream in real-time

## Step 5: Post-Deployment Configuration

### 5.1 Enable Database Backup (Supabase)

1. Go to Supabase project dashboard
2. Navigate to **Backups**
3. Enable automatic daily backups
4. Optionally enable PITR (point-in-time recovery)

### 5.2 Set Up Monitoring

1. In Vercel dashboard → **Settings** → **Monitoring**
2. Enable Web Analytics
3. Set up Sentry for error tracking (optional)

### 5.3 Configure Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

## Troubleshooting Deployment

### Issue: "Supabase credentials missing" Error

**Solution:**
1. Verify environment variables are set in Vercel dashboard
2. Check spelling matches exactly
3. Redeploy: Go to **Deployments** → **...** → **Redeploy**

### Issue: Candidates not appearing in Explorer

**Solution:**
1. Verify data was imported:
   ```bash
   # In Supabase SQL Editor
   SELECT COUNT(*) FROM candidates;
   ```
2. If count is 0, re-run the import script locally
3. Check for errors in logs

### Issue: AI Q&A returns 401 Unauthorized

**Solution:**
1. Verify `OPENAI_API_KEY` is correct
2. Check API key has GPT-4 access at https://platform.openai.com/api-keys
3. Verify billing is active and quota is available

### Issue: Slow API responses

**Solution:**
1. This is normal for first request (cold start)
2. Subsequent requests will be faster
3. Consider upgrading Supabase plan for better performance

### Issue: 502 Bad Gateway errors

**Solution:**
1. Check Vercel deployment status in dashboard
2. Check for errors in logs (click deployment → **Logs**)
3. Ensure all environment variables are set
4. Try redeploying: **Deployments** → **...** → **Redeploy**

## Monitoring & Maintenance

### View Logs

1. Go to Vercel dashboard
2. Click **Deployments** → Select a deployment → **Logs**
3. View real-time application logs

### Check Performance

1. In Vercel dashboard → **Analytics**
2. Monitor:
   - Response times
   - Request count
   - Error rates
   - Web Vitals

### Database Maintenance

Monthly in Supabase:
1. Check query performance in **Database** → **Performance**
2. Analyze slow queries
3. Optimize indexes if needed
4. Monitor storage usage

## Production Checklist

Before marking as production-ready:

- [ ] All 3,487 candidates imported and verified
- [ ] Environment variables set in Vercel
- [ ] Homepage loads and displays correctly
- [ ] Candidates Explorer works with filters
- [ ] Party Analytics displays all charts
- [ ] Geography page shows provinces
- [ ] AI Q&A chat responds to questions
- [ ] API endpoints respond correctly
- [ ] No 502 errors in logs
- [ ] Custom domain configured (if applicable)
- [ ] Database backups enabled
- [ ] Monitoring/alerting configured

## Rollback Procedure

If deployment has critical issues:

1. In Vercel dashboard → **Deployments**
2. Find the last stable deployment
3. Click **...** → **Promote to Production**

This immediately rolls back to the previous version.

## Next Steps

After successful deployment:

1. **Share the URL** with users
2. **Monitor analytics** for usage patterns
3. **Gather feedback** for improvements
4. **Plan enhancements**:
   - Candidate detail pages
   - Export functionality
   - User accounts with saved filters
   - Real-time updates
   - Advanced analytics

---

**Your Election 2082 platform is now live! 🚀**

For issues or questions, refer to:
- [SETUP.md](./SETUP.md) - Local development setup
- [README.md](./README.md) - Project overview
- [Vercel docs](https://vercel.com/docs) - Vercel-specific help
- [Supabase docs](https://supabase.com/docs) - Database help
