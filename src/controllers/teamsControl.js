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
  create: async (teamsOrTeam) => {
    try {
      const teams = teamsOrTeam?.length ? teamsOrTeam : [teamsOrTeam];

      for (const team of teams) {
        if (teamsControl.validate(team)) {
          console.log("error team", team);
          throw new Error(`Invalid team data: ${team.name || "Unknown"}`);
        }
      }

      const teamsWithCodes = await Promise.all(
        teams.map(async (team) => ({
          ...team,
          team_code_invitation: await teamsControl.misc.code(5),
          team_code_paid: await teamsControl.misc.code(5),
          team_code: await teamsControl.misc.code(5),
        }))
      );

      const { data, error } = await supabase
        .from(TABLE)
        .insert(teamsWithCodes)
        .select();
      if (error) {
        throw new Error("Database insert operation failed");
      }

      teamsWithCodes.forEach((team, index) => {
        team.id = data[index].id;
        if (generic.misc.isFile(team.qrcode)) {
          teamsControl.misc.uploadImage("qrcode", team, BUCKET);
        }
        if (generic.misc.isFile(team.scan)) {
          teamsControl.misc.uploadImage("scan", team, BUCKET);
        }
      });

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
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
    code: async (size, text) => {
      let data;
      let code;

      do {
        code = generic.misc.code(size, text);
        ({ data } = await supabase
          .from("teams")
          .select()
          .or(
            `team_code.eq.${code},team_code_paid.eq.${code},team_code_invitation.eq.${code}`
          )
          .single());
      } while (data); // Repeat if data is not null

      return code;
    },
  },
};
