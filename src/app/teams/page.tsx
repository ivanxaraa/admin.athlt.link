"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { teamsControl } from "@/controllers/teamsControl";

const Page = () => {
  const [teams, setTeams] = useState<any>([]);

  const getClubs = async () => {
    const data = await teamsControl.get();
    setTeams(data);
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <>
      <Heading1>Teams</Heading1>
      <DataTable columns={columns()} data={teams} hide={{ columns: true }} />
    </>
  );
};

export default Page;
