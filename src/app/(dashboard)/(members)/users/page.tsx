"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import Heading1 from "@/components/ui/heading-1";
import { usersControl } from "@/controllers/usersControl";
import { useRouter } from "next/navigation";
import { app } from "@/utils/constants";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any>([]);
  const [open, setOpen] = useState<any>(false);

  const columns = () => [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "avatar_url",
      header: "",
      cell: ({ row }: any) => {
        const { original } = row;
        return (
          <Avatar>
            <AvatarImage src={original.avatar_url} />
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
      accessorKey: "full_name",
      header: "Name",
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
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation(), setOpen(original);
                  }}
                  className="cursor-pointer !text-destructive "
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const getUsers = async () => {
    const data = await usersControl.get();
    setUsers(data);
  };

  const deleteUser = async () => {
    const user = open;
    const response = await axios.delete(`api/users/${user?.id}`);
    console.log(response);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => deleteUser()}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Heading1>Users</Heading1>
      <DataTable
        columns={columns()}
        data={users}
        hide={{ columns: true }}
        rowClick={(row: any) =>
          router.push(`${app.website_url}/${row.username}`)
        }
      />
    </>
  );
};

export default Page;
