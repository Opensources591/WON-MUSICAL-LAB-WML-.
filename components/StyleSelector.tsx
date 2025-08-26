"use client"

interface StyleSelectorProps {
  value: string
  onChange: (style: string) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const styles = [
    { key: "traditional-gospel", label: "Traditional Gospel", icon: "⛪", description: "Classic church style" },
    { key: "contemporary-gospel", label: "Contemporary Gospel", icon: "🎵", description: "Modern worship" },
    { key: "gospel-amapiano", label: "Gospel Amapiano", icon: "🎹", description: "African fusion" },
    { key: "gospel-rnb", label: "Gospel R&B", icon: "🎤", description: "Soulful and smooth" },
    { key: "praise-worship", label: "Praise & Worship", icon: "🙌", description: "Uplifting praise" },
    { key: "spiritual-ballad", label: "Spiritual Ballad", icon: "💫", description: "Emotional and deep" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">🎨 Choose Your Style</h3>
        <p className="text-sm text-gray-300 mb-4">Select the gospel music style that fits your message</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {styles.map((style) => (
          <button
            key={style.key}
            onClick={() => onChange(style.key)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              value === style.key
                ? "border-blue-500 bg-blue-600/20 shadow-lg"
                : "border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{style.icon}</span>
              <span className="font-medium text-white">{style.label}</span>
            </div>
            <p className="text-sm text-gray-400">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
