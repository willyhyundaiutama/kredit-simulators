
import React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, prefix, suffix, description, error, ...props }, ref) => {
    // Determine if this should use numeric keyboard
    const isNumericInput = props.type === 'number' || props.type === 'text' && (prefix === 'Rp' || suffix === '%');
    
    return (
      <div className="animate-fade-in space-y-1.5 w-full">
        <label className="input-label block">{label}</label>
        
        <div className="relative rounded-md shadow-sm">
          {prefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">{prefix}</span>
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "block w-full rounded-md border border-input bg-background px-3 py-2.5 shadow-input transition-all",
              "text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80",
              prefix && "pl-9",
              suffix && "pr-9",
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              className
            )}
            inputMode={isNumericInput ? "numeric" : undefined}
            {...props}
          />
          
          {suffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">{suffix}</span>
            </div>
          )}
        </div>
        
        {description && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
        
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
