import { useState, useRef } from 'react'
import { getTTS } from '../utils/api'

export default function AIAdviceBox({ advice }) {
  const [audioUrl, setAudioUrl]   = useState(null)
  const [loadingTTS, setLoadingTTS] = useState(false)
  const [playing, setPlaying]     = useState(false)
  const audioRef = useRef(null)

  const handleListen = async () => {
    if (audioUrl) {
      if (playing) {
        audioRef.current.pause()
        setPlaying(false)
      } else {
        audioRef.current.play()
        setPlaying(true)
      }
      return
    }
    try {
      setLoadingTTS(true)
      // Send first 500 chars only — Uplift API is more reliable with shorter text
    const shortText = advice.split('.').slice(0, 3).join('.') + '.'
    const res  = await getTTS(shortText.slice(0, 500))
      const blob = new Blob([res.data], { type: 'audio/mpeg' })
      const url  = URL.createObjectURL(blob)
      setAudioUrl(url)
      setTimeout(() => {
        audioRef.current.play()
        setPlaying(true)
      }, 100)
    } catch {
      alert('TTS unavailable. Check UPLIFT_API_KEY.')
    } finally {
      setLoadingTTS(false)
    }
  }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
      <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-on-surface">Personalized Academic Advice</h3>
          <p className="text-on-surface-variant text-sm mt-1">Based on your performance patterns and SHAP insights.</p>
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-surface-container-high border border-outline-variant rounded-xl p-4 flex items-center gap-4">
        <button
          onClick={handleListen}
          disabled={loadingTTS}
          className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container hover:scale-105 transition-transform disabled:opacity-60 flex-shrink-0"
        >
          {loadingTTS ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {playing ? 'pause' : 'play_arrow'}
            </span>
          )}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
            <span>Voice AI Summary</span>
            <span>{audioUrl ? 'Ready' : 'Click to generate'}</span>
          </div>
          <div className="w-full h-1.5 bg-outline-variant rounded-full overflow-hidden">
            <div className="bg-secondary-container h-full transition-all duration-300"
              style={{ width: playing ? '100%' : audioUrl ? '35%' : '0%' }} />
          </div>
        </div>

        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">volume_up</span>
      </div>

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
      )}
    </div>
  )
}
