'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { PartyMetrics } from '@/components/PartyMetrics'
import { AgeDistributionChart } from '@/components/charts/AgeDistributionChart'
import { GenderChart } from '@/components/charts/GenderChart'
import { EducationStackedChart } from '@/components/charts/EducationStackedChart'
import { PartyStats, Candidate } from '@/lib/db'

export default function PartiesPage() {
  const [parties, setParties] = useState<PartyStats[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [partiesRes, candidatesRes] = await Promise.all([
          fetch('/api/parties'),
          fetch('/api/candidates?limit=5000'),
        ])

        const partiesData = await partiesRes.json()
        const candidatesData = await candidatesRes.json()

        setParties(partiesData.parties || [])
        setCandidates(candidatesData.candidates || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process age distribution data
  const ageDistribution = candidates.reduce(
    (acc: Record<number, any>, candidate: Candidate) => {
      if (!candidate.age) return acc

      const age = Math.floor(candidate.age / 5) * 5
      if (!acc[age]) {
        acc[age] = { age, rsp: 0, nc: 0, uml: 0, ncp: 0 }
      }

      const partyKey = {
        'राप्रपा': 'rsp',
        'नेपाली कांग्रेस': 'nc',
        'यूएमएल': 'uml',
        'नेकपा': 'ncp',
      }[candidate.party_np] || null

      if (partyKey) {
        acc[age][partyKey]++
      }

      return acc
    },
    {}
  )

  // Process gender data
  const genderData = parties.map((party) => ({
    party: party.party_np,
    male: party.male_count || 0,
    female: party.female_count || 0,
    percentage: party.female_percentage || 0,
  }))

  // Process education data
  const educationDistribution = candidates.reduce(
    (acc: Record<string, any>, candidate: Candidate) => {
      if (!candidate.education_bucket) return acc

      if (!acc[candidate.education_bucket]) {
        acc[candidate.education_bucket] = {
          education: candidate.education_bucket,
          rsp: 0,
          nc: 0,
          uml: 0,
          ncp: 0,
        }
      }

      const partyKey = {
        'राप्रपा': 'rsp',
        'नेपाली कांग्रेस': 'nc',
        'यूएमएल': 'uml',
        'नेकपा': 'ncp',
      }[candidate.party_np] || null

      if (partyKey) {
        acc[candidate.education_bucket][partyKey]++
      }

      return acc
    },
    {}
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-muted-foreground">Loading party analytics...</div>
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
          <h1 className="text-4xl font-bold mb-2">Party Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comparative analysis of the four major parties and their candidates
          </p>
        </div>

        {/* Party Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Metrics by Party</h2>
          <PartyMetrics parties={parties} />
        </section>

        {/* Age Distribution */}
        <section className="mb-12 rounded-lg border border-border bg-background/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Age Distribution by Party</h2>
          <AgeDistributionChart
            data={Object.values(ageDistribution).sort(
              (a, b) => a.age - b.age
            )}
          />
        </section>

        {/* Gender Distribution */}
        <section className="mb-12 rounded-lg border border-border bg-background/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Female Representation by Party</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Nepal's election law requires at least 33% female representation
          </p>
          <GenderChart data={genderData} />
        </section>

        {/* Education Distribution */}
        <section className="rounded-lg border border-border bg-background/50 p-6">
          <h2 className="text-2xl font-bold mb-6">Education Levels by Party</h2>
          <EducationStackedChart
            data={Object.values(educationDistribution).sort(
              (a, b) => a.education.localeCompare(b.education)
            )}
          />
        </section>
      </main>
    </div>
  )
}
