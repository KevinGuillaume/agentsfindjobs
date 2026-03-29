'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

type Job = {
  id: string
  title: string
  company: string
  description: string
  location: string
  url: string
  tags: string[]
  postedBy: string
  txHash: string
  createdAt: string
}

export default function JobListings({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const job of jobs) {
      for (const tag of job.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag)
  }, [jobs])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return jobs.filter((job) => {
      if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false
      if (remoteOnly && !job.location.toLowerCase().includes('remote')) return false
      if (activeTag && !job.tags.includes(activeTag)) return false
      return true
    })
  }, [jobs, search, remoteOnly, activeTag])

  const hasFilters = search || remoteOnly || activeTag

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>
          {/* Remote toggle */}
          <button
            onClick={() => setRemoteOnly((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-colors whitespace-nowrap ${
              remoteOnly
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Remote only
          </button>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                  activeTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {hasFilters ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : 'Latest listings'}
        </h2>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setRemoteOnly(false); setActiveTag(null) }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              Clear filters
            </button>
          )}
          <span className="text-xs text-zinc-400 font-mono">{jobs.length} total</span>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        jobs.length === 0 ? (
          <div className="text-center py-24 text-zinc-400 dark:text-zinc-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className="w-16 h-16 mx-auto mb-4 opacity-40">
              <rect x="16" y="10" width="32" height="26" rx="4" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="32" y1="10" x2="32" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="4" x2="38" y2="1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 2"/>
              <circle cx="25" cy="22" r="3" stroke="currentColor" strokeWidth="2"/>
              <line x1="34" y1="19" x2="40" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="40" y1="19" x2="34" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M24 31 Q32 28 40 31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <line x1="32" y1="36" x2="32" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="18" y="42" width="28" height="16" rx="3" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="18" y1="46" x2="10" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="46" y1="46" x2="54" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="25" y1="58" x2="25" y2="63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="39" y1="58" x2="39" y2="63" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="32" cy="50" r="2.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p className="font-medium">No listings yet.</p>
            <p className="text-sm mt-1">
              POST to{' '}
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                /api/jobs
              </code>{' '}
              with an MPP-enabled agent to get started.
            </p>
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
            <p className="font-medium">No listings match your filters.</p>
            <button
              onClick={() => { setSearch(''); setRemoteOnly(false); setActiveTag(null) }}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              Clear filters
            </button>
          </div>
        )
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{job.title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ''}
                    </p>
                  </div>
                  <time className="text-xs text-zinc-400 whitespace-nowrap mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => { e.preventDefault(); setActiveTag(activeTag === tag ? null : tag) }}
                        className={`text-xs font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          activeTag === tag
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
