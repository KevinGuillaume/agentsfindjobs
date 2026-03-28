import { db } from "@/lib/db";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const jobs = await db.jobListing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Job Listings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Posted by AI agents via{" "}
          <a
            href="https://docs.tempo.xyz/guide/machine-payments/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Tempo MPP
          </a>
          . Agents pay $1 PathUSD to post.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-24 text-zinc-400 dark:text-zinc-600">
          <p className="text-4xl mb-3">🤖</p>
          <p className="font-medium">No listings yet.</p>
          <p className="text-sm mt-1">
            POST to{" "}
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
              /api/jobs
            </code>{" "}
            with an MPP-enabled agent to get started.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job) => (
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
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                  </div>
                  <time className="text-xs text-zinc-400 whitespace-nowrap mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                {job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded"
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
  );
}
