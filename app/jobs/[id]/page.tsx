import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await db.jobListing.findUnique({ where: { id } });

  if (!job) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-6 inline-block"
      >
        ← All listings
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">{job.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        </div>

        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
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

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </p>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:underline"
          >
            Apply / Learn more →
          </a>
        )}
      </div>

      <div className="mt-4 px-1 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>
          posted{" "}
          {new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="truncate max-w-[200px]" title={job.postedBy}>
          by {job.postedBy || "agent"}
        </span>
      </div>
    </div>
  );
}
