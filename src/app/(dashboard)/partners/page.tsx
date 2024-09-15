"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { GripVertical, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Heading1 from "@/components/ui/heading-1";
import { Reorder, useDragControls } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Item = ({ item }: any) => {
  const router = useRouter();
  const controls = useDragControls();

  return (
    <Reorder.Item
      id={item.id}
      key={item.id}
      value={item}
      dragListener={false}
      dragControls={controls}
    >
      <button className="flex items-center gap-4 w-full justify-center bg-white border rounded-lg p-4">
        <GripVertical onPointerDown={(e) => controls.start(e)} />
        <div
          className="flex gap-4 w-full"
          onClick={() => router.push(`/partners/${item.id}`)}
        >
          <Avatar className="size-8">
            <AvatarImage src={item.image} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-left">{item.name}</span>
            <span className="text-left text-xs">{item.description}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Switch
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={async (val) => {
              try {
                const { error } = await supabase
                  .from("partners")
                  .update({ status: val })
                  .eq("id", item.id);

                if (error) throw error;

                toast.success(`Partner modified successfully!`);
              } catch (err) {
                toast.error("Error!");
              }
            }}
            defaultChecked={item.status}
          />
        </div>
      </button>
    </Reorder.Item>
  );
};

const Page = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("partners").select().order("order");
      setData(data || []);
    };

    fetch();
  }, []);

  const handleReorder = async (newOrder: any[]) => {
    try {
      setData(newOrder);

      const updates = newOrder.map((item: any, index: number) => ({
        ...item,
        order: index,
      }));

      const { error } = await supabase.from("partners").upsert(updates);
      if (error) throw error;
    } catch (err) {
      toast.error("Error");
    }
  };

  return (
    <>
      <Heading1>Partners</Heading1>
      <div className="w-full">
        <div className="flex items-center py-4 gap-4">
          <Input placeholder="Filter by name..." className="max-w-sm" />
          <Link className="ml-auto" href="/partners/create">
            <Button className="ml-auto">
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Reorder Group */}
        <Reorder.Group
          axis="y"
          values={data}
          onReorder={handleReorder}
          className="flex flex-col gap-2"
        >
          {data.map((item, index) => (
            <Item key={item.id} item={item} />
          ))}
        </Reorder.Group>
      </div>
    </>
  );
};

export default Page;
