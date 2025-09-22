import React from "react";

type ButtonVariant = "primary" | "secondary" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content to be displayed inside the button. Can be text, an icon, or both.
   */
  children: React.ReactNode;
  /**
   * The visual style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Optional custom CSS classes to be added to the button for specific adjustments.
   */
  className?: string;
}

/**
 * A versatile and accessible button component with pre-defined styles and sizes.
 * It's built to be the standard button for the entire application, ensuring
 * a consistent look and feel.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses = "font-bold rounded-md cursor-pointer transition-colors focus:outline-3 focus:outline-offset-2";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:outline-blue-400 focus:outline-dashed",
    secondary: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:outline-pink-400 focus:outline-dashed",
    destructive:
      "bg-neutral-800/20 text-white hover:text-white hover:bg-red-700 focus:outline-red-400 focus:outline-dashed",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "py-1 px-3 ",
    md: "py-2 px-4 text-lg",
    lg: "py-3 px-6 text-xl",
  };

  const disabledClasses = "disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed";

  const finalClassName = [baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className].join(
    " "
  );

  return (
    <button className={finalClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
