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
} from 'recharts'

interface EducationData {
  education: string
  rsp: number
  nc: number
  uml: number
  ncp: number
}

export function EducationStackedChart({ data }: { data: EducationData[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="education"
            angle={-45}
            textAnchor="end"
            height={100}
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
  )
}
