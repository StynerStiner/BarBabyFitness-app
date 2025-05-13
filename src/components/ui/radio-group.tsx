import React from "react";

interface RadioGroupProps {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

interface RadioGroupItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  id: string;
  className?: string;
}

export const RadioGroup = ({
  defaultValue,
  className = "",
  children,
}: RadioGroupProps) => {
  return (
    <div
      className={`radio-group ${className}`}
      data-default-value={defaultValue}
    >
      {children}
    </div>
  );
};

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className = "", ...props }, ref) => {
  return (
    <input
      type="radio"
      ref={ref}
      {...props}
      className={`radio-group-item ${className}`}
    />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
