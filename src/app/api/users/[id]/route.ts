import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     hello: "world",
//   });
// }

export async function DELETE(request, context) {
  const { id } = context?.params;
  const response = await supabase.auth.admin.deleteUser(id);
  return NextResponse.json({
    response,
  });
}
