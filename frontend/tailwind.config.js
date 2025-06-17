/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'display': ['Lora', 'serif'],
                'body': ['Inter', 'sans-serif'],
            },
            colors: {
                // YapChat Premium Color System
                background: {
                    primary: 'rgb(9 9 11)', // zinc-900
                    secondary: 'rgb(24 24 27)', // zinc-800
                    glass: 'rgba(255, 255, 255, 0.1)',
                    'glass-hover': 'rgba(255, 255, 255, 0.15)',
                },
                text: {
                    primary: 'rgb(244 244 245)', // zinc-100
                    secondary: 'rgb(161 161 170)', // zinc-400
                    muted: 'rgb(113 113 122)', // zinc-500
                },
                border: {
                    primary: 'rgb(63 63 70)', // zinc-700
                    glass: 'rgba(255, 255, 255, 0.2)',
                },
                accent: {
                    primary: 'rgb(139 92 246)', // violet-500
                    secondary: 'rgb(236 72 153)', // pink-500
                    success: 'rgb(34 197 94)', // green-500
                    warning: 'rgb(251 191 36)', // amber-400
                    danger: 'rgb(239 68 68)', // red-500
                },
                // Character-specific theming (preserved from existing)
                character: {
                    aria: '#ec4899',     // Pink for Tsundere
                    sage: '#10b981',     // Green for Wise Mentor
                    riley: '#f59e0b',    // Orange for Playful Friend
                    alex: '#8b5cf6',     // Purple for Mysterious Romantic
                    // New character accent colors
                    gojo: '#00d4ff',     // Cyan for Jujutsu Kaisen
                    hermione: '#d4af37', // Gold for Harry Potter
                    default: '#8b5cf6',  // Default purple
                }
            },
            backgroundImage: {
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                'gradient-primary': 'linear-gradient(135deg, rgb(139 92 246) 0%, rgb(236 72 153) 100%)',
                'gradient-character': 'linear-gradient(135deg, var(--character-color, rgb(139 92 246)) 0%, rgba(0, 0, 0, 0.3) 100%)',
            },
            backdropBlur: {
                'glass': '16px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'bounce-subtle': 'bounceSubtle 2s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'prism-form': 'prismForm 4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                pulseGlow: {
                    '0%': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                        transform: 'scale(1)'
                    },
                    '100%': {
                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
                        transform: 'scale(1.02)'
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                prismForm: {
                    '0%, 100%': {
                        transform: 'rotate(0deg) scale(1)',
                        borderRadius: '20%'
                    },
                    '25%': {
                        transform: 'rotate(90deg) scale(1.1)',
                        borderRadius: '30%'
                    },
                    '50%': {
                        transform: 'rotate(180deg) scale(1)',
                        borderRadius: '40%'
                    },
                    '75%': {
                        transform: 'rotate(270deg) scale(1.1)',
                        borderRadius: '30%'
                    },
                }
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },
            borderRadius: {
                'glass': '16px',
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glass-lg': '0 20px 40px 0 rgba(0, 0, 0, 0.4)',
                'character': '0 0 30px var(--character-color, rgb(139 92 246))',
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        // Custom CSS variables plugin for character theming
        function ({ addBase, theme }) {
            addBase({
                ':root': {
                    '--character-color': theme('colors.character.default'),
                }
            })
        }
    ],
} 