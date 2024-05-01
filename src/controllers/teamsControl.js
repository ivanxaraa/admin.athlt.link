import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TABLE = "teams";

export const teamsControl = {
  validate: (club) => {
    const mandatory = ["username", "name"];
    const missing_field = mandatory.find((key) => !club[key]);
    if (missing_field) {
      toast.warning(`Field '${missing_field}' should not be empty`);
    }
    return !!missing_field;
  },
  get: async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, club(*)")
      .order("name", { ascending: true });
    return data || [];
  },
  getByUsername: async (username) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*, club(*)")
      .eq("username", username)
      .single();
    return data || [];
  },
  update: async (team) => {
    delete team.club;
    if (teamsControl.validate(team)) return;
    const { data, error } = await supabase
      .from(TABLE)
      .update(team)
      .eq("id", team.id);
    if (error) return toast.error("Something went wrong");
    toast.success(`Club updated successfully!`);
  },
  create: async (team) => {
    if (teamsControl.validate(team)) return;
    const { data, error } = await supabase.from(TABLE).insert(team);
    if (error) return toast.error("Something went wrong");
    toast.success(`Team created successfully!`);
  },
  delete: async (team) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", team.id);
    if (error) return toast.error("Something went wrong!");
    toast.success("Team deleted successfuly!");
  },
};
