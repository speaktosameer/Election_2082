import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAIContext, buildSystemPrompt } from '@/lib/ai-context'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }

    // Get AI context
    const context = await getAIContext()
    if (!context) {
      return NextResponse.json(
        { error: 'Failed to load candidate data context' },
        { status: 500 }
      )
    }

    const systemPrompt = buildSystemPrompt(context)

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Stream the response
    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
              controller.enqueue(
                encoder.encode(chunk.choices[0].delta.content)
              )
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
