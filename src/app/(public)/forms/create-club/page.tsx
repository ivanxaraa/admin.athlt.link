"use client";

import Heading1 from "@/components/ui/heading-1";
import { clubsControl } from "@/controllers/clubsControl";
import { app } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import GroupForm from "@/components/ui/group-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import selectors from "@/utils/selectors";
import { generic } from "@/utils/generic";
import FormBuilder from "@/components/ui/form-builder";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { teamsControl } from "@/controllers/teamsControl";
import axios from "axios";
import TemplateNewClub from "@/components/templates/new-club";

function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [steps, setSteps] = useState<"club" | "teams">("club");
  const [club, setClub] = useState<any>({
    form: true,
    type: "Club",
  });

  const inputChange = (key: string, value: any) => {
    if (key === "teams") {
      value = value.map((obj: any) => {
        if (obj.username) obj.username = obj.username.replace(/[^\w]/g, "");
        return obj;
      });
    }

    if (key === "username") value = value.replace(/[^\w]/g, "");
    setClub((prev: any) => ({ ...prev, [key]: value }));
  };

  const getFieldsClub = () => ({
    Details: [
      {
        id: "logo",
        field_type: "image",
        className: "sm:col-span-2",
      },
      {
        id: "type",
        label: "Type *",
        data: ["High School", "College", "Club"].map((x) => ({
          label: x,
          value: x,
        })),
        field_type: "combobox",
      },
      {
        label: "Username *",
        id: "username",
        placeholder: "Username",
        prefix: "athlt.link/",
        field_type: "prefix",
      },
      {
        id: "name",
        label: `${club.type || "Club"} Name *`, // Default to "Club" if club.type is undefined
        placeholder: `${club.type || "Club"} name`,
      },
      {
        id: "country",
        label: "Country *",
        data: selectors.countries,
        field_type: "combobox",
      },
      {
        id: "state",
        label: "State *",
        data: selectors.states,
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
        id: "contact_name",
        label: "Name *",
        type: "text",
        placeholder: "Contact Name",
      },
      {
        id: "email",
        label: "Email *",
        type: "email",
        placeholder: "example@gmail.com",
      },
      {
        id: "phone",
        label: "Phone *",
        type: "number",
        placeholder: "+1",
      },
    ],
  });

  const [fieldsClub, setFieldsClub] = useState(getFieldsClub);

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
            key: "sport",
            label: "Sport",
            placeholder: "Sport",
            data: selectors.sports,
            field_type: "combobox",
          },
          {
            key: "name",
            label: "Team Name",
            placeholder: "Team name",
          },
          {
            key: "username",
            label: "Username",
            placeholder: "Username",
            prefix: "athlt.link/",
          },
          {
            key: "group_age",
            label: "Group Age",
            placeholder: "Group Age",
          },
          {
            key: "gender",
            label: "Gender",
            data: ["Male", "Female", "Co-ed"].map((x) => ({
              label: x,
              value: x,
            })),
            placeholder: "Gender",
            field_type: "combobox",
          },
        ],
      },
    ],
  });

  const save = async () => {
    try {
      let teams = club.teams || [];
      delete club.teams;

      // Validate teams
      let invalid = null;
      for (const team of teams) {
        invalid = teamsControl.validate(team);
        if (invalid) break;
      }
      if (invalid) return invalid;

      // Create Club
      const createdClub = await clubsControl.create(club);
      if (!createdClub.id) {
        toast.error("Error occurred while creating the club");
        return;
      }

      // Prepare Teams
      if (teams.length > 0) {
        const teamsWithClub = teams.map((team: any) => ({
          ...team,
          club: createdClub.id,
        }));
        // Create Teams
        const createdTeams = await teamsControl.create(teamsWithClub);
        if (!createdTeams) {
          await supabase.from("clubs").delete().eq("id", createdClub.id);
          toast.error("Error occurred while creating teams");
          return;
        }
      }

      // Send Notification
      await axios.post("/api/send", {
        to: ["agent@athlt.link", "paivssantos@gmail.com", "riera@athlt.link"],
        subject: "ATHLT - New Club",
        template: "TemplateNewClub",
        props: { club: createdClub },
      });

      toast.success("Your club has been created", {
        description:
          "We will review it and contact you as soon as possible. Thanks",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push(app.website_url);
      }, 2000);
    } catch (err) {
      console.error("An error occurred:", err);
      toast.error("Error, please try again!");
    }
  };

  useEffect(() => {
    setFieldsClub(getFieldsClub());
  }, [club.type]);

  return (
    <>
      <Heading1>Create {club.type}</Heading1>
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
                  onClick={async () => {
                    if (
                      await clubsControl.validate(
                        club,
                        fieldsClub,
                        setFieldsClub
                      )
                    )
                      return;
                    setSteps("teams");
                  }}
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
              className="sm:grid-cols-1"
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
