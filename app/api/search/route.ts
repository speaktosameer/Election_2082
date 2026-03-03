import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!q || q.length < 2) {
      return NextResponse.json({
        results: [],
      })
    }

    const { data, error } = await supabase
      .from('candidates')
      .select('id, candidate_id, name_np, party_np, age, province_np')
      .ilike('name_np', `%${q}%`)
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      results: data || [],
    })
  } catch (error) {
    console.error('Error searching candidates:', error)
    return NextResponse.json(
      { error: 'Failed to search candidates' },
      { status: 500 }
    )
  }
}
