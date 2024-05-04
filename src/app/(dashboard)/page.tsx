"use client";

import { useEffect, useState } from "react";
import { Award, BadgeCheck, Building2, User, Users } from "lucide-react";
import DashboardCard from "@/components/ui/dashboard-card";
import Heading1 from "@/components/ui/heading-1";
import { supabase } from "@/lib/supabase";
import { icon_size } from "@/utils/constants";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardData {
  label: string;
  value: number;
  icon: JSX.Element;
}

export default function Home(): JSX.Element {
  const [cards, setCards] = useState<CardData[]>([]);

  const getCards = async () => {
    const { data } = await supabase.rpc("count_tables_dashboard");
    const cardData: CardData[] = [
      {
        label: "Total of Users",
        value: data.users,
        icon: <Users {...icon_size.navbar} />,
      },
      {
        label: "Total of Paid Members",
        value: data.subscriptions,
        icon: <BadgeCheck {...icon_size.navbar} />,
      },
      {
        label: "Total of Athletes",
        value: data.athletes,
        icon: <Award {...icon_size.navbar} />,
      },
      {
        label: "Total of Clubs",
        value: data.clubs,
        icon: <Building2 {...icon_size.navbar} />,
      },
    ];

    setCards(cardData);
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    <main>
      <Heading1>Dashboard</Heading1>
      <div className="flex gap-4 w-full">
        {cards.map((card: CardData, index: number) => (
          <Card key={index} className="w-full bg-primary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{card.value}</div>
              {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
