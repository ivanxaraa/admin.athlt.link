import { supabase } from "@/lib/supabase";
import { app } from "@/utils/constants";
import { generic } from "@/utils/generic";
import { toast } from "sonner";

const TABLE = "clubs";
const BUCKET = "avatars_clubs";

export const clubsControl = {
  get: {
    all: async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .order("name", { ascending: true });
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
        .eq("club", club_id);

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
  validate: (club, alerts = true) => {
    const mandatory = ["username", "name"];
    const missing_field = mandatory.find((key) => !club[key]);
    if (missing_field && alerts) {
      toast.warning(`Field '${missing_field}' should not be empty`);
    }
    return !!missing_field;
  },
  update: async (club) => {
    if (clubsControl.validate(club)) return;
    const { data, error } = await supabase
      .from(TABLE)
      .update(club)
      .eq("id", club.id);
    if (error) return toast.error("Something went wrong");
    toast.success(`Club updated successfully!`);
    if (generic.misc.isFile(club.logo))
      clubsControl.misc.uploadImage(club.logo, club.id, BUCKET);
  },
  create: async (club, redirect) => {
    if (clubsControl.validate(club)) return;
    const { data, error } = await supabase.from(TABLE).insert(club).select();
    if (error) {
      toast.error("Something went wrong");
      return;
    }
    const club_id = data[0].id;
    toast.success(`Club created successfully!`);
    if (generic.misc.isFile(club.logo))
      clubsControl.misc.uploadImage(club.logo, club_id, BUCKET);
    if (redirect) redirect();
    return club_id;
  },
  delete: async (club) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", club.id);
    if (error) return toast.error("Something went wrong!");
    toast.success("Club deleted successfuly!");
  },
  misc: {
    uploadImage: async (file, id, bucket) => {
      const { error: errorLogo } = await supabase.storage
        .from(bucket)
        .upload(id, file, {
          cacheControl: "no-cache",
          upsert: true,
        });
      if (errorLogo) toast.error("Error uploading image!");
      await supabase
        .from(TABLE)
        .update({
          logo: `${app.storage_url}/${BUCKET}/${id}`,
        })
        .eq("id", id);
    },
  },
};
