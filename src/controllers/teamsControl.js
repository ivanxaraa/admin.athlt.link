import { supabase } from "@/lib/supabase";
import { generic } from "@/utils/generic";
import { toast } from "sonner";
import { clubsControl } from "./clubsControl";
import { app } from "@/utils/constants";

const TABLE = "teams";
const BUCKET = "avatars_teams";

export const teamsControl = {
  validate: (team) => {
    const mandatory = ["username", "name"];
    const missing_field = mandatory.find((key) => !team[key]);
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
    if (generic.misc.isFile(team.qrcode))
      teamsControl.misc.uploadImage("qrcode", team, BUCKET);
    if (generic.misc.isFile(team.scan))
      teamsControl.misc.uploadImage("scan", team, BUCKET);
  },
  create: async (team, redirect) => {
    if (teamsControl.validate(team)) return;
    const { data, error } = await supabase.from(TABLE).insert(team).select();
    if (error) return toast.error("Something went wrong");
    team.id = data[0].id;
    toast.success(`Team created successfully!`);
    if (generic.misc.isFile(team.qrcode))
      teamsControl.misc.uploadImage("qrcode", team, BUCKET);
    if (generic.misc.isFile(team.scan))
      teamsControl.misc.uploadImage("scan", team, BUCKET);
    redirect();
  },
  delete: async (team) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", team.id);
    if (error) return toast.error("Something went wrong!");
    toast.success("Team deleted successfuly!");
  },
  misc: {
    uploadImage: async (key, data, bucket) => {
      console.log("upload");
      const filename = `${key}_${data.id}`;
      console.log(filename);
      const { error: errorLogo } = await supabase.storage
        .from(bucket)
        .upload(filename, data[key], {
          cacheControl: "no-cache",
          upsert: true,
        });
      if (errorLogo) toast.error("Error uploading image!");
      await supabase
        .from(TABLE)
        .update({
          [key]: `${app.storage_url}/${BUCKET}/${filename}`,
        })
        .eq("id", data.id);
    },
  },
};
