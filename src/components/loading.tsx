import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading({ className }: any) {
  return (
    <div className="fixed w-full">
      <LoaderCircle />
    </div>
  );
}
