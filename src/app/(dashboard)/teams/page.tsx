"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { teamsControl } from "@/controllers/teamsControl";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [teams, setTeams] = useState<any>([]);

  const getClubs = async () => {
    const data = await teamsControl.get();
    setTeams(data);
  };

  const actions = {
    view: (team: any) => {
      router.push(`teams/${team.username}`);
    },
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <>
      <Heading1>Teams</Heading1>
      <DataTable
        columns={columns({ actions: [{ label: "View", click: actions.view }] })}
        data={teams}
        hide={{ columns: true }}
        buttons={[
          {
            label: "Create Team",
            click: () => router.push("teams/create"),
          },
        ]}
      />
    </>
  );
};

export default Page;
