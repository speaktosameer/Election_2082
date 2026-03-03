import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('party_stats')
      .select('*')
      .order('total_candidates', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      parties: data || [],
    })
  } catch (error) {
    console.error('Error fetching party statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch party statistics' },
      { status: 500 }
    )
  }
}
