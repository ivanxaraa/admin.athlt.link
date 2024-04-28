"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { usersControl } from "@/controllers/usersControl";

const Page = () => {
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
      <DataTable columns={columns()} data={users} hide={{ columns: true }} />
    </>
  );
};

export default Page;
