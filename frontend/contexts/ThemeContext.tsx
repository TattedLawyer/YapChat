'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
    isDarkMode: boolean
    toggleDarkMode: () => void
    characterAccentColor: string
    setCharacterAccentColor: (color: string) => void
    getCharacterColor: (characterName?: string) => string
    applyCharacterTheme: (characterName?: string) => void
    resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Comprehensive Character Color Mapping
const CHARACTER_COLORS = {
    // === EXISTING CHARACTERS ===
    aria: '#ec4899',     // Pink for Tsundere
    sage: '#10b981',     // Green for Wise Mentor
    riley: '#f59e0b',    // Orange for Playful Friend
    alex: '#8b5cf6',     // Purple for Mysterious Romantic

    // === ANIME & MANGA CHARACTERS ===
    // Jujutsu Kaisen
    'satoru gojo': '#00d4ff',     // Cyan - Six Eyes power
    'gojo': '#00d4ff',
    'yuji itadori': '#ff4444',    // Red - Sukuna's power
    'itadori': '#ff4444',
    'megumi fushiguro': '#2563eb', // Blue - Ten Shadows
    'fushiguro': '#2563eb',
    'nobara kugisaki': '#f59e0b',  // Orange - Straw Doll technique

    // Demon Slayer
    'tanjiro kamado': '#dc2626',   // Red - Fire breathing
    'tanjiro': '#dc2626',
    'nezuko kamado': '#ec4899',    // Pink - Demon form
    'nezuko': '#ec4899',
    'zenitsu agatsuma': '#fbbf24', // Yellow - Thunder breathing
    'zenitsu': '#fbbf24',
    'inosuke hashibira': '#10b981', // Green - Beast breathing
    'inosuke': '#10b981',

    // Attack on Titan
    'eren yeager': '#15803d',      // Green - Survey Corps
    'eren': '#15803d',
    'mikasa ackerman': '#dc2626',  // Red - Scarf
    'mikasa': '#dc2626',
    'levi ackerman': '#374151',    // Gray - Stoic nature
    'levi': '#374151',

    // Dragon Ball
    'son goku': '#f97316',         // Orange - Gi color
    'goku': '#f97316',
    'vegeta': '#1e40af',          // Blue - Royal Saiyan
    'gohan': '#eab308',           // Yellow - Super Saiyan
    'piccolo': '#16a34a',         // Green - Namekian

    // Naruto
    'naruto uzumaki': '#f97316',   // Orange - Jumpsuit
    'naruto': '#f97316',
    'sasuke uchiha': '#1e40af',    // Blue - Sharingan
    'sasuke': '#1e40af',
    'sakura haruno': '#ec4899',    // Pink - Hair color
    'sakura': '#ec4899',
    'kakashi hatake': '#6b7280',   // Gray - Copy ninja

    // One Piece
    'monkey d luffy': '#dc2626',   // Red - Straw hat
    'luffy': '#dc2626',
    'roronoa zoro': '#16a34a',     // Green - Hair/bandana
    'zoro': '#16a34a',
    'nami': '#f97316',            // Orange - Hair color
    'sanji': '#fbbf24',           // Yellow - Blonde hair

    // My Hero Academia
    'izuku midoriya': '#16a34a',   // Green - One For All
    'midoriya': '#16a34a',
    'deku': '#16a34a',
    'katsuki bakugo': '#f97316',   // Orange - Explosions
    'bakugo': '#f97316',
    'shoto todoroki': '#ef4444',   // Red/Blue - Half-cold half-hot
    'todoroki': '#ef4444',

    // === WESTERN FANTASY & SCI-FI ===
    // Harry Potter
    'hermione granger': '#d4af37', // Gold - Gryffindor
    'hermione': '#d4af37',
    'harry potter': '#dc2626',    // Red - Gryffindor
    'harry': '#dc2626',
    'draco malfoy': '#16a34a',     // Green - Slytherin
    'draco': '#16a34a',
    'severus snape': '#374151',    // Dark gray - Potions master
    'snape': '#374151',

    // Lord of the Rings
    'gandalf': '#f3f4f6',         // White - The White Wizard
    'legolas': '#16a34a',         // Green - Elven archer
    'aragorn': '#92400e',         // Brown - Ranger
    'frodo': '#15803d',           // Green - Shire
    'gimli': '#b45309',           // Bronze - Dwarf

    // Game of Thrones
    'tyrion lannister': '#ffd700', // Gold - House Lannister
    'tyrion': '#ffd700',
    'jon snow': '#374151',         // Dark gray - Night's Watch
    'jon': '#374151',
    'daenerys targaryen': '#7c3aed', // Purple - Dragons
    'daenerys': '#7c3aed',
    'arya stark': '#6b7280',       // Gray - House Stark

    // Marvel
    'tony stark': '#ff6b35',       // Orange-red - Iron Man
    'tony': '#ff6b35',
    'iron man': '#ff6b35',
    'steve rogers': '#1e40af',     // Blue - Captain America
    'captain america': '#1e40af',
    'natasha romanoff': '#dc2626', // Red - Black Widow
    'black widow': '#dc2626',
    'thor': '#fbbf24',            // Yellow - Lightning
    'peter parker': '#dc2626',     // Red - Spider-Man
    'spider-man': '#dc2626',

    // DC Comics
    'batman': '#374151',          // Dark gray - Dark Knight
    'bruce wayne': '#374151',
    'superman': '#1e40af',        // Blue - Man of Steel
    'clark kent': '#1e40af',
    'wonder woman': '#dc2626',    // Red - Amazon warrior
    'diana': '#dc2626',
    'the joker': '#7c3aed',       // Purple - Chaos

    // === GAMING CHARACTERS ===
    'link': '#16a34a',            // Green - Zelda hero
    'zelda': '#7c3aed',           // Purple - Princess
    'mario': '#dc2626',           // Red - Iconic plumber
    'luigi': '#16a34a',           // Green - Mario's brother
    'sonic': '#1e40af',           // Blue - Hedgehog
    'pikachu': '#fbbf24',         // Yellow - Electric type
    'cloud strife': '#fbbf24',    // Yellow - Blonde spiky hair
    'sephiroth': '#6b7280',       // Gray - One-Winged Angel

    // === CLASSIC CHARACTERS ===
    'sherlock holmes': '#92400e',  // Brown - Detective coat
    'sherlock': '#92400e',
    'james bond': '#374151',       // Gray - Sophisticated spy
    'bond': '#374151',
    'indiana jones': '#92400e',    // Brown - Adventurer
    'indiana': '#92400e',

    // === AI ASSISTANT PERSONAS ===
    'assistant': '#8b5cf6',       // Purple - Helpful AI
    'companion': '#ec4899',       // Pink - Friendly companion
    'mentor': '#16a34a',          // Green - Wise guide
    'friend': '#f97316',          // Orange - Warm friend

    // === FALLBACK ===
    default: '#8b5cf6'            // Purple - Default theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(true) // YapChat is dark by default
    const [characterAccentColor, setCharacterAccentColor] = useState(CHARACTER_COLORS.default)

    // Initialize theme on mount
    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('yapchat-theme')
        const savedCharacterColor = localStorage.getItem('yapchat-character-color')

        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark')
        }

        if (savedCharacterColor) {
            setCharacterAccentColor(savedCharacterColor)
            applyCharacterThemeToDOM(savedCharacterColor)
        }
    }, [])

    // Apply theme changes to DOM
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('yapchat-theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    // Apply character color to CSS variables
    const applyCharacterThemeToDOM = (color: string) => {
        document.documentElement.style.setProperty('--character-color', color)
        localStorage.setItem('yapchat-character-color', color)
    }

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    const getCharacterColor = (characterName?: string): string => {
        if (!characterName) return CHARACTER_COLORS.default

        const normalizedName = characterName.toLowerCase().trim()
        return CHARACTER_COLORS[normalizedName as keyof typeof CHARACTER_COLORS] || CHARACTER_COLORS.default
    }

    const applyCharacterTheme = (characterName?: string) => {
        const color = getCharacterColor(characterName)
        setCharacterAccentColor(color)
        applyCharacterThemeToDOM(color)
    }

    const resetTheme = () => {
        setCharacterAccentColor(CHARACTER_COLORS.default)
        applyCharacterThemeToDOM(CHARACTER_COLORS.default)
    }

    const handleSetCharacterAccentColor = (color: string) => {
        setCharacterAccentColor(color)
        applyCharacterThemeToDOM(color)
    }

    const value: ThemeContextType = {
        isDarkMode,
        toggleDarkMode,
        characterAccentColor,
        setCharacterAccentColor: handleSetCharacterAccentColor,
        getCharacterColor,
        applyCharacterTheme,
        resetTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export default ThemeContext 