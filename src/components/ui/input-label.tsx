import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputLabel = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full h-10 border bg-white rounded-md border-input flex items-center px-3 py-2",
          className
        )}
      >
        <span className="text-xs">{prefix}</span>
        <input
          type={type}
          className={cn(
            "mb-[1px]",
            "flex h-10 !ring-0 w-full rounded-md bg-transparent px-1 py-2 text-xs file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50"
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputLabel.displayName = "Input";

export { InputLabel };
