"use client";

import { Button } from "@/components/ui/button";
import FormBuilder from "@/components/ui/form-builder";
import GroupForm from "@/components/ui/group-form";
import Heading1 from "@/components/ui/heading-1";
import { clubsControl } from "@/controllers/clubsControl";
import { teamsControl } from "@/controllers/teamsControl";
import { generic } from "@/utils/generic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
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

  const [team, setTeam] = useState<any>({
    team_code: generic.misc.code(6),
    team_code_paid: generic.misc.code(5),
  });

  const inputChange = (key: string, value: any) => {
    if (key === "username") value = value.replace(/[^\w]/g, "");
    setTeam((prev: any) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetch = async () => {
      const club = await clubsControl.get.byUsername(username);
      if (!club) {
        toast.error("Club not found");
        router.back();
        return;
      }
      setTeam((prev: any) => ({ ...prev, club: club.id }));
    };
    fetch();
  }, []);
  return (
    <>
      <Heading1 back="/teams">Create Team</Heading1>

      <div className="mt-4 rounded-lg flex flex-col gap-16">
        <FormBuilder fields={fields} data={team} inputChange={inputChange} />
        {/* buttons */}
        <GroupForm>
          <div className="flex justify-end items-center w-full col-span-2 gap-4">
            <Button
              onClick={() => {
                teamsControl.create(team, () => router.back());
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
