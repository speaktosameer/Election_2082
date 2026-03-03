'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Candidate } from '@/lib/db'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function GeographyPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch('/api/candidates?limit=5000')
        const data = await res.json()
        setCandidates(data.candidates || [])
      } catch (error) {
        console.error('Error fetching candidates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  // Process province distribution
  const provinceData = candidates.reduce(
    (acc: Record<string, any>, candidate: Candidate) => {
      const province = candidate.province_np
      if (!acc[province]) {
        acc[province] = {
          province,
          total: 0,
          rsp: 0,
          nc: 0,
          uml: 0,
          ncp: 0,
        }
      }

      acc[province].total++

      const partyKey = {
        'राप्रपा': 'rsp',
        'नेपाली कांग्रेस': 'nc',
        'यूएमएल': 'uml',
        'नेकपा': 'ncp',
      }[candidate.party_np] || null

      if (partyKey && partyKey in acc[province]) {
        acc[province][partyKey]++
      }

      return acc
    },
    {}
  )

  // Get selected province data
  const selectedProvinceData = selectedProvince
    ? candidates.filter((c) => c.province_np === selectedProvince)
    : []

  // District distribution for selected province
  const districtData = selectedProvinceData.reduce(
    (acc: Record<string, number>, candidate: Candidate) => {
      const district = candidate.district_np
      if (district) {
        acc[district] = (acc[district] || 0) + 1
      }
      return acc
    },
    {}
  )

  const sortedProvinces = Object.values(provinceData).sort(
    (a, b) => b.total - a.total
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-muted-foreground">Loading geographic data...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Geographic Distribution</h1>
          <p className="text-muted-foreground">
            Candidate distribution across Nepal's 7 provinces
          </p>
        </div>

        {/* Province Overview */}
        <section className="mb-12 rounded-lg border border-border bg-background/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Candidates by Province</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedProvinces}
                margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="province"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="rsp" stackId="a" fill="#EF4444" name="राप्रपा" />
                <Bar dataKey="nc" stackId="a" fill="#3B82F6" name="नेपाली कांग्रेस" />
                <Bar dataKey="uml" stackId="a" fill="#F97316" name="यूएमएल" />
                <Bar dataKey="ncp" stackId="a" fill="#14B8A6" name="नेकपा" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Province Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Select Province for Details</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sortedProvinces.map((prov) => (
              <button
                key={prov.province}
                onClick={() =>
                  setSelectedProvince(
                    selectedProvince === prov.province ? null : prov.province
                  )
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProvince === prov.province
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary'
                }`}
              >
                <h3 className="font-semibold mb-2">{prov.province}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Total: {prov.total}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#EF4444' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#3B82F6' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#F97316' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#14B8A6' }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Province Details */}
        {selectedProvince && (
          <section className="rounded-lg border border-border bg-background/50 p-6">
            <h2 className="text-2xl font-bold mb-6">{selectedProvince} - District Details</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {Object.entries(districtData)
                .sort((a, b) => b[1] - a[1])
                .map(([district, count]) => (
                  <div
                    key={district}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <div className="font-semibold mb-2">{district}</div>
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Candidates
                    </div>
                  </div>
                ))}
            </div>

            {/* Party breakdown for selected province */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Party Distribution</h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    name: 'राप्रपा',
                    count: (provinceData[selectedProvince]?.rsp || 0),
                    color: 'bg-party-rsp',
                  },
                  {
                    name: 'नेपाली कांग्रेस',
                    count: (provinceData[selectedProvince]?.nc || 0),
                    color: 'bg-party-nc',
                  },
                  {
                    name: 'यूएमएल',
                    count: (provinceData[selectedProvince]?.uml || 0),
                    color: 'bg-party-uml',
                  },
                  {
                    name: 'नेकपा',
                    count: (provinceData[selectedProvince]?.ncp || 0),
                    color: 'bg-party-ncp',
                  },
                ].map((party) => (
                  <div
                    key={party.name}
                    className={`${party.color} text-white rounded-lg p-4`}
                  >
                    <div className="text-sm font-medium opacity-90">{party.name}</div>
                    <div className="text-2xl font-bold">{party.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
