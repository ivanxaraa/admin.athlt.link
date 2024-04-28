import { supabase } from "@/lib/supabase";

const TABLE = "clubs";

export const clubsControl = {
  get: {
    all: async () => {
      const { data, error } = await supabase.from(TABLE).select();
      return data || [];
    },

    byUsername: async (username) => {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq("username", username)
        .single();
      return data;
    },

    teams: async (club_id) => {
      const { data, error } = await supabase
      .from("teams")
      .select()
      .eq("club", club_id)

    return data;
    },

    cards: async (club_id) => {
      const response = await supabase
        .from("teams")
        .select("*", { count: "exact", head: true })
        .eq("club", club_id);
      console.log(response);
      return response.count;

      // const response = await supabase.rpc("get_teams_and_athletes1", {
      //   club_id: club_id,
      // });
      // console.log(response);
    },
  },
};
