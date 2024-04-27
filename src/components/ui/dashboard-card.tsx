import { icon_size } from "@/utils/constants";
import React from "react";

function DashboardCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <button className="bg-white p-6 relative text-left rounded-lg w-[300px]">
      <div className="relative flex flex-col justify-center">
        <span className="font-light text-base">{label}</span>
        <span className="font-bold text-2xl">{value}</span>
        <div className="absolute right-0">{icon}</div>
      </div>
    </button>
  );
}

export default DashboardCard;
