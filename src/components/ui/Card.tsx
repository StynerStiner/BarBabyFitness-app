// src/components/ui/Card.tsx

import React from "react";

interface CardProps {
  /** Optional Tailwind or custom classes */
  className?: string;
  /** The nested React elements */
  children: React.ReactNode;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * A simple card container.
 */
export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

/**
 * A card header section, typically placed at the top.
 */
export const CardHeader: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

/**
 * A card content section, usually the main body.
 */
export const CardContent: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};
