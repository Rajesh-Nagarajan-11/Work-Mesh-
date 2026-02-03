import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showClearButton?: boolean;
    onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            leftIcon,
            rightIcon,
            showClearButton,
            onClear,
            type = 'text',
            className = '',
            value,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        const baseStyles =
            'w-full px-4 py-2 text-base border rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-secondary-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-secondary-500';

        const errorStyles = error
            ? 'border-error focus:ring-error focus:border-error'
            : 'border-border dark:border-slate-700 hover:border-secondary-400 dark:hover:border-slate-600';

        const successStyles =
            !error && value && String(value).length > 0
                ? 'border-success focus:ring-success focus:border-success'
                : '';

        const paddingStyles = `${leftIcon ? 'pl-10' : ''} ${rightIcon || isPassword || (showClearButton && value) ? 'pr-10' : ''
            }`;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        value={value}
                        className={`${baseStyles} ${errorStyles} ${successStyles} ${paddingStyles} ${className}`}
                        {...props}
                    />

                    {/* Right side icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {showClearButton && value && String(value).length > 0 && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="text-secondary-400 hover:text-secondary-600 transition-colors"
                                aria-label="Clear input"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-secondary-400 hover:text-secondary-600 transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        )}

                        {rightIcon && !isPassword && <div className="text-secondary-400">{rightIcon}</div>}
                    </div>
                </div>

                {error && <p className="mt-1 text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
