import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  const isConfigured = Boolean(
    clientId &&
    clientSecret &&
    clientId !== "google-client-id-placeholder" &&
    !clientId.includes("placeholder")
  );

  return NextResponse.json({
    configured: isConfigured,
  });
}
