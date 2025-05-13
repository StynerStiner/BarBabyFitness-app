import React from "react";

interface SelectProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const Select = ({ className = "", children }: SelectProps) => {
  return <select className={`select ${className}`}>{children}</select>;
};

export const SelectTrigger = ({ className = "", children }: SelectProps) => {
  return <button className={`select-trigger ${className}`}>{children}</button>;
};

export const SelectContent = ({ className = "", children }: SelectProps) => {
  return <div className={`select-content ${className}`}>{children}</div>;
};

export const SelectItem = ({
  value,
  className = "",
  children,
}: SelectItemProps) => {
  return (
    <option value={value} className={`select-item ${className}`}>
      {children}
    </option>
  );
};

export const SelectValue = ({
  placeholder,
  className = "",
}: {
  placeholder: string;
  className?: string;
}) => {
  return <span className={`select-value ${className}`}>{placeholder}</span>;
};
