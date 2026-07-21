import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lands here from the Supabase password-reset email link
// (?token_hash=...&type=recovery&next=/reset-password). Verifying the OTP
// server-side establishes a real (short-lived, recovery-scoped) session via
// cookies, so /reset-password's updateUser() call below has something to
// act on — Supabase's recommended pattern for @supabase/ssr, not a custom
// token scheme.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const redirectTo = request.nextUrl.clone();
      redirectTo.pathname = next;
      redirectTo.search = "";
      return NextResponse.redirect(redirectTo);
    }
  }

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = "/login";
  redirectTo.search = "";
  redirectTo.searchParams.set("error", "That reset link is invalid or has expired.");
  return NextResponse.redirect(redirectTo);
}
