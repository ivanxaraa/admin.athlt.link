"use client";

import DashboardCard from "@/components/ui/dashboard-card";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { clubsControl } from "@/controllers/clubsControl";
import { app, env, icon_size } from "@/utils/constants";
import { UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import GroupForm from "@/components/ui/group-form";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { copy } from "@/utils/copy";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import selectors from "@/utils/selectors";
import RowManipulator from "@/components/ui/row-manipulator";
import { generic } from "@/utils/generic";
import FormBuilder from "@/components/ui/form-builder";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { teamsControl } from "@/controllers/teamsControl";

function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [steps, setSteps] = useState<"club" | "teams">("club");
  const [club, setClub] = useState<any>({
    form: true,
  });

  const inputChange = (key: string, value: any) => {
    if (key === "teams") {
      value = value.map((obj: any) => {
        obj.username = obj.username.replace(/[^\w]/g, "");
        return obj;
      });
    }

    if (key === "username") value = value.replace(/[^\w]/g, "");
    setClub((prev: any) => ({ ...prev, [key]: value }));
  };

  const [fieldsClub, setFieldsClub] = useState<any>({
    Details: [
      {
        id: "logo",
        field_type: "image",
        className: "sm:col-span-2",
      },
      {
        label: "Username",
        id: "username",
        placeholder: "Username",
      },
      {
        id: "name",
        label: "Club Name",
        placeholder: "Club name",
      },
      {
        id: "country",
        label: "Country",
        data: selectors.countries,
        field_type: "combobox",
      },
      {
        id: "state",
        label: "State",
        data: selectors.states,
        field_type: "combobox",
      },
      {
        id: "county",
        label: "County",
        data: selectors.counties,
        field_type: "combobox",
      },
      {
        id: "website",
        label: "Website",
        type: "text",
        placeholder: "www.example.com",
      },
    ],
    Socials: [
      {
        id: "instagram",
        label: "Instagram",
        placeholder: "www.instagram.com/username",
      },
      {
        id: "snapchat",
        label: "Snapchat",
        placeholder: "www.snapchat.com/username",
      },
      {
        id: "twitter",
        label: "X / Twitter",
        placeholder: "www.twitter.com/username",
      },
      {
        id: "tiktok",
        label: "Tiktok",
        placeholder: "www.tiktok.com/username",
      },
      {
        id: "socials",
        label: "Other Socials",
        className: "sm:col-span-2",
        field_type: "row-manipulator",
        onChange: inputChange,
        fields: [
          { key: "label", placeholder: "Label" },
          { key: "url", placeholder: "www.example.com" },
        ],
      },
    ],
    "Sponsors & Partners": [
      {
        id: "sponsors",
        label: "Sponsors & Partners",
        className: "sm:col-span-2",
        field_type: "row-manipulator",
        onChange: inputChange,
        fields: [
          { key: "name", placeholder: "Label" },
          { key: "url", placeholder: "www.example.com" },
        ],
      },
    ],
    Contacts: [
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "example@gmail.com",
      },
      {
        id: "phone",
        label: "Phone",
        type: "number",
        placeholder: "+351",
      },
    ],
  });

  const [fieldsTeam, setFieldsTeam] = useState<any>({
    Teams: [
      {
        id: "teams",
        label: "Add teams to your club",
        placeholder: "Team",
        className: "sm:col-span-2",
        field_type: "row-manipulator",
        fields: [
          {
            key: "username",
            label: "Username",
            placeholder: "Username",
          },
          {
            key: "name",
            label: "Team Name",
            placeholder: "Team name",
          },
          {
            key: "group_age",
            label: "Group Age",
            placeholder: "Group Age",
          },
          {
            key: "gender",
            label: "Gender",
            placeholder: "Gender",
          },
          {
            key: "sport",
            label: "Sport",
            placeholder: "Sport",
          },
        ],
      },
    ],
  });

  const save = async () => {
    let teams = club.teams || [];
    delete club.teams;

    // validate teams
    let invalid = null;
    for (const team of teams) {
      invalid = teamsControl.validate(team);
      if (invalid) break;
    }
    if (invalid) return invalid;

    // Club
    const club_id = await clubsControl.create(club);
    if (!club_id) return;

    // Teams
    if (teams) {
      teams = teams.map((team: any) => ({
        ...team,
        club: club_id,
        team_code: generic.misc.code(6),
        team_code_paid: generic.misc.code(5),
      }));
      const { error: teamsError } = await supabase.from("teams").insert(teams);
      console.log({ teamsError });
      if (teamsError) {
        await supabase.from("clubs").delete().eq("id", club_id);
        toast.error("Error occurred while creating teams");
        return;
      }
    }
    router.push(app.website_url);
  };

  return (
    <>
      <Heading1>Create club</Heading1>
      <div className="rounded-lg flex flex-col gap-8">
        {steps === "club" && (
          <>
            <FormBuilder
              fields={fieldsClub}
              data={club}
              inputChange={inputChange}
            />
            <GroupForm>
              <div className="flex justify-end items-center w-full col-span-2 gap-4">
                <Button
                  disabled={clubsControl.validate(club, false)}
                  onClick={() => setSteps("teams")}
                >
                  Next Step
                </Button>
              </div>
            </GroupForm>
          </>
        )}
        {steps === "teams" && (
          <>
            <FormBuilder
              fields={fieldsTeam}
              data={club}
              inputChange={inputChange}
            />
            <GroupForm>
              <div className="flex justify-end items-center w-full col-span-2 gap-4">
                <Button variant="outline" onClick={() => setSteps("club")}>
                  Previous
                </Button>
                <Button onClick={() => save()}>Create club</Button>
              </div>
            </GroupForm>
          </>
        )}
      </div>
    </>
  );
}

export default Page;
