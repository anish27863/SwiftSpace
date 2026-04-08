import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, children, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[oklch(0.28_0.015_265)]"
          >
            {label}
            {props.required && (
              <span className="text-[oklch(0.58_0.22_25)] ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-[var(--radius-md)] border bg-white px-3.5 py-2.5 text-sm pr-9',
              'text-[oklch(0.16_0.01_265)]',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.25_285)] focus:ring-offset-0',
              error
                ? 'border-[oklch(0.70_0.15_25)]'
                : 'border-[oklch(0.85_0.005_265)] hover:border-[oklch(0.75_0.08_285)] focus:border-[oklch(0.58_0.25_285)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.60_0.01_265)] pointer-events-none"
          />
        </div>
        {error && (
          <p className="text-xs text-[oklch(0.50_0.18_25)]">⚠ {error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[oklch(0.58_0.005_265)]">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
