# Nepal Election 2082 - Interactive Visualization & AI Q&A Platform

An advanced web platform for exploring and analyzing Nepal's 2082 election candidate data with interactive visualizations, party analytics, geographic distribution, and AI-powered insights.

## Features

### Candidate Explorer
- Browse and filter 3,487 candidates from Nepal's 2082 election
- Advanced filtering by party, age range, gender, province, and education level
- Full-text search by candidate name
- Pagination with 50 candidates per page
- Individual candidate profile pages

### Party Analytics Dashboard
- Compare four major parties: राप्रपा, नेपाली कांग्रेस, यूएमएल, नेकपा
- Interactive Recharts visualizations:
  - **Age Distribution**: Overlaid histograms by party
  - **Gender Representation**: Female % by party with 33% threshold
  - **Education Levels**: Stacked bar charts showing education distribution
  - **Party Metrics**: Key statistics cards (total candidates, avg age, female %)

### Geographic Distribution
- Candidate distribution across Nepal's 7 provinces
- District-level breakdown with click-to-select functionality
- Party representation visualization by location
- Interactive bar charts showing geographic patterns

### AI Q&A Assistant
- GPT-4 powered natural language interface
- Ask questions about candidates, parties, demographics
- Get statistical insights and candidate recommendations
- Streaming responses for enhanced user experience
- Example questions pre-populated for quick exploration

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Database**: Supabase PostgreSQL with full-text search
- **UI/Styling**: Tailwind CSS with shadcn/ui patterns
- **Charts**: Recharts for interactive visualizations
- **AI**: OpenAI GPT-4 via Vercel AI SDK
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free)
- OpenAI API key

### Installation

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd Election_2082
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Set up database**
   - Create Supabase project
   - Run schema creation: `scripts/01-create-schema.sql`
   - Import candidates: `npx ts-node scripts/02-import-candidates.ts`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with feature overview |
| `/candidates` | Candidate Explorer with filters |
| `/parties` | Party Analytics Dashboard |
| `/geography` | Geographic Distribution |
| `/ai-qa` | AI Q&A Chat Interface |

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/candidates` | GET | List & filter candidates |
| `/api/candidates/[id]` | GET | Get candidate details |
| `/api/parties` | GET | Get party statistics |
| `/api/search` | GET | Full-text search candidates |
| `/api/ai/chat` | POST | Stream AI responses |

## Database Schema

- **candidates** (3,487 rows) - Core candidate information with indexes for fast filtering
- **party_stats** (4 rows) - Pre-calculated party statistics for dashboard
- **province_stats** (7 rows) - Province-level aggregation data

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Then set environment variables in Vercel project settings.

## Support & Documentation

- For setup issues, see [SETUP.md](./SETUP.md)
- For API documentation, check route comments
- For feature requests, open a GitHub issue

---

**Built with Next.js, Supabase, and GPT-4 for democratic transparency in Nepal**
