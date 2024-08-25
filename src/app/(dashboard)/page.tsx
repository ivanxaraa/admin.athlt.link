import React, { useEffect, useState } from "react";
import { generic } from "@/utils/generic";
import { Award, BadgeCheck, Building2, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading1 from "@/components/ui/heading-1";

const Page = async () => {
  const { data: cardsObject } = await supabase.rpc("count_tables_dashboard");
  const cards: any[] = [
    {
      label: "Total of Users",
      value: cardsObject.users,
      icon: Users,
    },
    {
      label: "Total of Paid Members",
      value: cardsObject.subscriptions,
      icon: BadgeCheck,
    },
    {
      label: "Total of Athletes",
      value: cardsObject.athletes,
      icon: Award,
    },
    {
      label: "Total of Clubs",
      value: cardsObject.clubs,
      icon: Building2,
    },
  ];

  return (
    <main>
      <Heading1>Dashboard</Heading1>
      <div className="flex gap-4 w-full">
        {cards.map((card: any, index: number) => {
          return (
            <Card key={index} className="w-full bg-primary text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
                {<card.icon className="size-4" strokeWidth={1} />}
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{card.value}</div>
                {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default Page;
