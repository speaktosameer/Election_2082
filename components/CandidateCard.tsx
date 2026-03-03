'use client'

import Link from 'next/link'
import { Candidate } from '@/lib/db'

const partyColors: Record<string, string> = {
  'राप्रपा': 'bg-party-rsp/20 text-party-rsp border-party-rsp',
  'नेपाली कांग्रेस': 'bg-party-nc/20 text-party-nc border-party-nc',
  'यूएमएल': 'bg-party-uml/20 text-party-uml border-party-uml',
  'नेकपा': 'bg-party-ncp/20 text-party-ncp border-party-ncp',
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const partyColor = partyColors[candidate.party_np] || 'bg-secondary/20 text-secondary-foreground border-secondary'

  return (
    <Link href={`/candidates/${candidate.candidate_id}`}>
      <div className="rounded-lg border border-border bg-background p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
        {/* Avatar placeholder */}
        <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto" />
        
        {/* Candidate Info */}
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2 text-center mb-2">
            {candidate.name_np}
          </h3>
          
          <div className="space-y-2 text-sm">
            {/* Party */}
            <div className={`px-2 py-1 rounded border text-center ${partyColor}`}>
              {candidate.party_np}
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs">
              {candidate.age && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Age:</span>
                  <span>{candidate.age}</span>
                </div>
              )}
              {candidate.gender && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Gender:</span>
                  <span>{candidate.gender}</span>
                </div>
              )}
            </div>

            {/* Province */}
            {candidate.province_np && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Province:</span> {candidate.province_np}
              </div>
            )}

            {/* Education */}
            {candidate.education_bucket && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Education:</span> {candidate.education_bucket}
              </div>
            )}
          </div>
        </div>

        {/* View Button */}
        <button className="mt-4 w-full px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
          View Profile
        </button>
      </div>
    </Link>
  )
}
