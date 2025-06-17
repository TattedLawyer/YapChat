'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'character' | 'glass' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    glow?: boolean
    pulse?: boolean
    loading?: boolean
    fullWidth?: boolean
    className?: string
}

const variants = {
    primary: 'bg-gradient-primary text-white border-transparent hover:shadow-glow',
    secondary: 'bg-background-secondary text-text-primary border-border-primary hover:bg-background-glass',
    character: 'bg-gradient-character text-white border-[var(--character-color)] hover:shadow-character',
    glass: 'bg-background-glass text-text-primary border-border-glass hover:bg-background-glass-hover',
    ghost: 'bg-transparent text-text-secondary border-transparent hover:bg-background-glass hover:text-text-primary'
}

const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
    xl: 'px-10 py-5 text-xl rounded-3xl'
}

export function AnimatedButton({
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    pulse = false,
    loading = false,
    fullWidth = false,
    className,
    disabled,
    ...motionProps
}: AnimatedButtonProps) {
    const baseClasses = cn(
        // Base button styling
        'relative inline-flex items-center justify-center',
        'font-medium transition-all duration-200',
        'border backdrop-blur-sm',
        'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variant-specific styling
        variants[variant],

        // Size-specific styling
        sizes[size],

        // Full width
        fullWidth && 'w-full',

        // Glow effect
        glow && 'shadow-glow-lg',

        // Pulse animation
        pulse && 'animate-pulse-glow',

        // Custom className
        className
    )

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2, ease: 'easeOut' }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1, ease: 'easeInOut' }
        }
    }

    return (
        <motion.button
            className={baseClasses}
            variants={buttonVariants}
            initial="initial"
            whileHover={!disabled && !loading ? "hover" : undefined}
            whileTap={!disabled && !loading ? "tap" : undefined}
            disabled={disabled || loading}
            {...motionProps}
        >
            {/* Background shimmer effect */}
            {glow && !disabled && (
                <div className="absolute inset-0 rounded-inherit overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                </div>
            )}

            {/* Loading spinner */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Button content */}
            <span className={cn(
                'relative z-10 flex items-center gap-2',
                loading && 'opacity-0'
            )}>
                {children}
            </span>
        </motion.button>
    )
}

export default AnimatedButton 