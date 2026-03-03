import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import * as Papa from 'papaparse'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface RawCandidate {
  [key: string]: string | number
}

async function importCandidates() {
  try {
    const csvPath = path.join(process.cwd(), 'assets', 'candidates_clean.csv')

    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at ${csvPath}`)
      process.exit(1)
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    const parseResult = await new Promise<Papa.ParseResult<RawCandidate>>(
      (resolve, reject) => {
        Papa.parse(csvContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results as Papa.ParseResult<RawCandidate>),
          error: (error) => reject(error),
        })
      }
    )

    const candidates = parseResult.data

    console.log(`Importing ${candidates.length} candidates...`)

    // Batch insert in chunks of 1000
    const batchSize = 1000
    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize)

      const formattedBatch = batch.map((candidate) => ({
        candidate_id: candidate.candidate_id || candidate.Candidate_ID,
        name_np: candidate.name_np || candidate.Name_NP || '',
        name_en: candidate.name_en || candidate.Name_EN || null,
        party_np: candidate.party_np || candidate.Party_NP || '',
        party_en: candidate.party_en || candidate.Party_EN || null,
        age:
          candidate.age !== null && candidate.age !== undefined
            ? parseInt(String(candidate.age))
            : null,
        gender: candidate.gender || candidate.Gender || null,
        province_np: candidate.province_np || candidate.Province_NP || '',
        province_en: candidate.province_en || candidate.Province_EN || null,
        district_np: candidate.district_np || candidate.District_NP || '',
        education_bucket: candidate.education_bucket || candidate.Education_Bucket || '',
        institution_norm: candidate.institution_norm || candidate.Institution_Norm || null,
        dob_bs_raw: candidate.dob_bs_raw || candidate.DOB_BS_Raw || null,
        constituency_no_hamro: candidate.constituency_no_hamro || candidate.Constituency_No_Hamro || null,
        url_hamropatro: candidate.url_hamropatro || candidate.URL_HamroPatro || null,
        latitude:
          candidate.latitude !== null && candidate.latitude !== undefined
            ? parseFloat(String(candidate.latitude))
            : null,
        longitude:
          candidate.longitude !== null && candidate.longitude !== undefined
            ? parseFloat(String(candidate.longitude))
            : null,
        metadata: {},
      }))

      const { error } = await supabase
        .from('candidates')
        .insert(formattedBatch)
        .select()

      if (error) {
        console.error(`Error importing batch ${i / batchSize + 1}:`, error)
        throw error
      }

      console.log(
        `Imported ${Math.min(i + batchSize, candidates.length)}/${candidates.length} candidates`
      )
    }

    console.log('All candidates imported successfully!')

    // Calculate party statistics
    console.log('Calculating party statistics...')
    const { data: allCandidates } = await supabase
      .from('candidates')
      .select('*')

    if (allCandidates) {
      const partyStats = new Map<
        string,
        {
          total: number
          ageSum: number
          females: number
          males: number
          education: Map<string, number>
        }
      >()

      allCandidates.forEach((candidate: any) => {
        const party = candidate.party_np

        if (!partyStats.has(party)) {
          partyStats.set(party, {
            total: 0,
            ageSum: 0,
            females: 0,
            males: 0,
            education: new Map(),
          })
        }

        const stats = partyStats.get(party)!
        stats.total++

        if (candidate.age) {
          stats.ageSum += candidate.age
        }

        if (candidate.gender?.toLowerCase() === 'female') {
          stats.females++
        } else if (candidate.gender?.toLowerCase() === 'male') {
          stats.males++
        }

        if (candidate.education_bucket) {
          stats.education.set(
            candidate.education_bucket,
            (stats.education.get(candidate.education_bucket) || 0) + 1
          )
        }
      })

      const statsToInsert = Array.from(partyStats.entries()).map(([party, stats]) => ({
        party_np: party,
        total_candidates: stats.total,
        avg_age: Math.round((stats.ageSum / stats.total) * 100) / 100,
        female_count: stats.females,
        female_percentage: Math.round((stats.females / stats.total) * 10000) / 100,
        male_count: stats.males,
        education_distribution: Object.fromEntries(stats.education),
      }))

      const { error: statsError } = await supabase
        .from('party_stats')
        .insert(statsToInsert)
        .select()

      if (statsError) {
        console.error('Error importing party stats:', statsError)
      } else {
        console.log('Party statistics calculated successfully!')
      }
    }

    console.log('Data import complete!')
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

importCandidates()
