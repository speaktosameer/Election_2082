'use client'

import { PartyStats } from '@/lib/db'

const partyColors: Record<string, { bg: string; text: string; border: string }> = {
  'राप्रपा': { bg: 'bg-party-rsp/10', text: 'text-party-rsp', border: 'border-party-rsp' },
  'नेपाली कांग्रेस': { bg: 'bg-party-nc/10', text: 'text-party-nc', border: 'border-party-nc' },
  'यूएमएल': { bg: 'bg-party-uml/10', text: 'text-party-uml', border: 'border-party-uml' },
  'नेकपा': { bg: 'bg-party-ncp/10', text: 'text-party-ncp', border: 'border-party-ncp' },
}

export function PartyMetrics({ parties }: { parties: PartyStats[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {parties.map((party) => {
        const colors = partyColors[party.party_np] || {
          bg: 'bg-secondary/10',
          text: 'text-secondary-foreground',
          border: 'border-secondary',
        }

        return (
          <div
            key={party.party_np}
            className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-4`}
          >
            <h3 className={`font-bold text-lg mb-3 ${colors.text}`}>
              {party.party_np}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Candidates:</span>
                <span className="font-semibold">{party.total_candidates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Age:</span>
                <span className="font-semibold">
                  {Math.round(party.avg_age || 0)} yrs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female %:</span>
                <span className="font-semibold">
                  {Math.round(party.female_percentage || 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female Count:</span>
                <span className="font-semibold">{party.female_count}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
