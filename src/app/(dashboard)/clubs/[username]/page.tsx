"use client";

import DashboardCard from "@/components/ui/dashboard-card";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { clubsControl } from "@/controllers/clubsControl";
import { app, env, icon_size } from "@/utils/constants";
import {
  GripVertical,
  Medal,
  PersonStanding,
  Plus,
  Tag,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import GroupForm from "@/components/ui/group-form";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { copy } from "@/utils/copy";
import { useRouter, useSearchParams } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import selectors from "@/utils/selectors";
import RowManipulator from "@/components/ui/row-manipulator";
import { toast } from "sonner";
import { generic } from "@/utils/generic";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Reorder, useDragControls } from "framer-motion";
import Link from "next/link";

const Item = ({ item, username }: any) => {
  const router = useRouter();
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}>
      <button className="flex items-center gap-4 w-full justify-center bg-white border rounded-lg p-4">
        <GripVertical onPointerDown={(e) => controls.start(e)} />
        <div
          className="flex items-center gap-4 w-full"
          onClick={() =>
            router.push(`/clubs/${username}/teams/${item.username}`)
          }
        >
          <Avatar className="size-8">
            <AvatarImage src={item.image} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-left whitespace-nowrap">
              {item.name}
            </span>
            <span className="text-left text-xs whitespace-nowrap">
              {item.username}
            </span>
          </div>
          <div className="flex items-center justify-evenly gap-2 w-full">
            <div className="flex items-center gap-2">
              <Tag className="size-4" strokeWidth={1.5} />
              <span className="text-xs">{item.invitation_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Medal className="size-4" strokeWidth={1.2} />
              <span className="text-xs">{item.sport}</span>
            </div>
            <div className="flex items-center gap-2">
              <PersonStanding className="size-4" strokeWidth={1.5} />
              <span className="text-xs">{item.gender}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Switch
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={async (val) => {
              try {
                const { error } = await supabase
                  .from("teams")
                  .update({ status: val })
                  .eq("id", item.id);

                if (error) throw error;

                toast.success(`Team modified successfully!`);
              } catch (err) {
                toast.error("Error!");
              }
            }}
            defaultChecked={item.status}
          />
        </div>
      </button>
    </Reorder.Item>
  );
};

function Page({ params }: { params: { username: string } }) {
  const { username } = params;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [club, setClub] = useState<any>({});
  const [teams, setTeams] = useState<any>([]);

  const sectionFromUrl = searchParams.get("section") || "Information";
  const [activals, setActivals] = useState<{ section: any }>({
    section: sectionFromUrl,
  });

  const inputChange = (key: string, value: any) => {
    if (key === "username") value = value.replace(/[^\w]/g, "");
    setClub((prev: any) => ({ ...prev, [key]: value }));
  };

  const [fields, setFields] = useState<any>({
    Details: [
      {
        id: "logo",
        field_type: "image",
        className: "col-span-2",
      },
      {
        id: "type",
        label: "Type",
        data: ["High School", "College", "Club"].map((x) => ({
          label: x,
          value: x,
        })),
        field_type: "combobox",
      },
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
      // {
      //   id: "county",
      //   label: "County",
      //   data: selectors.counties,
      //   field_type: "combobox",
      // },
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
        id: "contact_name",
        label: "Name *",
        type: "text",
        placeholder: "Contact Name",
      },
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

    // Update the URL without reloading the page
    const params = new URLSearchParams(searchParams);
    params.set("section", data);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const actions = {
    view: (team: any) => {
      router.push(`${username}/teams/${team.username}`);
    },
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

  const handleReorder = async (newOrder: any[]) => {
    try {
      setTeams(newOrder);

      const updates = newOrder.map((item: any, index: number) => ({
        ...item,
        order: index,
      }));

      const { error } = await supabase.from("teams").upsert(updates);
      if (error) throw error;
    } catch (err) {
      toast.error("Error");
    }
  };

  return (
    <>
      <Heading1
        back="/clubs"
        buttons={[
          {
            label: "Copy Admin Link",
            click: async () => {
              try {
                let code = club.associate_code;

                if (!code) {
                  code = generic.misc.code(6, club.username.substr(0, 3));

                  const { error } = await supabase
                    .from("clubs")
                    .update({ associate_code: code })
                    .eq("id", club.id);

                  if (error) {
                    toast.error(`Error updating associate code`);
                    return;
                  }

                  setClub((prev: any) => ({ ...prev, associate_code: code }));
                }

                copy(`${app.website_url}/associate/${code}`);
              } catch (err) {
                toast.error("Error");
              }
            },
          },
          {
            label: "Club Dashboard",
            click: () => router.push(`${app.website_url}/d/${club.username}`),
          },
        ]}
      >
        {club.name}
      </Heading1>

      {/* tabs */}
      <div className="flex items-center gap-4 mt-4">
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
                  ) : field.field_type === "image" ? (
                    <>
                      <Input
                        id={field.id}
                        className="hidden"
                        type="file"
                        onChange={(e) =>
                          e.target.files &&
                          inputChange(field.id, e.target.files[0])
                        }
                      />
                      <Avatar
                        onClick={() =>
                          document.getElementById(field.id)?.click()
                        }
                        className="size-24 cursor-pointer"
                      >
                        <AvatarImage
                          src={
                            generic.misc.isFile(club[field.id])
                              ? URL.createObjectURL(club[field.id])
                              : club[field.id]
                          }
                        />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </>
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
          <div className="flex items-center">
            <span className="text-lg">Teams</span>
            <Link className="ml-auto" href={`${username}/teams/create`}>
              <Button className="gap-2">
                <Plus className="size-4" />
                Create Team
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <Reorder.Group
              axis="y"
              values={teams}
              onReorder={handleReorder}
              className="flex flex-col gap-2"
            >
              {teams.map((item: any, index: any) => (
                <Item key={item.id} item={item} username={username} />
              ))}
            </Reorder.Group>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
