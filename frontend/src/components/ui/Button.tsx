import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary:
                'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md',
            secondary:
                'bg-white text-primary border-2 border-primary hover:bg-primary-50 active:bg-primary-100 dark:bg-slate-800 dark:text-primary-300 dark:border-primary-400 dark:hover:bg-slate-700 dark:active:bg-slate-800',
            tertiary: 'bg-transparent text-primary hover:bg-primary-50 active:bg-primary-100',
            danger:
                'bg-error text-white hover:bg-error-700 active:bg-error-800 shadow-sm hover:shadow-md',
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm h-8',
            md: 'px-4 py-2 text-base h-10',
            lg: 'px-6 py-3 text-lg h-12',
        };

        const iconSizeStyles = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className={`${iconSizeStyles[size]} animate-spin mr-2`} />
                        Loading...
                    </>
                ) : (
                    <>
                        {leftIcon && <span className={`mr-2 ${iconSizeStyles[size]}`}>{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className={`ml-2 ${iconSizeStyles[size]}`}>{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
