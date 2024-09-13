"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = (caller?: { handleActivals: Function }) => [
  {
    accessorKey: "qrcode",
    header: "",
    cell: ({ row }: any) => {
      const { original } = row;
      return (
        <Avatar>
          <AvatarImage src={original.qrcode} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sport",
    header: "Sport",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }: any) => {
      const { original } = row;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
