"use client";

import {
  Award,
  BadgeCheck,
  Book,
  BookOpen,
  Building2,
  Clock,
  Globe2,
  Layers,
  LayoutDashboard,
  Package,
  Tags,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { icon_size } from "@/utils/constants";
import Image from "next/image";
import Logo from "@/assets/img/Logo.png";

const DashboardNavbar = () => {
  const pathname = usePathname();
  const groups = [
    {
      links: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard {...icon_size.navbar} />,
          href: "/",
        },
      ],
    },
    {
      name: "Members",
      links: [
        {
          name: "All Users",
          icon: <Users {...icon_size.navbar} />,
          href: "/users",
        },
        {
          name: "Athletes",
          icon: <Award {...icon_size.navbar} />,
          href: "/athletes",
        },
        {
          name: "Paid Members",
          icon: <BadgeCheck {...icon_size.navbar} />,
          href: "/paid-users",
        },
      ],
    },
    {
      name: "Organizations",
      links: [
        {
          name: "Clubs",
          icon: <Building2 {...icon_size.navbar} />,
          href: "/clubs",
        },
        {
          name: "Teams",
          icon: <UsersRound {...icon_size.navbar} />,
          href: "/teams",
        },
      ],
    },
  ];
  return (
    <div className="fixed left-0 top-0 h-full w-[220px] bg-foreground">
      <div className="flex flex-col gap-8 px-4 py-8">
        <div className="px-3">
          <Image src={Logo} alt="Logo" className="size-6" />
        </div>
        <div className="flex flex-col gap-8">
          {groups.map((group: any, index: number) => (
            <div key={index} className="flex flex-col gap-2">
              {group.name && (
                <span className="text-xs text-gray-500">{group.name}</span>
              )}
              {group.links.map((link: any) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex w-full items-center gap-2 rounded-md p-3 text-left text-xs font-medium ${
                    (pathname === "/" && link.href === "/") ||
                    (pathname.startsWith(link.href) && link.href !== "/")
                      ? "bg-primary text-white"
                      : "hover:bg-primary/20"
                  }`}
                >
                  <div>{link.icon}</div>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute bottom-8 p-2 w-full">
          <div className="flex">
            <div className="size-4 bg-green-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
