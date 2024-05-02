"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { athletesControl } from "@/controllers/athletesControl";
import { useRouter } from "next/navigation";
import { app } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const [athletes, setAthletes] = useState<any>([]);

  const getAthletes = async () => {
    const data = await athletesControl.get();
    console.log(data);

    setAthletes(data);
  };

  useEffect(() => {
    getAthletes();
  }, []);

  return (
    <>
      <Heading1>Athletes</Heading1>
      <DataTable
        columns={columns()}
        data={athletes}
        hide={{ columns: true }}
        rowClick={(row: any) =>
          router.push(`${app.website_url}/${row.username}`)
        }
      />
    </>
  );
};

export default Page;
