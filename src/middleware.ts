import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "./lib/supabase";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // if(request.nextUrl.pathname === "/clubs")
  // return NextResponse.redirect(new URL("/", request.url));
  const cookieStore = cookies();
  console.log(cookieStore);

  return NextResponse.json(
    { message: "Auth required", cookies: cookieStore.toString() },
    { status: 401 }
  );
}

export const config = {
  matcher: "/clubs",
};
