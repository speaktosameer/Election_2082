'use client'

import { useCallback } from 'react'

export interface FilterState {
  party: string
  minAge: string
  maxAge: string
  gender: string
  province: string
  education: string
  search: string
}

interface CandidateFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  parties: string[]
  provinces: string[]
  educationLevels: string[]
}

export function CandidateFilters({
  filters,
  onFilterChange,
  parties,
  provinces,
  educationLevels,
}: CandidateFiltersProps) {
  const handleChange = useCallback(
    (key: keyof FilterState, value: string) => {
      onFilterChange({
        ...filters,
        [key]: value,
      })
    },
    [filters, onFilterChange]
  )

  return (
    <div className="space-y-6 rounded-lg border border-border bg-background p-4 h-fit sticky top-20">
      <div>
        <h3 className="font-semibold mb-3">Filters</h3>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search Name</label>
        <input
          type="text"
          placeholder="Search candidates..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Party */}
      <div>
        <label className="block text-sm font-medium mb-2">Party</label>
        <select
          value={filters.party}
          onChange={(e) => handleChange('party', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Parties</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium mb-2">Gender</label>
        <select
          value={filters.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Age Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => handleChange('minAge', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => handleChange('maxAge', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium mb-2">Province</label>
        <select
          value={filters.province}
          onChange={(e) => handleChange('province', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Provinces</option>
          {provinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-medium mb-2">Education</label>
        <select
          value={filters.education}
          onChange={(e) => handleChange('education', e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Levels</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFilterChange({
            party: 'all',
            minAge: '',
            maxAge: '',
            gender: 'all',
            province: 'all',
            education: 'all',
            search: '',
          })
        }
        className="w-full px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
      >
        Reset Filters
      </button>
    </div>
  )
}
