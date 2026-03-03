'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface GenderData {
  party: string
  male: number
  female: number
  percentage: number
}

export function GenderChart({ data }: { data: GenderData[] }) {
  const partyColors: Record<string, string> = {
    'राप्रपा': '#EF4444',
    'नेपाली कांग्रेस': '#3B82F6',
    'यूएमएल': '#F97316',
    'नेकपा': '#14B8A6',
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="party"
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
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
          <ReferenceLine y={33} stroke="#999" strokeDasharray="5 5" label="33% Target" />
          <Bar dataKey="percentage" fill="#EF4444" name="Female %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
