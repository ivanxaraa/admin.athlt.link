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

function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
  const [club, setClub] = useState<any>({});
  const [teams, setTeams] = useState<any>([]);
  const [activals, setActivals] = useState<{ section: any }>({
    section: "Information",
  });

  const fetch = async () => {
    const clubInfo = await clubsControl.get.byUsername(username);
    setClub(clubInfo);
    const teamsInfo = await clubsControl.get.teams(clubInfo.id);
    setTeams(teamsInfo);
  };

  const handleActivals = (key: string, data: any) => {
    setActivals((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  useEffect(() => {
    fetch();
  }, []);

  const inputChange = (key: string, value: any) => {
    console.log(key, value);
  };

  
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
          {/* club */}
          <GroupForm label="Details">
            <FormRow className="col-span-2" label="">
              <Avatar className="size-24 rounded-md">
                <AvatarImage src={club.logo} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </FormRow>
            <FormRow label="Username">
              <Input defaultValue={club.username} />
            </FormRow>
            <FormRow label="Club Name">
              <Input defaultValue={club.name} placeholder="Club name" />
            </FormRow>
            <FormRow label="Country">
              <Combobox
                defaultValue={club.country}
                data={selectors.countries}
              />
            </FormRow>
            <FormRow label="State">
              <Combobox defaultValue={club.state} data={selectors.states} />
            </FormRow>
            <FormRow label="County">
              <Combobox defaultValue={club.county} data={selectors.counties} />
            </FormRow>
            <FormRow label="Website">
              <Input
                type="text"
                defaultValue={club.website}
                placeholder="www.example.com"
              />
            </FormRow>
          </GroupForm>
          {/* payments */}
          <GroupForm label="Payments">
            <FormRow label="Affiliate Commission">
              <Input
                defaultValue={club.affiliate_fee}
                type="number"
                placeholder="%"
              />
            </FormRow>
            <FormRow label="TeamLink Fee">
              <Input defaultValue={club.fee} type="number" placeholder="$" />
            </FormRow>
          </GroupForm>
          {/* socials */}
          <GroupForm label="Socials">
            <FormRow label="Instagram">
              <Input
                defaultValue={club.instagram}
                placeholder="www.instagram.com/username"
              />
            </FormRow>
            <FormRow label="Snapchat">
              <Input
                defaultValue={club.snapchat}
                placeholder="www.snapchat.com/username"
              />
            </FormRow>
            <FormRow label="X / Twitter">
              <Input
                defaultValue={club.twitter}
                placeholder="www.twitter.com/username"
              />
            </FormRow>
            <FormRow label="Tiktok">
              <Input
                defaultValue={club.tiktok}
                placeholder="www.tiktok.com/username"
              />
            </FormRow>
            <FormRow className="col-span-2" label="Other Socials">
              <RowManipulator
                id="socials"
                data={club.socials}
                onChange={inputChange}
              >
                <Input key="label" placeholder="Label" />
                <Input key="url" placeholder="url" />
              </RowManipulator>
            </FormRow>
          </GroupForm>
          {/* contacts */}
          <GroupForm label="Contacts">
            <FormRow label="Email">
              <Input
                defaultValue={club.email}
                type="email"
                placeholder="example@gmail.com"
              />
            </FormRow>
            <FormRow label="Phone">
              <Input
                defaultValue={club.phone}
                type="number"
                placeholder="+351"
              />
            </FormRow>
          </GroupForm>
          {/* buttons */}
          <GroupForm>
            <div className="flex justify-end items-center w-full col-span-2 gap-4">
              <Button variant="destructive">Delete</Button>
              <Button>Save Changes</Button>
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
