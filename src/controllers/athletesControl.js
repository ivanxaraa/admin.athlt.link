import { supabase } from "@/lib/supabase";

const TABLE = "athletes";

export const athletesControl = {
  get: async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, user_profiles(*)");
    return athletesControl.format(data);
  },

  format: (athletes) => {
    athletes = athletes.map((athlete) => {
      return {
        ...athlete,
        ...athlete.user_profiles,
        full_name: `${athlete.user_profiles?.first_name} ${athlete.user_profiles?.last_name}`,
      };
    });
    return athletes;
  },
};
