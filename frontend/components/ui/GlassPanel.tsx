'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode
    variant?: 'default' | 'intense' | 'subtle' | 'character'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    glow?: boolean
    blur?: boolean
    border?: boolean
    className?: string
}

const variants = {
    default: 'bg-background-glass border-border-glass',
    intense: 'bg-background-glass-hover border-border-glass',
    subtle: 'bg-white/5 border-white/10',
    character: 'bg-gradient-character border-[var(--character-color)]'
}

const sizes = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl',
    xl: 'p-10 rounded-3xl'
}

export function GlassPanel({
    children,
    variant = 'default',
    size = 'md',
    glow = false,
    blur = true,
    border = true,
    className,
    ...motionProps
}: GlassPanelProps) {
    const baseClasses = cn(
        // Base glassmorphism styling
        'relative',
        blur && 'backdrop-blur-glass',
        border && 'border',

        // Variant-specific styling
        variants[variant],

        // Size-specific styling
        sizes[size],

        // Glow effect
        glow && variant === 'character' && 'shadow-character',
        glow && variant !== 'character' && 'shadow-glow',

        // Custom className
        className
    )

    return (
        <motion.div
            className={baseClasses}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            {...motionProps}
        >
            {/* Optional shimmer effect overlay */}
            {glow && (
                <div className="absolute inset-0 rounded-inherit overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

// Utility function for combining classes (create if doesn't exist)
// Note: This assumes you have a utils file, if not we'll create it
export default GlassPanel 