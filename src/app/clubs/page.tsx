"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { clubsControl } from "@/controllers/clubsControl";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [clubs, setClubs] = useState<any>([]);

  const getClubs = async () => {
    const data = await clubsControl.get.all();
    setClubs(data);
  };

  const actions = {
    view: (club: any) => {
      router.push(`clubs/${club.username}`);
    },
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <>
      <Heading1>Clubs</Heading1>
      <DataTable
        data={clubs}
        hide={{ columns: true }}
        columns={columns({
          actions: [{ label: "View", click: actions.view }],
        })}
        add={{
          label: "Create Club",
          click: () => router.push("clubs/create"),
        }}
        rowClick={(row: any) => router.push(`clubs/${row.username}`)}
      />
    </>
  );
};

export default Page;
