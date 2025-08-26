"use client"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  language: "english" | "yoruba" | "pidgin"
  onLanguageChange: (language: "english" | "yoruba" | "pidgin") => void
}

export function TextInput({ value, onChange, language, onLanguageChange }: TextInputProps) {
  const maxLength = 500
  const remainingChars = maxLength - value.length

  const languageExamples = {
    english: "Create a joyful gospel song about God's love and mercy...",
    yoruba: "Ṣe orin gospel ti o ni ayọ nipa ifẹ ati aanu Ọlọrun...",
    pidgin: "Make one gospel song wey go make person happy about God love...",
  }

  const languages = [
    { key: "english" as const, label: "English", flag: "🇺🇸" },
    { key: "yoruba" as const, label: "Yorùbá", flag: "🇳🇬" },
    { key: "pidgin" as const, label: "Pidgin", flag: "🇳🇬" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt" className="text-lg font-semibold text-white mb-2 block">
          🎵 Your Gospel Message
        </Label>
        <p className="text-sm text-gray-300 mb-3">Describe the gospel song, lyrics, or message you want to create</p>
      </div>

      {/* Language Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang) => (
          <button
            key={lang.key}
            onClick={() => onLanguageChange(lang.key)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
              language === lang.key ? "bg-blue-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>

      {/* Text Input */}
      <div className="relative">
        <Textarea
          id="prompt"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={languageExamples[language]}
          className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
          maxLength={maxLength}
        />

        {/* Character Counter */}
        <div className="absolute bottom-3 right-3">
          <Badge variant={remainingChars < 50 ? "destructive" : "secondary"} className="text-xs">
            {remainingChars} left
          </Badge>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>
          💡 <strong>Tip:</strong> Keep it under 500 characters for best audio quality (≈59 seconds)
        </p>
        <p>
          🎤 <strong>Voice:</strong> Custom gospel voice trained for spiritual content
        </p>
      </div>
    </div>
  )
}
