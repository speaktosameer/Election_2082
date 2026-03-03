import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const party = searchParams.get('party')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')
    const gender = searchParams.get('gender')
    const province = searchParams.get('province')
    const education = searchParams.get('education')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase.from('candidates').select('*', { count: 'exact' })

    // Apply filters
    if (party && party !== 'all') {
      query = query.eq('party_np', party)
    }

    if (gender && gender !== 'all') {
      query = query.ilike('gender', `%${gender}%`)
    }

    if (province && province !== 'all') {
      query = query.eq('province_np', province)
    }

    if (education && education !== 'all') {
      query = query.eq('education_bucket', education)
    }

    if (minAge) {
      query = query.gte('age', parseInt(minAge))
    }

    if (maxAge) {
      query = query.lte('age', parseInt(maxAge))
    }

    if (search) {
      query = query.ilike('name_np', `%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1).order('name_np', { ascending: true })

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      candidates: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}
