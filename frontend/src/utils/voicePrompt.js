import { getTTS } from './api'

const ttsPromiseCache = new Map()

function pickPreferredVoice(voices = []) {
  const list = Array.isArray(voices) ? voices : []
  if (list.length === 0) return null

  const isEnglish = (v) => (v?.lang || '').toLowerCase().startsWith('en')
  const name = (v) => (v?.name || '').toLowerCase()

  // Prefer commonly-available female English voices (esp. Windows).
  const femaleHints = [
    'zira', 'susan', 'samantha', 'karen', 'victoria',
    'female', 'woman', 'girl',
  ]

  const femaleEnglish = list.find(v => isEnglish(v) && femaleHints.some(h => name(v).includes(h)))
  if (femaleEnglish) return femaleEnglish

  // Next best: any en-US / en-GB voice.
  const enUS = list.find(v => (v?.lang || '').toLowerCase() === 'en-us')
  if (enUS) return enUS
  const enGB = list.find(v => (v?.lang || '').toLowerCase() === 'en-gb')
  if (enGB) return enGB

  // Fallback: any English voice, else whatever default exists.
  const anyEnglish = list.find(isEnglish)
  return anyEnglish || list[0]
}

function getCachedTTS(message) {
  const cached = ttsPromiseCache.get(message)
  if (cached) return cached

  const request = getTTS(message)
    .then((res) => {
      const blob = res?.data || null
      // Never cache a failed/empty response, so next attempt can retry.
      if (!blob) ttsPromiseCache.delete(message)
      return blob
    })
    .catch(() => {
      ttsPromiseCache.delete(message)
      return null
    })

  ttsPromiseCache.set(message, request)
  return request
}

function speakWithBrowserTTS(message, onStart, onError) {
  if (!('speechSynthesis' in window)) return null

  const utter = new SpeechSynthesisUtterance(message)
  utter.lang = 'en-US'
  utter.rate = 1.02
  utter.pitch = 1
  utter.onstart = onStart
  utter.onerror = onError

  const synth = window.speechSynthesis

  const speakNow = () => {
    try {
      const voices = synth.getVoices?.() || []
      const preferred = pickPreferredVoice(voices)
      if (preferred) utter.voice = preferred
      synth.cancel()
      synth.speak(utter)
      return true
    } catch {
      return false
    }
  }

  // Voices often load async on first page load (common in Chrome/Edge).
  const voices = synth.getVoices?.() || []
  if (voices.length > 0) {
    speakNow()
    return utter
  }

  // Wait for voices once, then speak with preferred (female) voice.
  const prev = synth.onvoiceschanged
  synth.onvoiceschanged = () => {
    try {
      synth.onvoiceschanged = prev || null
    } catch { /* ignore */ }
    speakNow()
  }

  // Some browsers never fire onvoiceschanged; attempt a quick delayed speak.
  setTimeout(() => { speakNow() }, 250)
  return utter
}

function bindOnceUserInteraction(handlerRef, fn) {
  if (handlerRef.current) return
  handlerRef.current = () => {
    window.removeEventListener('pointerdown', handlerRef.current)
    window.removeEventListener('keydown', handlerRef.current)
    fn()
  }
  window.addEventListener('pointerdown', handlerRef.current, { once: true })
  window.addEventListener('keydown', handlerRef.current, { once: true })
}

export function playVoicePrompt(message) {
  let objectUrl = null
  let audio = null
  let stopped = false
  let speechStarted = false
  let audioStarted = false
  const interactionHandler = { current: null }
  let fallbackTimer = null
  let interactionRetryTimer = null
  let interactionTriggered = false

  // Pre-warm TTS request immediately for faster fallback audio.
  void getCachedTTS(message)

  const cleanup = () => {
    stopped = true
    if (fallbackTimer) clearTimeout(fallbackTimer)
    if (interactionRetryTimer) clearTimeout(interactionRetryTimer)
    if (interactionHandler.current) {
      window.removeEventListener('pointerdown', interactionHandler.current)
      window.removeEventListener('keydown', interactionHandler.current)
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }

  const playApiAudio = async () => {
    if (stopped || speechStarted || audioStarted) return
    const blob = await getCachedTTS(message)
    if (!blob || stopped || speechStarted || audioStarted) return

    objectUrl = URL.createObjectURL(blob)
    audio = new Audio(objectUrl)
    audio.volume = 0.95
    audio.onplaying = () => { audioStarted = true }

    try {
      await audio.play()
    } catch {
      bindOnceUserInteraction(interactionHandler, async () => {
        if (stopped) return
        try { await audio.play() } catch {}
      })
    }
  }

  try {
    const utter = speakWithBrowserTTS(
      message,
      () => { speechStarted = true },
      () => { void playApiAudio() },
    )

    if (utter) {
      // If browser blocks/doesn't start speech quickly, use API fallback.
      fallbackTimer = setTimeout(() => {
        if (!speechStarted) void playApiAudio()
      }, 800)

      // If autoplay is blocked, replay right after first interaction.
      bindOnceUserInteraction(interactionHandler, () => {
        interactionTriggered = true
        if (speechStarted || audioStarted || stopped) return
        try {
          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(utter)
        } catch {
          void playApiAudio()
        }
        // Hard safety: even if speech retry is silently blocked, force API path.
        interactionRetryTimer = setTimeout(() => {
          if (!speechStarted && !audioStarted) void playApiAudio()
        }, 350)
      })
    } else {
      void playApiAudio()
      // No browser speech available; play API audio on first interaction if blocked.
      bindOnceUserInteraction(interactionHandler, () => {
        interactionTriggered = true
        if (!audioStarted && !stopped) void playApiAudio()
      })
    }
  } catch {
    void playApiAudio()
    bindOnceUserInteraction(interactionHandler, () => {
      interactionTriggered = true
      if (!audioStarted && !stopped) void playApiAudio()
    })
  }

  // Extra guard for strict autoplay environments:
  // if nothing started yet, auto-attempt again once user interacts.
  if (!interactionTriggered) {
    bindOnceUserInteraction(interactionHandler, () => {
      if (speechStarted || audioStarted || stopped) return
      void playApiAudio()
    })
  }

  return cleanup
}
