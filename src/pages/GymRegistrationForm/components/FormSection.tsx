import * as React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
  isComplete?: boolean;
  index?: number;
  variant?: "default" | "bordered" | "card";
}

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: index * 0.1,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  className = "",
  title,
  description,
  isLoading = false,
  isComplete = false,
  index = 0,
  variant = "default",
}) => {
  // Define variant-specific styles
  const variantStyles = {
    default: "space-y-6",
    bordered:
      "space-y-6 border border-gray-200 dark:border-gray-800 rounded-lg p-6",
    card: "space-y-6 bg-white/5 backdrop-blur-sm rounded-lg p-6 shadow-lg",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={title || "form-section"}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={index}
        className={cn(
          variantStyles[variant],
          "relative",
          isComplete && "border-green-500/20",
          className,
        )}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </motion.div>
        )}

        {/* Title and Description */}
        {(title || description) && (
          <div className="space-y-2">
            {title && (
              <h3 className="text-lg font-semibold text-orange-500">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            "relative",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          {children}
        </div>

        {/* Completion Indicator */}
        {isComplete && (
          <div className="text-green-500 text-sm flex items-center gap-2 mt-4">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Section completed
          </div>
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default FormSection;
