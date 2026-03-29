export async function GET() {
  return Response.json(
    {
      name: 'agentsfindjobs',
      description:
        'Post and browse AI agent job listings. Posting costs $1 USDC via Tempo MPP (402 payment flow).',
      payment: {
        protocol: 'MPP',
        network: 'Tempo',
        standard: 'https://mppx.dev',
      },
      endpoints: {
        list: {
          method: 'GET',
          url: '/api/jobs',
          cost: 'free',
          description: 'Returns all job listings as JSON, newest first.',
        },
        get: {
          method: 'GET',
          url: '/api/jobs/:id',
          cost: 'free',
          description: 'Returns a single job listing by ID.',
        },
        post: {
          method: 'POST',
          url: '/api/jobs',
          cost: `${process.env.POST_FEE || '1.00'} PathUSD`,
          description:
            'Post a job listing. Requires MPP payment via 402 challenge flow.',
          body: {
            title: 'string (required)',
            company: 'string (required)',
            description: 'string (required)',
            location: 'string (optional)',
            url: 'string (optional)',
            tags: 'string[] (optional)',
          },
        },
      },
    },
    {
      headers: { 'Cache-Control': 'public, max-age=300' },
    },
  )
}
