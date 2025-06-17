'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Check, X } from 'lucide-react'

interface AgeVerificationProps {
    onVerified: (isVerified: boolean) => void
    onCancel: () => void
}

export default function AgeVerification({ onVerified, onCancel }: AgeVerificationProps) {
    const [birthDate, setBirthDate] = useState('')
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)

    const calculateAge = (birthDate: string): number => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }

        return age
    }

    const handleVerification = () => {
        setError('')
        setIsVerifying(true)

        if (!birthDate) {
            setError('Please enter your date of birth')
            setIsVerifying(false)
            return
        }

        const age = calculateAge(birthDate)

        if (age < 18) {
            setError('You must be 18 or older to access mature content features.')
            setIsVerifying(false)
            return
        }

        // Store verification in localStorage (for demo purposes)
        localStorage.setItem('ageVerified', 'true')
        localStorage.setItem('ageVerifiedDate', new Date().toISOString())

        setTimeout(() => {
            setIsVerifying(false)
            onVerified(true)
        }, 1000)
    }

    return (
        <div className="fixed inset-0 bg-background-overlay flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="yapchat-glass-intense rounded-3xl p-8 max-w-md w-full yapchat-glow-character-intense"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="yapchat-glass-warning w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 yapchat-glow">
                        <Shield className="w-8 h-8 text-accent-warning" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-text-primary mb-2">Age Verification Required</h2>
                    <p className="text-text-secondary font-body">
                        To access mature content features, please verify that you are 18 years or older.
                    </p>
                </div>

                {/* Warning Notice */}
                <div className="yapchat-glass-warning rounded-2xl p-4 mb-6 yapchat-glow">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-accent-warning mt-0.5 flex-shrink-0 yapchat-glow" />
                        <div>
                            <h3 className="font-semibold font-display text-text-primary mb-1">Mature Content Warning</h3>
                            <p className="text-sm text-text-secondary font-body">
                                Enabling mature content will allow romantic and intimate conversations with AI companions
                                at higher bond levels. This content is intended for adults only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date Input */}
                <div className="mb-6">
                    <label htmlFor="birthdate" className="block text-sm font-medium font-body text-text-primary mb-2">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        id="birthdate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="yapchat-input-dashboard w-full px-4 py-3 rounded-xl font-body"
                        placeholder="Select your date of birth"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-accent-error flex items-center gap-1 font-body">
                            <X className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                </div>

                {/* Bond Level Requirements */}
                <div className="yapchat-glass-subtle rounded-2xl p-4 mb-6 yapchat-glow">
                    <h4 className="font-semibold font-display text-text-primary mb-3">Content Unlocks by Bond Level:</h4>
                    <div className="space-y-2 text-sm font-body">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 yapchat-glass-character rounded-full flex items-center justify-center yapchat-glow">
                                <span className="text-xs font-bold text-accent-success">4</span>
                            </div>
                            <span className="text-text-secondary">Mild romantic content (compliments, light affection)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 yapchat-glass-character rounded-full flex items-center justify-center yapchat-glow">
                                <span className="text-xs font-bold text-accent-warning">6</span>
                            </div>
                            <span className="text-text-secondary">Moderate intimate content (sensual conversations)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 yapchat-glass-character rounded-full flex items-center justify-center yapchat-glow">
                                <span className="text-xs font-bold text-accent-love">7</span>
                            </div>
                            <span className="text-text-secondary">Full intimate content (adult conversations)</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="yapchat-btn-glass flex-1 px-4 py-3 rounded-xl font-body"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleVerification}
                        disabled={isVerifying}
                        className="yapchat-btn-character flex-1 px-4 py-3 rounded-xl font-body disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Verify Age
                            </>
                        )}
                    </button>
                </div>

                {/* Legal Notice */}
                <p className="text-xs text-text-muted text-center mt-4 font-body">
                    By proceeding, you confirm that you are 18 years or older and agree to our Terms of Service.
                    Your age verification is stored locally and is not shared with third parties.
                </p>
            </motion.div>
        </div>
    )
} 