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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verification Required</h2>
                    <p className="text-gray-600">
                        To access mature content features, please verify that you are 18 years or older.
                    </p>
                </div>

                {/* Warning Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-amber-800 mb-1">Mature Content Warning</h3>
                            <p className="text-sm text-amber-700">
                                Enabling mature content will allow romantic and intimate conversations with AI companions
                                at higher relationship levels. This content is intended for adults only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date Input */}
                <div className="mb-6">
                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        id="birthdate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Select your date of birth"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <X className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                </div>

                {/* NSFW Level Requirements */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Content Unlocks by Relationship Level:</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-green-600">4</span>
                            </div>
                            <span className="text-gray-700">Mild romantic content (compliments, light affection)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-orange-600">6</span>
                            </div>
                            <span className="text-gray-700">Moderate intimate content (sensual conversations)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-red-600">7</span>
                            </div>
                            <span className="text-gray-700">Full intimate content (adult conversations)</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleVerification}
                        disabled={isVerifying}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <p className="text-xs text-gray-500 text-center mt-4">
                    By proceeding, you confirm that you are 18 years or older and agree to our Terms of Service.
                    Your age verification is stored locally and is not shared with third parties.
                </p>
            </motion.div>
        </div>
    )
} 