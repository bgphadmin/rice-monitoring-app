import Link from "next/link";

export default function LandingPage() {

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h2 className="text-4xl font-bold text-green-700 mb-4">
        Rice Inventory Monitoring App
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Track rice stock levels, manage employee distributions, and monitor benefits
        with ease. Built with Next.js, Prisma, and Supabase.
      </p>
      <div className="space-x-4">
        <Link
          href="/dashboard"
          className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Go to Dashboard
        </Link>
        {/* <Link
          href="/distribution"
          className="rounded border border-green-600 px-6 py-3 text-green-600 hover:bg-green-50"
        >
          Manage Rice Distribution
        </Link> */}
      </div>
    </section>
  );
}