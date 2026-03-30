import { db } from '@/lib/db'
import { mppx } from '@/lib/mppx'

const DENYLIST_RE = process.env.DENYLIST
  ? new RegExp(process.env.DENYLIST.split(',').map((w) => w.trim()).join('|'), 'i')
  : null

function containsHatefulContent(text: string) {
  return DENYLIST_RE?.test(text) ?? false
}

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
    const body = await request.json()
    const { title, company, description, location, url, tags } = body

    if (!title || !company || !description || !location || !url) {
      return Response.json(
        { error: 'title, company, description, location, and url are required' },
        { status: 400 },
      )
    }

    if ([title, company, description, location].some(containsHatefulContent)) {
      return Response.json({ error: 'Listing contains prohibited content' }, { status: 400 })
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