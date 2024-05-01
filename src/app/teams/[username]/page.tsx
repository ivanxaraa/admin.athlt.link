"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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

function Page({ params }: { params: { username: string } }) {
  const { username } = params;
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
    Details: [
      {
        label: "Username",
        id: "username",
      },
      {
        id: "name",
        label: "Club Name",
        placeholder: "Club name",
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
      const teamInfo = await teamsControl.getByUsername(username);
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
        back="/teams"
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
        {Object.entries(fields).map(([section, fieldsArray]: any, index) => (
          <GroupForm key={index} label={section}>
            {fieldsArray.map((field: any, idx: number) => (
              <FormRow
                key={idx}
                label={field.label}
                className={field.className}
              >
                {field.field_type === "row-manipulator" ? (
                  <RowManipulator
                    id={field.id}
                    data={team[field.id]}
                    onChange={field.onChange}
                  >
                    {field.fields.map((innerField: any, innerIdx: any) => (
                      <Input
                        key={innerField.key}
                        placeholder={innerField.placeholder}
                      />
                    ))}
                  </RowManipulator>
                ) : field.field_type === "combobox" ? (
                  <Combobox
                    id={field.id}
                    onChange={inputChange}
                    defaultValue={team[field.id]}
                    data={field.data}
                  />
                ) : (
                  <Input
                    onChange={(e) => inputChange(field.id, e.target.value)}
                    type={field.type}
                    value={team[field.id]}
                    placeholder={field.placeholder}
                  />
                )}
              </FormRow>
            ))}
          </GroupForm>
        ))}
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
