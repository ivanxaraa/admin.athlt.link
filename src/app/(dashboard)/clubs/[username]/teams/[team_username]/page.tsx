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
import { supabase } from "@/lib/supabase";
import { GENDERS, TEAMS_INVIATION_TYPES, app } from "@/utils/constants";
import { copy } from "@/utils/copy";
import { generic } from "@/utils/generic";
import selectors from "@/utils/selectors";
import { getTextInvitation } from "@/utils/texts";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { text } from "stream/consumers";

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

  const invite = async (type: "paid" | "free_verification" | "free") => {
    let text: string;

    switch (type) {
      case "paid":
        text = getTextInvitation.paid(team.club, team, team.team_code_paid);
        break;

      case "free_verification":
        text = getTextInvitation.freeVerification(
          team.club,
          team,
          team.team_code_invitation
        );
        break;

      case "free":
        text = getTextInvitation.free(team.club, team, team.team_code);
        break;

      default:
        toast.error("Something went wrong!");
        return;
    }

    copy(text);
  };

  const [fields, setFields] = useState<any>({
    // Images: [
    //   {
    //     id: "qrcode",
    //     label: "QR Code",
    //     field_type: "image",
    //   },
    //   {
    //     id: "scan",
    //     label: "Scan",
    //     field_type: "image",
    //   },
    // ],
    Details: [
      {
        id: "invitation_type",
        label: "Invitation Type",
        data: Object.keys(TEAMS_INVIATION_TYPES).map((key) => {
          const type =
            TEAMS_INVIATION_TYPES[key as keyof typeof TEAMS_INVIATION_TYPES];
          return {
            label: type,
            value: type,
          };
        }),
        field_type: "combobox",
      },
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
        field_type: "combobox",
        data: GENDERS,
      },
      {
        id: "sport",
        label: "Sport",
        placeholder: "Sport",
        field_type: "combobox",
        data: selectors.sports,
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

  // const queryImageInvoice = useQuery({
  //   queryKey: ['invoice_image', invoiceId],
  //   queryFn: async () => {
  //     return await getImage(
  //       CATALYST_FILESTORE_FOLDERS.invoices,
  //       queryInvoice.data.proofFilestoreId,
  //     );
  //   },
  //   enabled: !!queryInvoice.isSuccess && !!queryInvoice.data.proofFilestoreId,
  // });

  return (
    <>
      <Heading1
        back={`/clubs/${username}`}
        buttons={[
          { label: "Invite", click: () => invite("paid") },
          {
            label: "Free Invite",
            click: () => invite("free"),
          },
          {
            label: "Free Verification",
            click: () => invite("free_verification"),
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
