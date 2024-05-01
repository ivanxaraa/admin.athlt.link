import React from "react";

const GroupForm = ({ children, label, className }: any) => {
  return (
    <div className={`bg-white p-8 rounded-lg border ${className}`}>
      {label && <span className="">{label}</span>}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-2">{children}</div>
    </div>
  );
};

export default GroupForm;
