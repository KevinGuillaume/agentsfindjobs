import { db } from '@/lib/db'
import { mppx } from '@/lib/mppx'

const JOB_SCHEMA = {
  title: 'string (required)',
  company: 'string (required)',
  description: 'string (required)',
  location: 'string (required)',
  url: 'string (required)',
  tags: 'string[] (optional)',
}

export async function GET() {
  const jobs = await db.jobListing.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(jobs)
}

const chargeHandler = mppx.charge({ amount: process.env.POST_FEE || '1.00' })(
  async (request: Request) => {
    const raw = await request.text()
    const sanitized = raw.replace(/[\x00-\x1F\x7F]/g, (c) =>
      ({ '\n': '\\n', '\r': '\\r', '\t': '\\t' })[c] ?? '',
    )
    const body = JSON.parse(sanitized)
    const { title, company, description, location, url, tags } = body

    if (!title || !company || !description || !location || !url) {
      return Response.json(
        { error: 'title, company, description, location, and url are required' },
        { status: 400 },
      )
    }

    const receipt = request.headers.get('Payment-Receipt') ?? ''
    const txHash = receipt.split(';').find((p) => p.trim().startsWith('reference='))?.split('=')[1] ?? ''
    const postedBy = receipt.split(';').find((p) => p.trim().startsWith('payer='))?.split('=')[1] ?? ''

    const job = await db.jobListing.create({
      data: {
        title,
        company,
        description,
        location,
        url,
        tags: Array.isArray(tags) ? tags : [],
        postedBy,
        txHash,
      },
    })

    return Response.json(job, { status: 201 })
  },
)

export async function POST(request: Request) {
  const response = await chargeHandler(request)

  if (response.status === 402) {
    const headers = new Headers(response.headers)
    headers.set('X-Body-Schema', JSON.stringify(JOB_SCHEMA))
    headers.set('X-Body-Required', 'title, company, description, location, url')
    headers.set('X-Content-Type', 'application/json')
    return new Response(response.body, { status: 402, headers })
  }

  return response
}
