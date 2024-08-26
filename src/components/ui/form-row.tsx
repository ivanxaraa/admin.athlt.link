import { cn } from "@/lib/utils";
import React from "react";

const FormRow = ({ children, label, className = "", labelClass }: any) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className={cn("text-xs text-gray-600", labelClass)}>{label}</span>
      )}
      {children}
    </div>
  );
};

export default FormRow;
