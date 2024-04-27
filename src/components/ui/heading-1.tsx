import React, { ReactNode } from "react";

type Heading1Props = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const Heading1 = ({ children }: Heading1Props) => {
  return (
    <div className="flex items-center gap-2 font-light pb-4">{children}</div>
  );
};

export default Heading1;
