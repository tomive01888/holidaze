import React from "react";

export interface SpinnerProps {
  /**
   * The size of the spinner.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional text to display below the spinner.
   */
  text?: string;
  /**
   * Optional custom CSS classes for the container.
   */
  className?: string;
}

/**
 * A simple, accessible loading spinner component built with TailwindCSS.
 * Used to indicate that data is being fetched or an action is in progress.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = "md", text, className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`} role="status" aria-live="polite">
      <div
        className={`
          animate-spin 
          rounded-full 
          border-solid 
          border-primary-500 
          border-t-transparent 
          ${sizeClasses[size]}
        `}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-neutral-50">{text}</p>}
    </div>
  );
};

export default Spinner;
