import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "./lib/supabase";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const isLocalhost = request.headers.get("host")?.startsWith("localhost");

  if (isLocalhost) {
    return;
  }

  const cookieStore = cookies();
  const { value: accessToken } = cookieStore.get("my-access-token") || {};
  const { value: refreshToken } = cookieStore.get("my-refresh-token") || {};

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  const { user } = (await supabase.auth.getUser()).data;

  const temporary_admins = [
    "48588251-32e2-4ea7-9c48-c2d2bfa4f295", // riera
    "f3617cb6-a4ca-4fe5-bb9c-b9e466509de4", // ivanjob
    "f6139f0a-3f47-4ab0-a034-270a784bdb31", // maincc
  ];

  if (!user || !temporary_admins.includes(user.id)) {
    return NextResponse.json(
      { message: "Unauthorized access!" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|forms).*)",
  ],
};
