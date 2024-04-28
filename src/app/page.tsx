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
    const { data } = await supabase.rpc("count_tables_dashboard");
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

    const cookies = document.cookie
      .split(/\s*;\s*/)
      .map((cookie) => cookie.split("="));
    const accessTokenCookie = cookies.find((x) => x[0] == "my-access-token");
    const refreshTokenCookie = cookies.find((x) => x[0] == "my-refresh-token");

    if (accessTokenCookie && refreshTokenCookie) {
      await supabase.auth.setSession({
        access_token: accessTokenCookie[1],
        refresh_token: refreshTokenCookie[1],
      });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
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
