import { DataTable } from "@/components/ui/data-table";
import React from "react";
import Heading1 from "@/components/ui/heading-1";
import { athletesControl } from "@/controllers/athletesControl";
import { columns } from "./columns";

const Page = async () => {
  const athletes = await athletesControl.get();
  return (
    <>
      <Heading1>Athletes</Heading1>
      <DataTable columns={columns} data={athletes} hide={{ columns: true }} />
    </>
  );
};

export default Page;
