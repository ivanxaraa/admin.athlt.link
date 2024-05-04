import React from "react";

const FormRow = ({ children, label, className = "" }: any) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className={`text-xs text-gray-600`}>{label}</span>}
      {children}
    </div>
  );
};

export default FormRow;
