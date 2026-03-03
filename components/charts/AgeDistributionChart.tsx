'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AgeData {
  age: number
  rsp?: number
  nc?: number
  uml?: number
  ncp?: number
}

export function AgeDistributionChart({ data }: { data: AgeData[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="age"
            label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }}
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
          <Bar dataKey="rsp" fill="#EF4444" name="राप्रपा" />
          <Bar dataKey="nc" fill="#3B82F6" name="नेपाली कांग्रेस" />
          <Bar dataKey="uml" fill="#F97316" name="यूएमएल" />
          <Bar dataKey="ncp" fill="#14B8A6" name="नेकपा" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
