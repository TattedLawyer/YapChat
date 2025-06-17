'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Settings, Eye, EyeOff, Heart, Lock, Info, Check, X } from 'lucide-react'

interface NSFWSettingsProps {
    isOpen: boolean
    onClose: () => void
    isAgeVerified: boolean
    onRequestAgeVerification: () => void
}

interface NSFWPreferences {
    allowMildContent: boolean
    allowModerateContent: boolean
    allowExplicitContent: boolean
    showContentWarnings: boolean
    enableSafeMode: boolean
}

export default function NSFWSettings({ isOpen, onClose, isAgeVerified, onRequestAgeVerification }: NSFWSettingsProps) {
    const [preferences, setPreferences] = useState<NSFWPreferences>({
        allowMildContent: false,
        allowModerateContent: false,
        allowExplicitContent: false,
        showContentWarnings: true,
        enableSafeMode: true
    })

    // Load preferences from localStorage
    useEffect(() => {
        const savedPrefs = localStorage.getItem('nsfwPreferences')
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs))
        }
    }, [])

    // Save preferences to localStorage
    const savePreferences = (newPrefs: NSFWPreferences) => {
        setPreferences(newPrefs)
        localStorage.setItem('nsfwPreferences', JSON.stringify(newPrefs))
    }

    const handleToggle = (key: keyof NSFWPreferences) => {
        if (!isAgeVerified && (key === 'allowMildContent' || key === 'allowModerateContent' || key === 'allowExplicitContent')) {
            onRequestAgeVerification()
            return
        }

        const newPrefs = { ...preferences, [key]: !preferences[key] }

        // Auto-enable lower levels when higher levels are enabled
        if (key === 'allowExplicitContent' && newPrefs.allowExplicitContent) {
            newPrefs.allowModerateContent = true
            newPrefs.allowMildContent = true
        } else if (key === 'allowModerateContent' && newPrefs.allowModerateContent) {
            newPrefs.allowMildContent = true
        }

        // Auto-disable higher levels when lower levels are disabled
        if (key === 'allowMildContent' && !newPrefs.allowMildContent) {
            newPrefs.allowModerateContent = false
            newPrefs.allowExplicitContent = false
        } else if (key === 'allowModerateContent' && !newPrefs.allowModerateContent) {
            newPrefs.allowExplicitContent = false
        }

        savePreferences(newPrefs)
    }

    const getContentStatus = () => {
        if (!isAgeVerified) return 'Age verification required'
        if (preferences.enableSafeMode) return 'Safe mode enabled'
        if (preferences.allowExplicitContent) return 'All content enabled'
        if (preferences.allowModerateContent) return 'Moderate content enabled'
        if (preferences.allowMildContent) return 'Mild content enabled'
        return 'All mature content disabled'
    }

    const getStatusColor = () => {
        if (!isAgeVerified || preferences.enableSafeMode) return 'text-green-600'
        if (preferences.allowExplicitContent) return 'text-red-600'
        if (preferences.allowModerateContent) return 'text-orange-600'
        if (preferences.allowMildContent) return 'text-yellow-600'
        return 'text-gray-600'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Content Settings</h2>
                            <p className="text-sm text-gray-600">Manage your mature content preferences</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Current Status</span>
                    </div>
                    <p className={`text-sm font-medium ${getStatusColor()}`}>
                        {getContentStatus()}
                    </p>
                </div>

                {/* Age Verification Section */}
                {!isAgeVerified && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-1">Age Verification Required</h3>
                                <p className="text-sm text-amber-700 mb-3">
                                    You must verify that you are 18+ to access mature content features.
                                </p>
                                <button
                                    onClick={onRequestAgeVerification}
                                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                                >
                                    Verify Age
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Level Settings */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Content Preferences</h3>

                    {/* Safe Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-green-600" />
                            <div>
                                <h4 className="font-medium text-green-800">Safe Mode</h4>
                                <p className="text-sm text-green-700">Blocks all mature content</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleToggle('enableSafeMode')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.enableSafeMode ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.enableSafeMode ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                        </button>
                    </div>

                    {/* Mild Content */}
                    <div className={`p-4 rounded-lg border transition-opacity ${preferences.enableSafeMode ? 'opacity-50' : 'opacity-100'
                        } ${preferences.allowMildContent ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Heart className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Mild Romantic Content</h4>
                                    <p className="text-sm text-gray-600">Unlocks at Relationship Level 4+</p>
                                    <p className="text-xs text-gray-500 mt-1">Compliments, light affection, romantic tension</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle('allowMildContent')}
                                disabled={preferences.enableSafeMode}
                                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.allowMildContent && !preferences.enableSafeMode ? 'bg-yellow-600' : 'bg-gray-300'
                                    } disabled:opacity-50`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.allowMildContent && !preferences.enableSafeMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Moderate Content */}
                    <div className={`p-4 rounded-lg border transition-opacity ${preferences.enableSafeMode ? 'opacity-50' : 'opacity-100'
                        } ${preferences.allowModerateContent ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Heart className="w-5 h-5 text-orange-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Moderate Intimate Content</h4>
                                    <p className="text-sm text-gray-600">Unlocks at Relationship Level 6+</p>
                                    <p className="text-xs text-gray-500 mt-1">Sensual conversations, physical attraction discussions</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle('allowModerateContent')}
                                disabled={preferences.enableSafeMode}
                                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.allowModerateContent && !preferences.enableSafeMode ? 'bg-orange-600' : 'bg-gray-300'
                                    } disabled:opacity-50`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.allowModerateContent && !preferences.enableSafeMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    {/* Explicit Content */}
                    <div className={`p-4 rounded-lg border transition-opacity ${preferences.enableSafeMode ? 'opacity-50' : 'opacity-100'
                        } ${preferences.allowExplicitContent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Heart className="w-5 h-5 text-red-600" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Explicit Adult Content</h4>
                                    <p className="text-sm text-gray-600">Unlocks at Relationship Level 7+</p>
                                    <p className="text-xs text-gray-500 mt-1">Sexual conversations, intimate scenarios</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle('allowExplicitContent')}
                                disabled={preferences.enableSafeMode}
                                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.allowExplicitContent && !preferences.enableSafeMode ? 'bg-red-600' : 'bg-gray-300'
                                    } disabled:opacity-50`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.allowExplicitContent && !preferences.enableSafeMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-900">Additional Options</h3>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Eye className="w-5 h-5 text-gray-600" />
                            <div>
                                <h4 className="font-medium text-gray-900">Content Warnings</h4>
                                <p className="text-sm text-gray-600">Show warnings before mature content</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleToggle('showContentWarnings')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${preferences.showContentWarnings ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.showContentWarnings ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                        </button>
                    </div>
                </div>

                {/* Information */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Content unlocks as your relationship with companions grows</li>
                        <li>• Characters maintain their personalities while respecting your preferences</li>
                        <li>• You can change these settings anytime</li>
                        <li>• Safe mode can be enabled instantly if you feel uncomfortable</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        Save Settings
                    </button>
                </div>
            </motion.div>
        </div>
    )
} 