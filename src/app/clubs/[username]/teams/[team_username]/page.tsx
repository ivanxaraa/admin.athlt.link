"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import FormBuilder from "@/components/ui/form-builder";
import FormRow from "@/components/ui/form-row";
import GroupForm from "@/components/ui/group-form";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import RowManipulator from "@/components/ui/row-manipulator";
import { teamsControl } from "@/controllers/teamsControl";
import { copy } from "@/utils/copy";
import { generic } from "@/utils/generic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page({
  params,
}: {
  params: { username: string; team_username: string };
}) {
  const { username, team_username } = params;
  const router = useRouter();
  const [team, setTeam] = useState<any>({});

  const inputChange = (key: string, value: any) => {
    if (key === "username") value = value.replace(/[^\w]/g, "");
    setTeam((prev: any) => ({ ...prev, [key]: value }));
  };

  const invite = (free = false) => {
    const code = free ? team.team_code : team.team_code_paid;
    const text = `Hey, you’ve been invited to join ${team.club.name} ${
      team.name
    } on ATHLT.

Use this link to connect to the team ${window.location.origin}/invite/${code}

If you already have an ATHLT account you can enter this code ${code} at your Dashboard.

The ATHLT profile is totally free and link it to the team costs only $${generic.number.toDecimal(
      team.club.fee
    )} for the full season.

For more information about ATHLT:
www.athlt.link`;

    copy(text);
  };

  const [fields, setFields] = useState<any>({
    Images: [
      {
        id: "qrcode",
        label: "QR Code",
        field_type: "image",
      },
      {
        id: "scan",
        label: "Scan",
        field_type: "image",
      },
    ],
    Details: [
      {
        label: "Username",
        id: "username",
        placeholder: "Username",
      },
      {
        id: "name",
        label: "Team Name",
        placeholder: "Team name",
      },
      {
        id: "group_age",
        label: "Group Age",
        placeholder: "Group Age",
      },
      {
        id: "gender",
        label: "Gender",
        placeholder: "Gender",
      },
      {
        id: "sport",
        label: "Sport",
        placeholder: "Sport",
      },
    ],
  });

  useEffect(() => {
    const fetch = async () => {
      const teamInfo = await teamsControl.getByUsername(team_username);
      if (!teamInfo) {
        toast.error("Club not found");
        router.back();
        return;
      }
      setTeam(teamInfo);
    };
    fetch();
  }, []);

  return (
    <>
      <Heading1
        back={`/clubs/${username}`}
        buttons={[
          { label: "Invite", click: () => invite(false) },
          {
            label: "Free Invite",
            click: () => invite(true),
          },
        ]}
      >
        {team.name}
      </Heading1>

      <div className="mt-4 rounded-lg flex flex-col gap-16">
        <FormBuilder fields={fields} data={team} inputChange={inputChange} />
        {/* buttons */}
        <GroupForm>
          <div className="flex justify-end items-center w-full col-span-2 gap-4">
            <Button
              variant="destructive"
              onClick={() => {
                teamsControl.delete(team);
                router.back();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                teamsControl.update(team);
                router.push(`${team.username}`);
              }}
            >
              Save Changes
            </Button>
          </div>
        </GroupForm>
      </div>
    </>
  );
}

export default Page;
