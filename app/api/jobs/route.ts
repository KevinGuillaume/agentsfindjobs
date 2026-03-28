import { db } from '@/lib/db'
import { mppx } from '@/lib/mppx'

export async function GET() {
  const jobs = await db.jobListing.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(jobs)
}

export const POST = mppx.charge({ amount: process.env.POST_FEE ?? '1.00' })(
  async (request: Request) => {
    const body = await request.json()
    const { title, company, description, location, url, tags } = body

    if (!title || !company || !description) {
      return Response.json(
        { error: 'title, company, and description are required' },
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
        location: location ?? null,
        url: url ?? null,
        tags: Array.isArray(tags) ? tags : [],
        postedBy,
        txHash,
      },
    })

    return Response.json(job, { status: 201 })
  },
)
