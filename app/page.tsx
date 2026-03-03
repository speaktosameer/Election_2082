'use client'

import Link from 'next/link'
import { Header } from '@/components/Header'
import { ArrowRight, BarChart3, Map, MessageSquare, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Nepal Election 2082
              <br />
              <span className="bg-gradient-to-r from-party-rsp via-party-nc to-party-uml bg-clip-text text-transparent">
                Interactive Analysis Platform
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore comprehensive data on 3,487 candidates. Visualize demographics, party statistics, and geographic distribution. Get instant AI-powered insights about Nepal's democratic process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/candidates"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                Explore Candidates <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/ai-qa"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-input hover:bg-secondary font-medium transition-colors"
              >
                Ask AI <MessageSquare className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to understand Nepal's 2082 election landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Link
              href="/candidates"
              className="group rounded-lg border border-border bg-background/50 p-6 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="mb-4 p-3 rounded-lg bg-party-rsp/20 w-fit">
                <Users size={24} className="text-party-rsp" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                Candidate Explorer
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Filter and search 3,487 candidates by party, age, gender, education, and location
              </p>
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore → 
              </span>
            </Link>

            {/* Feature 2 */}
            <Link
              href="/parties"
              className="group rounded-lg border border-border bg-background/50 p-6 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="mb-4 p-3 rounded-lg bg-party-nc/20 w-fit">
                <BarChart3 size={24} className="text-party-nc" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                Party Analytics
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Compare parties with interactive charts on demographics, education, and gender representation
              </p>
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Analyze →
              </span>
            </Link>

            {/* Feature 3 */}
            <Link
              href="/geography"
              className="group rounded-lg border border-border bg-background/50 p-6 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="mb-4 p-3 rounded-lg bg-party-uml/20 w-fit">
                <Map size={24} className="text-party-uml" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                Geographic Distribution
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Visualize candidate distribution across Nepal's 7 provinces and districts
              </p>
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            </Link>

            {/* Feature 4 */}
            <Link
              href="/ai-qa"
              className="group rounded-lg border border-border bg-background/50 p-6 hover:border-primary hover:bg-secondary/20 transition-all"
            >
              <div className="mb-4 p-3 rounded-lg bg-party-ncp/20 w-fit">
                <MessageSquare size={24} className="text-party-ncp" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                AI Q&A Assistant
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Ask natural language questions about candidates, parties, trends, and get AI-powered insights
              </p>
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Ask →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/50 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3,487</div>
              <div className="text-muted-foreground">Total Candidates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-party-rsp mb-2">7</div>
              <div className="text-muted-foreground">Provinces</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-party-nc mb-2">4</div>
              <div className="text-muted-foreground">Major Parties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-party-uml mb-2">27</div>
              <div className="text-muted-foreground">Data Fields</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start discovering insights about Nepal's 2082 election candidates and parties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/candidates"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              Browse Candidates
            </Link>
            <Link
              href="/parties"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-input hover:bg-secondary font-medium transition-colors"
            >
              View Party Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
            <div>
              <h3 className="font-bold mb-1">Nepal Election 2082</h3>
              <p className="text-sm text-muted-foreground">
                Interactive visualization & AI analysis platform
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Data collected and analyzed for democratic transparency
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
