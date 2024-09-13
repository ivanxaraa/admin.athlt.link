"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import Heading1 from "@/components/ui/heading-1";
import { clubsControl } from "@/controllers/clubsControl";
import { useRouter } from "next/navigation";
import { copy } from "@/utils/copy";
import { ClipboardPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState<any>([]);

  const fetch = async () => {
    const { data } = await supabase.from("partners").select();
    setData(data);
  };

  const actions = {
    view: (item: any) => {
      router.push(`partners/${item.name}`);
    },
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Heading1>Partners</Heading1>
      <DataTable
        data={data}
        hide={{ columns: true }}
        columns={columns({
          actions: [{ label: "View", click: actions.view }],
        })}
        buttons={[
          {
            label: "Create Partner",
            click: () => router.push("partners/create"),
          },
        ]}
        rowClick={(row: any) => router.push(`partners/${row.id}`)}
      />
    </>
  );
};

export default Page;
