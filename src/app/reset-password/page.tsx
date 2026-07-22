import { updatePassword } from "./actions";
import { PasswordField } from "@/components/password-field";

export default async function ResetPasswordPage({
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
          <h1 className="-mt-0.5 text-xl font-semibold text-neutral-900">Set a new password</h1>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="password">
              New password
            </label>
            <PasswordField id="password" name="password" required minLength={6} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="confirm_password">
              Confirm new password
            </label>
            <PasswordField id="confirm_password" name="confirm_password" required minLength={6} />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
