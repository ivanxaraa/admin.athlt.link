import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "./button";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  back?: string;
  buttons?: {
    label: string;
    click?: () => void;
  }[];
};

const Heading1 = ({ children, back, buttons }: Props) => {
  return (
    <div className="flex h-10 items-center gap-2 font-light pb-4 w-full">
      {back && (
        <Link href={back} className="hover:bg-primary hover:text-white rounded-md p-0.5">
          <ChevronLeft size={16} strokeWidth={1} />
        </Link>
      )}
      {children}
      <div className="ml-auto flex gap-4">
        {buttons && buttons.map((button) => <Button key={button?.label} onClick={button.click}>{button?.label}</Button>)}
      </div>
    </div>
  );
};

export default Heading1;
