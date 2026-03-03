'use client'

import { Header } from '@/components/Header'
import { AIChatInterface } from '@/components/AIChatInterface'

export default function AIQAPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="bg-gradient-to-b from-secondary to-background border-b border-border p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">AI Q&A Assistant</h1>
            <p className="text-muted-foreground">
              Powered by GPT-4, analyze Nepal's 2082 election data with natural language queries
            </p>
          </div>
        </div>
        <div className="flex-1 flex">
          <AIChatInterface />
        </div>
      </main>
    </div>
  )
}
