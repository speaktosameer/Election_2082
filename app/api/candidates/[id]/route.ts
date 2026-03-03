import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('candidate_id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    )
  }
}
