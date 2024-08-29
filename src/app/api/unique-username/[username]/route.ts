import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const queryTable = async (table: string, username: string) => {
  const response = await supabase
    .from(table)
    .select("*")
    .eq("username", username);
  if (response.error) throw response.error;

  return response.data;
};

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // @ts-ignore
    const { username } = res.params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const [clubsData, userProfilesData, teamsData] = await Promise.all([
      queryTable("clubs", username),
      queryTable("user_profiles", username),
      queryTable("teams", username),
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
