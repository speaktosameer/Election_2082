# Nepal Election 2082 - Setup & Deployment Guide

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account (free tier available at supabase.com)
- OpenAI API key (for GPT-4 access)
- Vercel account (for deployment, optional)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd Election_2082
npm install
# or: pnpm install / yarn install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings → API → Get your `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Create the database schema:
   - In Supabase dashboard, go to SQL Editor
   - Create a new query and paste the contents of `scripts/01-create-schema.sql`
   - Execute the query
4. Enable necessary Postgres extensions:
   - Run the schema creation script which includes `CREATE EXTENSION pg_trgm`

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
```

### 4. Import Candidate Data

Before running the app, you need to import the CSV data into the database:

```bash
# Make sure you have Node.js and TypeScript set up
npx ts-node scripts/02-import-candidates.ts
```

This script will:
- Read the CSV from `assets/candidates_clean.csv`
- Parse and validate the data
- Batch insert 3,487 candidates into the database
- Calculate party statistics automatically

**Note**: The import process takes 1-2 minutes and creates the necessary database indexes.

### 5. Run the Development Server

```bash
npm run dev
# or: pnpm dev / yarn dev
```

The application will be available at `http://localhost:3000`

## Features Available After Setup

### 1. Candidate Explorer (`/candidates`)
- Filter by party, age range, gender, province, education
- Search by candidate name
- View individual candidate profiles
- Pagination support for browsing all 3,487 candidates

### 2. Party Analytics Dashboard (`/parties`)
- Compare four major parties (राप्रपा, नेपाली कांग्रेस, यूएमएल, नेकपा)
- Interactive charts:
  - Age distribution by party
  - Gender representation with 33% threshold
  - Education level distribution
  - Party comparison metrics
- Real-time calculations from database

### 3. Geographic Distribution (`/geography`)
- Candidate distribution across 7 provinces
- District-level breakdown for selected provinces
- Party representation by location
- Interactive province selection

### 4. AI Q&A Assistant (`/ai-qa`)
- GPT-4 powered natural language queries
- Understand candidate demographics
- Analyze party strategies and representation
- Get statistical insights and recommendations
- Streaming responses for better UX

## Database Schema

### Main Tables

- **candidates** (3,487 rows)
  - Core candidate information (name, age, education, party, location)
  - Full-text search indexes for names
  - Indexed fields: party_np, age, gender, province_np, education_bucket

- **party_stats** (4 rows)
  - Pre-calculated party statistics for dashboard
  - Average age, female count, education distribution per party
  - Cached data for performance

- **province_stats** (7 rows)
  - Province-level aggregation
  - Candidate counts by party per province

- **search_logs** (optional)
  - Analytics on user search behavior

## Deployment to Vercel

### Option 1: Direct Deployment from Git

```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your GitHub repository and deploy.

### Option 2: Manual Deployment

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
5. Deploy

### Post-Deployment

After deploying to Vercel, run the data import script in a serverless function or local environment:
- Ensure database credentials are available
- Execute `npx ts-node scripts/02-import-candidates.ts`

## Troubleshooting

### "Supabase credentials missing" error
- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify credentials in Supabase Project Settings → API

### "OpenAI API Key error" in AI Q&A
- Verify `OPENAI_API_KEY` is set correctly
- Ensure your OpenAI account has GPT-4 access
- Check API quota and billing at https://platform.openai.com/account/billing

### Candidates not showing in explorer
- Verify data import completed successfully
- Check Supabase dashboard for candidate records
- Ensure `candidates` table exists and has 3,487+ rows

### Map not displaying in Geography page
- The app uses Recharts for charts, not Leaflet
- No additional configuration needed for basic functionality
- Optional: Set `NEXT_PUBLIC_MAPBOX_TOKEN` for enhanced map features

## Development

### Project Structure

```
app/
├── page.tsx                    # Homepage
├── candidates/
│   ├── page.tsx               # Candidate Explorer
│   └── [id]/page.tsx          # Candidate Details (to be added)
├── parties/
│   └── page.tsx               # Party Analytics
├── geography/
│   └── page.tsx               # Geographic Distribution
├── ai-qa/
│   └── page.tsx               # AI Q&A Chat
└── api/
    ├── candidates/route.ts    # Candidate listing & filtering
    ├── parties/route.ts       # Party statistics
    ├── search/route.ts        # Full-text search
    └── ai/chat/route.ts       # AI streaming endpoint

components/
├── Header.tsx                 # Navigation header
├── CandidateFilters.tsx       # Filter sidebar
├── CandidateCard.tsx          # Candidate card component
├── PartyMetrics.tsx           # Party stat cards
├── AIChatInterface.tsx        # Chat UI
└── charts/                    # Recharts components

lib/
├── db.ts                      # Supabase client & types
└── ai-context.ts              # AI system prompt & context
```

### Adding Features

1. **New API endpoint**: Create in `app/api/<resource>/route.ts`
2. **New page**: Create in `app/<route>/page.tsx`
3. **New component**: Create in `components/<component>.tsx`
4. **Database changes**: Add SQL to `scripts/` and execute in Supabase

## Performance Optimization

- Database indexes on frequently filtered fields (party, age, gender, province)
- Full-text search using PostgreSQL trigram (pg_trgm)
- Client-side pagination (50 results per page)
- Cached party statistics in `party_stats` table
- Streaming AI responses for better UX

## Security Considerations

- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side API routes
- Use `NEXT_PUBLIC_SUPABASE_URL` for client-side connections (with RLS)
- Never commit `.env.local` to version control
- Enable Row Level Security (RLS) in Supabase for multi-tenant scenarios
- Validate all user inputs before database queries

## Next Steps & Future Enhancements

1. **Candidate detail pages** - Deep dive into individual profiles
2. **Advanced filtering** - Multi-select checkboxes for all dimensions
3. **Export functionality** - Download filtered lists as CSV/PDF
4. **User accounts** - Save favorite candidates and filter presets
5. **Real-time updates** - Use Supabase Realtime for live data changes
6. **More visualizations** - Heat maps, network graphs, time-series
7. **Mobile optimization** - Enhanced touch interactions

## Support & Issues

- For issues with the code, open an issue on GitHub
- For Supabase questions, visit https://supabase.com/docs
- For OpenAI API issues, check https://platform.openai.com/docs
- For Vercel deployment help, visit https://vercel.com/docs

---

**Happy exploring Nepal's 2082 election data! 🗳️**
