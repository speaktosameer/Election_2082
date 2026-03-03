import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
})

// Type definitions
export interface Candidate {
  id: number
  candidate_id: number
  name_np: string
  name_en?: string
  party_np: string
  party_en?: string
  age: number | null
  gender: string
  province_np: string
  province_en?: string
  district_np: string
  education_bucket: string
  institution_norm?: string
  dob_bs_raw?: string
  constituency_no_hamro?: number
  url_hamropatro?: string
  latitude?: number
  longitude?: number
  created_at?: string
}

export interface PartyStats {
  party_np: string
  party_en?: string
  total_candidates: number
  avg_age: number
  female_count: number
  female_percentage: number
  male_count: number
  education_distribution: Record<string, number>
}

export interface ProvinceStats {
  province_np: string
  province_en?: string
  total_candidates: number
  candidates_by_party: Record<string, number>
}
