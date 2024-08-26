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
import { supabase } from "@/lib/supabase";
import { CLUBS_STATUS, TEAMS_STATUS } from "@/utils/constants";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface actionsProps {
  key?: string;
  label: string;
  click: Function;
}

export const columns = ({ actions }: { actions: actionsProps[] }) => [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const { original } = row;
      return (
        <Switch
          onCheckedChange={async (val) => {
            try {
              const { error } = await supabase
                .from("teams")
                .update({
                  status: val ? TEAMS_STATUS.ACTIVE : TEAMS_STATUS.DISABLED,
                })
                .eq("id", original.id);
              if (error) throw error;
              toast.success("Club updated successfuly");
            } catch (err) {
              console.log(err);
              toast.error("Error updating status");
            }
          }}
          defaultChecked={original.status === CLUBS_STATUS.ACTIVE}
        />
      );
    },
  },
  {
    accessorKey: "invitation_type",
    header: "Invitation Type",
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
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    action.key
                      ? action.click(action.key, original)
                      : action.click(original)
                  }
                  className="cursor-pointer"
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
