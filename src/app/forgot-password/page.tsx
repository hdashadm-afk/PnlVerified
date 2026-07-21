import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dipstify-app-icon.png" alt="Dipstify" width={40} height={40} />
          <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">Dipstify</span>
          <h1 className="-mt-0.5 text-xl font-semibold text-neutral-900">Reset your password</h1>
          <p className="mt-1 text-sm text-neutral-500">We&apos;ll email you a link to set a new one.</p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {sent ? (
          <p className="rounded-md bg-neutral-50 px-3 py-3 text-center text-sm text-neutral-700">
            Check your inbox — if that email has an account, a reset link is on its way.
          </p>
        ) : (
          <form action={requestPasswordReset} className="space-y-4">
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
            <button
              type="submit"
              className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-neutral-500">
          <Link href="/login" className="font-medium text-neutral-900 underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
