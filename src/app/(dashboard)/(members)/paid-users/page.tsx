"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { usersControl } from "@/controllers/usersControl";
import { useRouter } from "next/navigation";
import { app } from "@/utils/constants";

const Page = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any>([]);

  const getUsers = async () => {
    const data = await usersControl.getPaid();
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Heading1>Paid Users</Heading1>
      <DataTable
        columns={columns()}
        data={users}
        hide={{ columns: true }}
        rowClick={(row: any) =>
          router.push(`${app.website_url}/${row.username}`)
        }
      />
    </>
  );
};

export default Page;
