import { cn } from "@/lib/utils";
import React from "react";

const GroupForm = ({ children, label, className }: any) => {
  return (
    <div className={`bg-white p-8 rounded-lg border`}>
      {label && <span className="">{label}</span>}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-2",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default GroupForm;
