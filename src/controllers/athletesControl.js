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

    athletes.sort((a, b) => {
      const nameA = a.full_name.toUpperCase(); // Convert names to uppercase
      const nameB = b.full_name.toUpperCase();
      if (nameA < nameB) {
        return -1; // If nameA comes before nameB, return -1
      }
      if (nameA > nameB) {
        return 1; // If nameA comes after nameB, return 1
      }
      return 0; // If names are equal
    });

    return athletes;
  },
};
