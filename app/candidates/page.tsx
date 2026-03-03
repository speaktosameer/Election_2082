'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { CandidateFilters, FilterState } from '@/components/CandidateFilters'
import { CandidateCard } from '@/components/CandidateCard'
import { Pagination } from '@/components/Pagination'
import { Candidate } from '@/lib/db'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState<FilterState>({
    party: 'all',
    minAge: '',
    maxAge: '',
    gender: 'all',
    province: 'all',
    education: 'all',
    search: '',
  })

  const [parties, setParties] = useState<string[]>([])
  const [provinces, setProvinces] = useState<string[]>([])
  const [educationLevels, setEducationLevels] = useState<string[]>([])

  // Fetch filters metadata
  useEffect(() => {
    async function fetchMetadata() {
      try {
        const res = await fetch('/api/candidates?limit=1000')
        const data = await res.json()
        
        const uniqueParties = [...new Set(data.candidates?.map((c: Candidate) => c.party_np))].sort()
        const uniqueProvinces = [...new Set(data.candidates?.map((c: Candidate) => c.province_np))].sort()
        const uniqueEducation = [...new Set(data.candidates?.map((c: Candidate) => c.education_bucket))].sort()

        setParties(uniqueParties)
        setProvinces(uniqueProvinces)
        setEducationLevels(uniqueEducation)
      } catch (error) {
        console.error('Error fetching metadata:', error)
      }
    }

    fetchMetadata()
  }, [])

  // Fetch candidates with filters
  const fetchCandidates = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('limit', '50')

      if (filters.party !== 'all') params.append('party', filters.party)
      if (filters.minAge) params.append('minAge', filters.minAge)
      if (filters.maxAge) params.append('maxAge', filters.maxAge)
      if (filters.gender !== 'all') params.append('gender', filters.gender)
      if (filters.province !== 'all') params.append('province', filters.province)
      if (filters.education !== 'all') params.append('education', filters.education)
      if (filters.search) params.append('search', filters.search)

      const res = await fetch(`/api/candidates?${params}`)
      const data = await res.json()

      setCandidates(data.candidates || [])
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    setCurrentPage(1)
    fetchCandidates(1)
  }, [filters, fetchCandidates])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    fetchCandidates(page)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Candidate Explorer</h1>
          <p className="text-muted-foreground">
            Filter and explore {total.toLocaleString()} candidates from Nepal's 2082 election
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <CandidateFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              parties={parties}
              provinces={provinces}
              educationLevels={educationLevels}
            />
          </aside>

          {/* Results */}
          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-muted-foreground">Loading candidates...</div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No candidates found</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to find more candidates.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * 50) + 1} - {Math.min(currentPage * 50, total)} of {total.toLocaleString()} candidates
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.candidate_id}
                      candidate={candidate}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
