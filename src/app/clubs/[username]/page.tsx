"use client";

import DashboardCard from "@/components/ui/dashboard-card";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { clubsControl } from "@/controllers/clubsControl";
import { icon_size } from "@/utils/constants";
import { UsersRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import GroupForm from "@/components/ui/group-form";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const Information = ({ club }: any) => {
  console.log(club);
  
  return (
    <div className=" bg-white rounded-lg">
      <div className="flex flex-col gap-16">
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
            <Input type="number" />
          </FormRow>
          <FormRow label="State">
            <Input type="number" />
          </FormRow>
          <FormRow label="County">
            <Input type="number" />
          </FormRow>
          <FormRow label="Website">
            <Input type="text" placeholder="www.example.com" />
          </FormRow>
        </GroupForm>
        {/* payments */}
        <GroupForm label="Payments">
          <FormRow label="Affiliate Commission">
            <Input defaultValue={club.affiliate_fee} type="number" placeholder="%" />
          </FormRow>
          <FormRow label="TeamLink Fee">
            <Input defaultValue={club.fee} type="number" placeholder="$" />
          </FormRow>
        </GroupForm>
        {/* socials */}
        <GroupForm label="Socials">
          <FormRow label="Instagram">
            <Input defaultValue={club.instagram} placeholder="www.instagram.com/username" />
          </FormRow>
          <FormRow label="Snapchat">
            <Input defaultValue={club.snapchat} placeholder="www.snapchat.com/username" />
          </FormRow>
          <FormRow label="X / Twitter">
            <Input defaultValue={club.twitter} placeholder="www.twitter.com/username" />
          </FormRow>
          <FormRow label="Tiktok">
            <Input defaultValue={club.tiktok} placeholder="www.tiktok.com/username" />
          </FormRow>
        </GroupForm>
        {/* contacts */}
        <GroupForm label="Contacts">
          <FormRow label="Email">
            <Input defaultValue={club.email} type="email" placeholder="example@gmail.com" />
          </FormRow>
          <FormRow label="Snapchat">
            <Input defaultValue={club.phone} type="number" placeholder="+351" />
          </FormRow>
        </GroupForm>
      </div>
    </div>
  );
};

function Page({ params }: { params: { username: string } }) {
  const { username } = params;
  const [club, setClub] = useState<any>({});
  const [teams, setTeams] = useState<any>([]);
  const [activals, setActivals] = useState<{ section: any; }>({
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

  return (
    <>
    
      <Heading1
        back="/clubs"
        buttons={[{ label: "Copy Admin Link" }, { label: "Club Dashboard" }]}
      >
        {club.name}
      </Heading1>

      <div className="bg-white flex items-center gap-4 p-6 mt-4">
        {["Information", "Teams"].map((section, index) => (
        <button key={index} onClick={() => handleActivals('section', section)} className={`px-6 py-2 text-xs rounded-full ${section === activals.section ? 'bg-primary' : ''}`}>
          {section}
        </button>
        ))}
      </div>

      {activals.section === 'Information' && (
      <div className="bg-white p-8 mt-4">
        <span className="text-lg">Information</span>
        <div className="mt-8">
          <Information club={club} />
        </div>
      </div>
      )}

      {activals.section === 'Teams' && (
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
