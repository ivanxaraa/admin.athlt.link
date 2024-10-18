import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { app } from "@/utils/constants";
import { generic } from "@/utils/generic";
import axios from "axios";
import { toast } from "sonner";

const TABLE = "clubs";
const BUCKET = "avatars_clubs";

export const clubsControl = {
  get: {
    all: async () => {
      const { data, error } = await supabase.from(TABLE).select().order("name");
      return data || [];
    },

    byUsername: async (username) => {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq("username", username)
        .single();

      console.log({ data });

      return data;
    },

    teams: async (club_id) => {
      const { data, error } = await supabase
        .from("teams")
        .select()
        .eq("club", club_id)
        .order("order");

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
  validate: async (club, fieldsClub, setFieldsClub, alerts = true) => {
    if (club.username) {
      const { data } = await axios.post(`/api/unique-username`, club);
      if (!data.isUnique) {
        toast.error("This username is already in use", {
          description: "Please, try another one!",
        });
        return true;
      }
    }

    const mandatory = [
      "username",
      "name",
      "type",
      "phone",
      "email",
      "country",
      "state",
      "contact_name",
    ];
    const missing_fields = mandatory.filter((key) => !club[key]);

    if (missing_fields.length > 0 && setFieldsClub) {
      setFieldsClub((prev) => {
        const updatedFieldsClub = { ...prev };

        Object.keys(updatedFieldsClub).forEach((section) => {
          updatedFieldsClub[section] = updatedFieldsClub[section].map(
            (field) => {
              if (missing_fields.includes(field.id)) {
                return {
                  ...field,
                  labelClass: "missingFieldText",
                  className: "missingFieldBorder",
                };
              }
              return field;
            }
          );
        });

        return updatedFieldsClub;
      });
    }

    if (missing_fields.length > 0 && alerts) {
      toast.warning(
        `Fields '${missing_fields.join(", ")}' should not be empty`
      );
      return true;
    }
  },

  update: async (club, clubDefault) => {
    if (await clubsControl.validate(club)) return false;
    const { data, error } = await supabase
      .from(TABLE)
      .update(club)
      .eq("id", club.id);
    if (error) {
      toast.error("Something went wrong");
      return false;
    }
    toast.success(`Club updated successfully!`);
    if (generic.misc.isFile(club.logo))
      clubsControl.misc.uploadImage(club.logo, club.id, BUCKET);

    return true;
  },
  create: async (data) => {
    const logo = data.logo;
    delete data.logo;

    const { data: createdClub, error } = await supabase
      .from(TABLE)
      .insert(data)
      .select();

    if (error) {
      toast.error("Something went wrong");
      return;
    }

    const club = createdClub[0];

    if (generic.misc.isFile(logo)) {
      console.log("here");
      await clubsControl.misc.uploadImage(logo, club.id, BUCKET);
    }
    return club;
  },
  delete: async (club) => {
    const { error } = await supabase.from(TABLE).delete().eq("id", club.id);
    if (error) return toast.error("Something went wrong!");
    toast.success("Club deleted successfuly!");
  },
  misc: {
    uploadImage: async (file, id, bucket) => {
      console.log(file, id, bucket);

      const { error: errorLogo } = await supabase.storage
        .from(bucket)
        .upload(id, file, {
          cacheControl: "no-cache",
          upsert: true,
        });
      console.log(errorLogo);

      if (errorLogo) toast.error("Error uploading image!");
      const responseUpdate = await supabase
        .from(TABLE)
        .update({
          logo: `${app.storage_url}/${BUCKET}/${id}`,
        })
        .eq("id", id);

      console.log(`${app.storage_url}/${BUCKET}/${id}`);

      console.log({ responseUpdate });
    },
  },
};
