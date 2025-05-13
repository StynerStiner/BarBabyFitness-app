// src/components/ui/label.tsx
import React from "react";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (
  props,
) => {
  return (
    <label {...props} className={`label ${props.className}`}>
      {props.children}
    </label>
  );
};
