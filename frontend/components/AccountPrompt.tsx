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
        id: 'free',
        name: 'Free',
        price: '$0',
        features: [
            '2 AI Companions',
            'Basic conversations',
            'Community support'
        ],
        buttonText: 'Create Free Account',
        popular: false
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '$9.99/month',
        features: [
            '5 AI Companions',
            'Advanced personality matching',
            'Priority support',
            'Custom companion personalities',
            'Relationship progression tracking'
        ],
        buttonText: 'Start Premium Trial',
        popular: true
    },
    {
        id: 'ultimate',
        name: 'Ultimate',
        price: '$19.99/month',
        features: [
            '10 AI Companions',
            'All Premium features',
            'Early access to new features',
            'Dedicated support',
            'Custom companion creation tools',
            'Advanced analytics'
        ],
        buttonText: 'Go Ultimate',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">🎉 You're chatting like a pro!</h2>
                        <p className="text-gray-600 mt-1">Save your progress and unlock more companions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {!showSignUpForm ? (
                    <>
                        {/* Pricing Tiers */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-center mb-6">Choose Your Plan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pricingTiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedTier === tier.id
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                            } ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}
                                    >
                                        {tier.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-4">
                                            <div className="flex items-center justify-center mb-2">
                                                {tier.id === 'free' && <UserIcon className="h-6 w-6 text-gray-500" />}
                                                {tier.id === 'premium' && <Star className="h-6 w-6 text-blue-500" />}
                                                {tier.id === 'ultimate' && <Crown className="h-6 w-6 text-purple-500" />}
                                            </div>
                                            <h4 className="text-lg font-semibold">{tier.name}</h4>
                                            <p className="text-2xl font-bold text-purple-600">{tier.price}</p>
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {tier.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {selectedTier === tier.id && (
                                            <div className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-xl pointer-events-none">
                                                <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-1">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sign Up Options */}
                        <div className="p-6 border-t border-gray-200">
                            <div className="max-w-md mx-auto space-y-4">
                                <button
                                    onClick={handleGoogleSignUp}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">or</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowSignUpForm(true)}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Mail className="h-5 w-5" />
                                    Sign up with Email
                                </button>

                                <div className="text-center">
                                    <span className="text-gray-600">Already have an account? </span>
                                    <button
                                        onClick={onSignIn}
                                        className="text-purple-600 hover:text-purple-700 font-medium"
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
                            <h3 className="text-xl font-semibold text-center mb-6">Create Your Account</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Choose a username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Create a password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Create Account ({pricingTiers.find(t => t.id === selectedTier)?.name})
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowSignUpForm(false)}
                                className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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