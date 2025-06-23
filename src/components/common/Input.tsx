import { type InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white  mb-2">
            {label}
          </label>
        )}
        <div className="relative border border-white/20 rounded-[12px]">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
            w-full px-4 py-3 
            ${leftIcon ? "pl-12" : ""} 
            ${rightIcon ? "pr-12" : ""} 
            border border-white rounded-lg 
            bg-transparent 
            text-white  
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent 
            dark:border-black/20 dark:focus:ring-white
            transition-all
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
