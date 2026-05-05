import { getTTS } from './api'

const ttsPromiseCache = new Map()

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
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
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
