import { NextRequest, NextResponse } from "next/server";
import { accountProxy } from "@/lib/accounts/proxy";
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  const { action } = await context.params;
  if (action !== "forgot" && action !== "reset")
    return NextResponse.json({ detail: "not_found" }, { status: 404 });
  const response = await accountProxy(req, `/auth/password/${action}`, false);
  if (action === "reset" && response.ok)
    response.cookies.set("fruitful_access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  return response;
}
