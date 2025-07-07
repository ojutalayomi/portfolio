// pages/api/verify-otp.ts
import speakeasy from "speakeasy";

export async function POST(request: Request) {
  const { otp } = await request.json() as { otp?: string };
  if (!process.env.SECRET_KEY) {
    return Response.json({ error: "SECRET_KEY not configured" });
  }
  if (!otp) {
    return Response.json({ error: "Missing OTP" });
  }

  const verified = speakeasy.totp.verify({
    secret: process.env.SECRET_KEY,
    encoding: "base32",
    token: otp,
  });

  if (verified) {
    return Response.json({ ok: true });
  } else {
    return Response.json({ error: "Invalid OTP" });
  }
}
