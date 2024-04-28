"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { athletesControl } from "@/controllers/athletesControl";

const page = () => {
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
      <DataTable columns={columns()} data={athletes} hide={{ columns: true }} />
    </>
  );
};

export default page;
