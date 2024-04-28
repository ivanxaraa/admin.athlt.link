import { supabase } from "@/lib/supabase";
import { athletesControl } from "./athletesControl";

const TABLE = "user_profiles";

export const usersControl = {
  get: async () => {
    const { data, error } = await supabase.from(TABLE).select();
    return usersControl.format(data);
  },

  getPaid: async () => {
    const { data, error } = await supabase.from("subscriptions").select("*, user_profiles(*)");
    return athletesControl.format(data);
  },

  format: (users) => {
    users = users.map((user) => {
      return {
        ...user,
        full_name: `${user.first_name} ${user.last_name}`,
      };
    });
    return users;
  },
};
