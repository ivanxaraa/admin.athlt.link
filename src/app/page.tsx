"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, User, Users } from "lucide-react";
import DashboardCard from "@/components/ui/dashboard-card";
import Heading1 from "@/components/ui/heading-1";
import { supabase } from "@/lib/supabase";
import { icon_size } from "@/utils/constants";

export default function Home() {
  const [cards, setCards] = useState<any>([]);

  const getCards = async () => {
    const { data } = await supabase.rpc("count_rows_tables");
    setCards([
      {
        label: "Users",
        value: data.users,
        icon: <Users {...icon_size.navbar} />,
      },
      {
        label: "Paid Members",
        value: data.subscriptions,
        icon: <BadgeCheck {...icon_size.navbar} />,
      },
      {
        label: "Athletes",
        value: data.athletes,
        icon: <User {...icon_size.navbar} />,
      },
      {
        label: "Clubs",
        value: data.clubs,
        icon: <User {...icon_size.navbar} />,
      },
    ]);

    const session = await supabase.auth.getSession();
    console.log({ session });

    const auth = await supabase.auth.getUser();
    console.log({ auth });

  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <main>
      <Heading1>Dashboard</Heading1>
      <div className="flex gap-4">
        {cards.map((card: any, index: number) => (
          <DashboardCard
            key={index}
            label={card.label}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </main>
  );
}
