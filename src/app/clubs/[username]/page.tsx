"use client";

import DashboardCard from "@/components/ui/dashboard-card";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { clubsControl } from "@/controllers/clubsControl";
import { env, icon_size } from "@/utils/constants";
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
import { toast } from "sonner";

function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
  const [club, setClub] = useState<any>({});
  const [teams, setTeams] = useState<any>([]);
  const [activals, setActivals] = useState<{ section: any }>({
    section: "Information",
  });

  const inputChange = (key: string, value: any) => {
    if (key === "username") value = value.replace(/[^\w]/g, "");
    setClub((prev: any) => ({ ...prev, [key]: value }));
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
    Payments: [
      {
        id: "affiliate_fee",
        label: "Affiliate Commission (%)",
        type: "number",
        placeholder: "%",
      },
      {
        id: "fee",
        label: "TeamLink Fee ($)",
        type: "number",
        placeholder: "$",
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
        className: "col-span-2",
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
        className: "col-span-2",
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

  const handleActivals = (key: string, data: any) => {
    setActivals((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  useEffect(() => {
    const fetch = async () => {
      const clubInfo = await clubsControl.get.byUsername(username);
      if (!clubInfo) {
        toast.error("Club not found");
        router.back();
        return;
      }
      setClub(clubInfo);
      const teamsInfo = await clubsControl.get.teams(clubInfo.id);
      setTeams(teamsInfo);
    };
    fetch();
  }, []);

  return (
    <>
      <Heading1
        back="/clubs"
        buttons={[
          { label: "Copy Admin Link", click: () => copy(club.associate_code) },
          {
            label: "Club Dashboard",
            click: () => router.push(`https://athlt.link/d/${club.username}`),
          },
        ]}
      >
        {club.name}
      </Heading1>

      {/* tabs */}
      <div className="flex items-center gap-4  mt-4">
        {["Information", "Teams"].map((section, index) => (
          <button
            key={index}
            onClick={() => handleActivals("section", section)}
            className={`px-6 py-2 text-xs rounded-full ${
              section === activals.section
                ? "bg-primary border-primary text-white"
                : "border bg-white"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* information */}
      {activals.section === "Information" && club.id && (
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
                      data={club[field.id]}
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
                      defaultValue={club[field.id]}
                      data={field.data}
                    />
                  ) : (
                    <Input
                      onChange={(e) => inputChange(field.id, e.target.value)}
                      type={field.type}
                      value={club[field.id]}
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
                  clubsControl.delete(club);
                  router.back();
                }}
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  clubsControl.update(club);
                  router.push(`${club.username}`);
                }}
              >
                Save Changes
              </Button>
            </div>
          </GroupForm>
        </div>
      )}

      {/* teams */}
      {activals.section === "Teams" && (
        <div className="bg-white p-8 mt-4">
          <span className="text-lg">Teams</span>
          <div className="mt-8">
            <DataTable
              columns={columns()}
              data={teams}
              hide={{ columns: true, filter: true }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
