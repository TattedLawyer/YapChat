'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'

interface TypographyProps {
    children: React.ReactNode
    variant?: 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
    color?: 'primary' | 'secondary' | 'muted' | 'character' | 'accent'
    align?: 'left' | 'center' | 'right'
    as?: TypographyElement
    animated?: boolean
    className?: string
}

const fontFamilies = {
    display: 'font-display', // Lora serif for major headings
    heading: 'font-display', // Lora serif for headings
    subheading: 'font-body', // Inter for subheadings
    body: 'font-body',       // Inter for body text
    caption: 'font-body',    // Inter for captions
    label: 'font-body'       // Inter for labels
}

const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
}

const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
}

const colors = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    character: 'text-[var(--character-color)]',
    accent: 'text-accent-primary'
}

const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
}

// Default element mapping
const defaultElements: Record<string, TypographyElement> = {
    display: 'h1',
    heading: 'h2',
    subheading: 'h3',
    body: 'p',
    caption: 'span',
    label: 'span'
}

// Default sizes for variants
const defaultSizes: Record<string, keyof typeof sizes> = {
    display: '4xl',
    heading: '2xl',
    subheading: 'xl',
    body: 'md',
    caption: 'sm',
    label: 'sm'
}

// Default weights for variants
const defaultWeights: Record<string, keyof typeof weights> = {
    display: 'bold',
    heading: 'semibold',
    subheading: 'medium',
    body: 'normal',
    caption: 'normal',
    label: 'medium'
}

export function Typography({
    children,
    variant = 'body',
    size,
    weight,
    color = 'primary',
    align = 'left',
    as,
    animated = false,
    className,
    ...props
}: TypographyProps) {
    const Component = as || defaultElements[variant] || 'div'
    const finalSize = size || defaultSizes[variant]
    const finalWeight = weight || defaultWeights[variant]

    const classes = cn(
        // Font family based on variant
        fontFamilies[variant],

        // Size
        sizes[finalSize],

        // Weight
        weights[finalWeight],

        // Color
        colors[color],

        // Alignment
        alignments[align],

        // Line height for readability
        variant === 'body' && 'leading-relaxed',
        variant === 'caption' && 'leading-normal',
        (variant === 'display' || variant === 'heading') && 'leading-tight',

        // Additional spacing for display text
        variant === 'display' && 'tracking-tight',

        className
    )

    if (animated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="inline-block"
            >
                <Component className={classes} {...props}>
                    {children}
                </Component>
            </motion.div>
        )
    }

    return (
        <Component className={classes} {...props}>
            {children}
        </Component>
    )
}

// Pre-configured typography components for common use cases
export function DisplayText({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="display" {...props}>{children}</Typography>
}

export function Heading({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="heading" {...props}>{children}</Typography>
}

export function Subheading({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="subheading" {...props}>{children}</Typography>
}

export function BodyText({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="body" {...props}>{children}</Typography>
}

export function Caption({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="caption" {...props}>{children}</Typography>
}

export function Label({ children, ...props }: Omit<TypographyProps, 'variant'>) {
    return <Typography variant="label" {...props}>{children}</Typography>
}

export default Typography 