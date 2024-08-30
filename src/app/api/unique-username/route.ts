import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const queryTable = async (table: string, data: any) => {
  const response = await supabase
    .from(table)
    .select("*")
    .eq("username", data.username)
    .neq("id", data.id);
  if (response.error) throw response.error;

  return response.data;
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // @ts-ignore
    const data = await req.json();

    if (!data.username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const [clubsData, userProfilesData, teamsData] = await Promise.all([
      queryTable("clubs", data),
      queryTable("user_profiles", data),
      queryTable("teams", data),
    ]);

    const usernameExists =
      (clubsData && clubsData.length > 0) ||
      (userProfilesData && userProfilesData.length > 0) ||
      (teamsData && teamsData.length > 0);

    return NextResponse.json({ isUnique: !usernameExists });
  } catch (error) {
    // @ts-ignore
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
