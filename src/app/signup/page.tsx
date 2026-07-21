import Link from "next/link";
import { signup } from "../login/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dipstify-app-icon.png" alt="Dipstify" width={40} height={40} />
          <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">Dipstify</span>
          <h1 className="-mt-0.5 text-xl font-semibold text-neutral-900">PNLVerified</h1>
          <p className="mt-1 text-sm text-neutral-500">Create your account</p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form action={signup} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="full_name">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            >
              <option value="accounting_head">Accounting Department Head</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-neutral-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
