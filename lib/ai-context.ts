import { supabase } from './db'

export async function getAIContext() {
  try {
    // Get party statistics
    const { data: partyStats } = await supabase
      .from('party_stats')
      .select('*')
      .order('total_candidates', { ascending: false })

    // Get province statistics
    const { data: provinceStats } = await supabase
      .from('province_stats')
      .select('*')
      .order('total_candidates', { ascending: false })

    // Get education distribution
    const { data: candidates } = await supabase
      .from('candidates')
      .select('education_bucket, COUNT(*)')
      .returns<{ education_bucket: string; count: number }[]>()

    // Get sample candidates for grounding
    const { data: sampleCandidates } = await supabase
      .from('candidates')
      .select('*')
      .limit(100)

    const context = {
      totalCandidates: partyStats?.reduce((sum, p: any) => sum + p.total_candidates, 0) || 0,
      partyStats,
      provinceStats,
      educationDistribution: candidates || [],
      sampleCandidates,
      dataSnapshot: {
        collectionDate: new Date().toISOString(),
        electionYear: 2082,
        country: 'Nepal',
      },
    }

    return context
  } catch (error) {
    console.error('Error fetching AI context:', error)
    return null
  }
}

export function buildSystemPrompt(context: any) {
  const parties = context.partyStats
    ?.map((p: any) => `${p.party_np} (${p.total_candidates} candidates)`)
    .join(', ')

  const provinces = context.provinceStats
    ?.map((p: any) => `${p.province_np} (${p.total_candidates} candidates)`)
    .join(', ')

  return `You are an expert analyst of Nepal's 2082 election candidates. You have access to detailed data about ${context.totalCandidates} candidates.

Key Information:
- Total Candidates: ${context.totalCandidates}
- Election Year: 2082
- Major Parties: ${parties}
- Provinces: ${provinces}

You can answer questions about:
1. Individual candidates (demographics, education, party affiliation, location)
2. Party statistics and comparisons (gender ratio, average age, education levels)
3. Geographic distribution of candidates
4. Demographic trends and patterns
5. Recommendations for candidates matching specific criteria

When answering questions:
- Be specific with numbers and percentages
- Reference actual data from the candidate database
- Suggest related candidates or comparisons when relevant
- If you don't have specific information, say so clearly
- For candidate recommendations, ask clarifying questions if needed`
}
