'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, Crown, Check, Mail, User as UserIcon } from 'lucide-react'

interface AccountPromptProps {
    onClose: () => void
    onSignUp: (method: 'google' | 'email', data?: any) => void
    onSignIn: () => void
}

const pricingTiers = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$4.99/month',
        features: [
            '50 conversations/day',
            '2 AI Companions',
            'Basic memory system',
            'Community support'
        ],
        buttonText: 'Start Free Trial',
        popular: false
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '$9.99/month',
        features: [
            '100 conversations/day',
            '5 AI Companions',
            'Advanced memory system',
            'Personality matching',
            'Priority support'
        ],
        buttonText: 'Start Premium Trial',
        popular: true
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$16.99/month',
        features: [
            '200 conversations/day',
            '10 AI Companions',
            'Multi-character learning',
            'Advanced analytics',
            'Dedicated support'
        ],
        buttonText: 'Go Pro',
        popular: false
    }
]

export default function AccountPrompt({ onClose, onSignUp, onSignIn }: AccountPromptProps) {
    const [showSignUpForm, setShowSignUpForm] = useState(false)
    const [selectedTier, setSelectedTier] = useState('free')
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })

    const handleGoogleSignUp = () => {
        onSignUp('google', { tier: selectedTier })
    }

    const handleEmailSignUp = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        onSignUp('email', { ...formData, tier: selectedTier })
    }

    return (
        <div className="fixed inset-0 bg-background-overlay z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="yapchat-glass-intense rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto yapchat-glow-character-intense"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-glass">
                    <div>
                        <h2 className="text-2xl font-bold font-display text-text-primary">🎉 You&apos;re bonding amazingly!</h2>
                        <p className="text-text-secondary mt-1 font-body">Save your progress and unlock more companions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="yapchat-btn-glass p-2 rounded-xl"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!showSignUpForm ? (
                    <>
                        {/* Pricing Tiers */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold font-display text-text-primary text-center mb-6">Choose Your YapChat Plan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pricingTiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`relative yapchat-glass rounded-2xl p-6 cursor-pointer transition-all duration-300 yapchat-glow ${selectedTier === tier.id
                                            ? 'yapchat-glass-accent border-2 border-accent-primary'
                                            : 'border-2 border-border-glass hover:border-accent-primary'
                                            } ${tier.popular ? 'yapchat-glow-character' : ''}`}
                                    >
                                        {tier.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="yapchat-badge-premium px-3 py-1 text-xs font-medium font-body">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-4">
                                            <div className="flex items-center justify-center mb-2">
                                                {tier.id === 'free' && <UserIcon className="h-6 w-6 text-text-muted" />}
                                                {tier.id === 'premium' && <Star className="h-6 w-6 text-accent-primary yapchat-glow" />}
                                                {tier.id === 'ultimate' && <Crown className="h-6 w-6 text-accent-warning yapchat-glow" />}
                                            </div>
                                            <h4 className="text-lg font-semibold font-display text-text-primary">{tier.name}</h4>
                                            <p className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-primary">{tier.price}</p>
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {tier.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm font-body">
                                                    <Check className="h-4 w-4 text-accent-success flex-shrink-0 yapchat-glow" />
                                                    <span className="text-text-secondary">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {selectedTier === tier.id && (
                                            <div className="absolute inset-0 yapchat-glass-accent rounded-2xl pointer-events-none">
                                                <div className="absolute top-4 right-4 yapchat-badge-notification p-1">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sign Up Options */}
                        <div className="p-6 border-t border-border-glass">
                            <div className="max-w-md mx-auto space-y-4">
                                <button
                                    onClick={handleGoogleSignUp}
                                    className="yapchat-btn-glass w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-body"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border-glass" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 yapchat-glass text-text-muted font-body">or</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowSignUpForm(true)}
                                    className="yapchat-btn-character w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-body"
                                >
                                    <Mail className="h-5 w-5" />
                                    Sign up with Email
                                </button>

                                <div className="text-center">
                                    <span className="text-text-muted font-body">Already have an account? </span>
                                    <button
                                        onClick={onSignIn}
                                        className="text-accent-primary hover:text-accent-secondary font-medium font-body"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Email Sign Up Form */
                    <form onSubmit={handleEmailSignUp} className="p-6">
                        <div className="max-w-md mx-auto space-y-4">
                            <h3 className="text-xl font-semibold font-display text-text-primary text-center mb-6">Create Your YapChat Account</h3>

                            <div>
                                <label className="block text-sm font-medium font-body text-text-primary mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="yapchat-input-dashboard w-full px-3 py-2 rounded-xl font-body"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-body text-text-primary mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    className="yapchat-input-dashboard w-full px-3 py-2 rounded-xl font-body"
                                    placeholder="Choose a username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-body text-text-primary mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="yapchat-input-dashboard w-full px-3 py-2 rounded-xl font-body"
                                    placeholder="Create a password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-body text-text-primary mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="yapchat-input-dashboard w-full px-3 py-2 rounded-xl font-body"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="yapchat-btn-character w-full px-6 py-3 rounded-xl font-body"
                            >
                                Create Account ({pricingTiers.find(t => t.id === selectedTier)?.name})
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowSignUpForm(false)}
                                className="yapchat-btn-glass w-full px-6 py-2 rounded-xl font-body"
                            >
                                Back to Options
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    )
} 