import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "./lib/supabase";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // if(request.nextUrl.pathname === "/clubs")
  // return NextResponse.redirect(new URL("/", request.url));
  const cookieStore = cookies();
  const accessToken = cookieStore.get("my-access-token");
  const refreshToken = cookieStore.get("my-refresh-token");
  console.log(accessToken);
  console.log(refreshToken);

  return NextResponse.json(
    { message: "Auth required", accessToken, refreshToken },
    { status: 401 }
  );
}

export const config = {
  matcher: "/clubs",
};

// // set session
// const cookies = Object.fromEntries(
//   document.cookie.split("; ").map((cookie) => cookie.split("="))
// );
// const accessToken = cookies["my-access-token"];
// const refreshToken = cookies["my-refresh-token"];

// if (accessToken && refreshToken) {
//   await supabase.auth.setSession({
//     access_token: accessToken,
//     refresh_token: refreshToken,
//   });
// }

// // get  user
// const {
//   data: { user },
// } = await supabase.auth.getUser();
// console.log(user);
