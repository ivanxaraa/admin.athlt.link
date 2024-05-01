import { supabase } from "@/lib/supabase";

const TABLE = "teams";

export const teamsControl = {
  get: async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, club(*)")
      .order("name", { ascending: true });
    return data || [];
  },
};
