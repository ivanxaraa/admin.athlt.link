import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     hello: "world",
//   });
// }

export async function DELETE(request: any, context: any) {
  const { id } = context?.params;

  const responseUsers = await supabase
    .from("user_profiles")
    .delete()
    .eq("id", id);
  const responseAthletes = await supabase
    .from("athletes")
    .delete()
    .eq("id", id);

  const responseAuth = await supabase.rpc("delete_user_by_id", { p_id: id });
  return NextResponse.json({
    responseUsers,
    responseAthletes,
    responseAuth,
  });
}
