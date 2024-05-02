import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "./lib/supabase";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // if(request.nextUrl.pathname === "/clubs")
  // return NextResponse.redirect(new URL("/", request.url));
  const cookieStore = cookies();
  const accessToken = cookieStore.get("my-access-token")?.value;
  const refreshToken = cookieStore.get("my-refresh-token")?.value;

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const temporary_admins: string[] = [
    // riera
    "48588251-32e2-4ea7-9c48-c2d2bfa4f295",
    // ivanjob
    "f3617cb6-a4ca-4fe5-bb9c-b9e466509de4",
    // maincc
    "f6139f0a-3f47-4ab0-a034-270a784bdb31",
  ];

  if (!user || !temporary_admins.includes(user.id)) {
    return NextResponse.json(
      { message: "Unauthorized access!" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/",
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
